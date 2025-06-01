#!/bin/bash

echo "🚀 Deploying microservices with autoscaling..."

# Deploy applications
echo "Deploying auth service..."
kubectl apply -f auth-deployment.yaml

echo "Deploying user service..."
kubectl apply -f user-deployment.yaml

echo "Deploying frontend..."
kubectl apply -f frontend-deployment.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=Available --timeout=300s deployment/auth-service
kubectl wait --for=condition=Available --timeout=300s deployment/user-service
kubectl wait --for=condition=Available --timeout=300s deployment/frontend

# Deploy HPA configurations
echo "Deploying HPA configurations..."
kubectl apply -f hpa-configs.yaml

# Deploy VPA configurations
echo "Deploying VPA configurations..."
kubectl apply -f vpa-configs.yaml

echo "✅ All deployments complete!"
echo "📊 Current status:"
kubectl get deployments
kubectl get hpa
kubectl get vpa

echo "🌐 Access your application at:"
minikube service frontend --url