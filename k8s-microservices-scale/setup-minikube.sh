#!/bin/bash

echo "🚀 Setting up Minikube with HPA and VPA..."

# Start Minikube with sufficient resources
echo "Starting Minikube..."
minikube start --cpus=2 --memory=2096 --disk-size=5g

# Enable metrics server for HPA
echo "Enabling metrics server..."
minikube addons enable metrics-server

# Install VPA
echo "Installing VPA..."
# git clone https://github.com/kubernetes/autoscaler.git /tmp/autoscaler
# cd /tmp/autoscaler/vertical-pod-autoscaler/
# ./hack/vpa-up.sh

echo "Waiting for VPA components to be ready..."
kubectl wait --for=condition=Available --timeout=300s deployment/vpa-recommender -n kube-system
kubectl wait --for=condition=Available --timeout=300s deployment/vpa-updater -n kube-system
kubectl wait --for=condition=Available --timeout=300s deployment/vpa-admission-controller -n kube-system

echo "✅ Minikube setup complete!"
echo "📊 Checking cluster status..."
kubectl get nodes
kubectl get pods -n kube-system | grep -E "(metrics-server|vpa)"

echo "🎯 You can now deploy your applications and autoscaling configurations"