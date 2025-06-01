#!/bin/bash

echo "🔥 Starting load test to trigger autoscaling..."

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up load test pods..."
    kubectl delete pod load-test-auth --ignore-not-found=true
    kubectl delete pod load-test-user --ignore-not-found=true
    kubectl delete pod load-test-frontend --ignore-not-found=true
    kubectl delete pod cpu-stress-auth --ignore-not-found=true
    kubectl delete pod cpu-stress-user --ignore-not-found=true
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Get service IPs (internal cluster IPs)
echo "Getting service endpoints..."
AUTH_SERVICE_IP=$(kubectl get service auth-service -o jsonpath='{.spec.clusterIP}')
USER_SERVICE_IP=$(kubectl get service user-service -o jsonpath='{.spec.clusterIP}')
FRONTEND_SERVICE_IP=$(kubectl get service frontend -o jsonpath='{.spec.clusterIP}')

echo "Auth Service IP: $AUTH_SERVICE_IP"
echo "User Service IP: $USER_SERVICE_IP" 
echo "Frontend Service IP: $FRONTEND_SERVICE_IP"

# Create multiple load test pods to generate CPU and memory load
echo "🚀 Creating load test pods..."

# High-frequency requests to auth service
kubectl run load-test-auth --image=busybox --restart=Never -- /bin/sh -c "
while true; do 
    for i in \$(seq 1 10); do 
        wget -q -O- http://$AUTH_SERVICE_IP/health &
    done
    sleep 0.1
done"

# High-frequency requests to user service
kubectl run load-test-user --image=busybox --restart=Never -- /bin/sh -c "
while true; do 
    for i in \$(seq 1 10); do 
        wget -q -O- http://$USER_SERVICE_IP/users &
        wget -q -O- http://$USER_SERVICE_IP/users/1 &
        wget -q -O- http://$USER_SERVICE_IP/stats &
    done
    sleep 0.1
done"

# Load test for frontend
kubectl run load-test-frontend --image=busybox --restart=Never -- /bin/sh -c "
while true; do 
    for i in \$(seq 1 5); do 
        wget -q -O- http://$FRONTEND_SERVICE_IP/ &
    done
    sleep 0.2
done"

# CPU stress test pods to generate more load
kubectl run cpu-stress-auth --image=busybox --restart=Never -- /bin/sh -c "
while true; do 
    for i in \$(seq 1 20); do 
        wget -q -O- http://$AUTH_SERVICE_IP/login -d -X POST --header='Content-Type: application/json' --body-data='{\"username\":\"admin\",\"password\":\"1234\"}' &
    done
    sleep 0.05
done"

kubectl run cpu-stress-user --image=busybox --restart=Never -- /bin/sh -c "
while true; do 
    for i in \$(seq 1 15); do 
        wget -q -O- http://$USER_SERVICE_IP/users &
        wget -q -O- http://$USER_SERVICE_IP/users/role/admin &
        wget -q -O- http://$USER_SERVICE_IP/users/department/Engineering &
    done
    sleep 0.05
done"

echo "✅ Load test pods created!"
echo "⏱️  Waiting for pods to start generating load..."
sleep 10

echo "🔍 Monitoring autoscaling (press Ctrl+C to stop and cleanup)..."
while true; do
    clear
    echo "==================== LOAD TEST MONITOR ===================="
    echo "Time: $(date)"
    echo ""
    
    echo "🔄 HPA Status:"
    kubectl get hpa -o custom-columns="NAME:.metadata.name,TARGETS:.status.currentMetrics[*].resource.current.averageUtilization,MIN:.spec.minReplicas,MAX:.spec.maxReplicas,REPLICAS:.status.currentReplicas" 2>/dev/null || kubectl get hpa
    echo ""
    
    echo "📈 VPA Recommendations:"
    kubectl get vpa -o custom-columns="NAME:.metadata.name,MODE:.spec.updatePolicy.updateMode,CPU-REQ:.status.recommendation.containerRecommendations[0].target.cpu,MEM-REQ:.status.recommendation.containerRecommendations[0].target.memory" 2>/dev/null || kubectl get vpa
    echo ""
    
    echo "🚀 Application Pods:"
    kubectl get pods -l app=auth -o custom-columns="NAME:.metadata.name,STATUS:.status.phase,READY:.status.containerStatuses[0].ready,CPU-REQ:.spec.containers[0].resources.requests.cpu,MEM-REQ:.spec.containers[0].resources.requests.memory"
    kubectl get pods -l app=user -o custom-columns="NAME:.metadata.name,STATUS:.status.phase,READY:.status.containerStatuses[0].ready,CPU-REQ:.spec.containers[0].resources.requests.cpu,MEM-REQ:.spec.containers[0].resources.requests.memory"
    kubectl get pods -l app=frontend -o custom-columns="NAME:.metadata.name,STATUS:.status.phase,READY:.status.containerStatuses[0].ready,CPU-REQ:.spec.containers[0].resources.requests.cpu,MEM-REQ:.spec.containers[0].resources.requests.memory"
    echo ""
    
    echo "📊 Load Test Pods:"
    kubectl get pods | grep -E "(load-test|cpu-stress)" | head -5
    echo ""
    
    echo "💻 Resource Usage:"
    kubectl top pods --sort-by=cpu 2>/dev/null | head -10 || echo "Metrics not available yet (wait ~60 seconds for metrics-server)..."
    echo ""
    
    echo "Press Ctrl+C to stop load test and cleanup..."
    sleep 15
done