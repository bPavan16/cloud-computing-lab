#!/bin/bash

echo "📊 Simple Autoscaling Monitor (no external URLs needed)..."

# Function to get frontend URL safely
get_frontend_url() {
    # Try to get NodePort
    NODE_PORT=$(kubectl get service frontend -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null)
    MINIKUBE_IP=$(minikube ip 2>/dev/null)
    
    if [ -n "$NODE_PORT" ] && [ -n "$MINIKUBE_IP" ]; then
        echo "http://$MINIKUBE_IP:$NODE_PORT"
    else
        echo "Use: kubectl port-forward service/frontend 8080:80"
    fi
}

echo "🌐 Frontend Access:"
echo "$(get_frontend_url)"
echo ""

while true; do
    clear
    echo "==================== AUTOSCALING DASHBOARD ===================="
    echo "Time: $(date)"
    echo ""
    
    echo "🎯 Deployment Status:"
    kubectl get deployments -o custom-columns="NAME:.metadata.name,READY:.status.readyReplicas,UP-TO-DATE:.status.updatedReplicas,AVAILABLE:.status.availableReplicas"
    echo ""
    
    echo "🔄 HPA Status:"
    if kubectl get hpa >/dev/null 2>&1; then
        kubectl get hpa
    else
        echo "No HPA resources found"
    fi
    echo ""
    
    echo "📈 VPA Status:"
    if kubectl get vpa >/dev/null 2>&1; then
        kubectl get vpa
    else
        echo "No VPA resources found"
    fi
    echo ""
    
    echo "🚀 Pods by Service:"
    echo "Auth Service:"
    kubectl get pods -l app=auth --no-headers 2>/dev/null | wc -l | xargs echo "  Replicas:"
    echo "User Service:" 
    kubectl get pods -l app=user --no-headers 2>/dev/null | wc -l | xargs echo "  Replicas:"
    echo "Frontend:"
    kubectl get pods -l app=frontend --no-headers 2>/dev/null | wc -l | xargs echo "  Replicas:"
    echo ""
    
    echo "💻 Top Resource Consumers:"
    kubectl top pods --sort-by=cpu 2>/dev/null | head -8 || echo "Metrics not available (start metrics-server)"
    echo ""
    
    echo "🔍 Recent Events:"
    kubectl get events --sort-by='.lastTimestamp' | tail -5
    echo ""
    
    echo "Commands:"
    echo "  Start load test: ./load-test.sh"
    echo "  Port forward:    kubectl port-forward service/frontend 8080:80"
    echo "  Press Ctrl+C to exit"
    
    sleep 10
done