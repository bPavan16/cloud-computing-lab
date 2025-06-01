#!/bin/bash

echo "🧹 Cleaning up resources..."

# Stop load tests
kubectl delete pod load-test-auth --ignore-not-found=true
kubectl delete pod load-test-user --ignore-not-found=true

# Delete VPA configurations
kubectl delete -f vpa-configs.yaml --ignore-not-found=true

# Delete HPA configurations  
kubectl delete -f hpa-configs.yaml --ignore-not-found=true

# Delete applications
kubectl delete -f auth-deployment.yaml --ignore-not-found=true
kubectl delete -f user-deployment.yaml --ignore-not-found=true
kubectl delete -f frontend-deployment.yaml --ignore-not-found=true

echo "✅ Cleanup complete!"