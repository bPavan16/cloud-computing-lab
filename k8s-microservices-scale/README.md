# Kubernetes Microservices with Auto-Scaling

A production-ready microservices application running on Kubernetes with both horizontal and vertical auto-scaling capabilities.

## 📋 Overview

This project demonstrates a complete microservices architecture deployed on Kubernetes with:
- Frontend service (NGINX)
- Authentication service
- User service
- Horizontal Pod Autoscaler (HPA) configuration
- Vertical Pod Autoscaler (VPA) configuration

## 🏗️ Architecture

```
Browser → NGINX (HTML frontend) → Kubernetes Services
                  ├── Auth Service (with HPA & VPA)
                  └── User Service (with HPA & VPA)
```

## 🚀 Quick Start

### Prerequisites

- Ubuntu-based system
- Docker
- Minikube
- kubectl

### Setup Instructions

1. **Make scripts executable:**
   ```bash
   chmod +x *.sh
   ```

2. **Setup Minikube with autoscaling components:**
   ```bash
   ./setup-minikube.sh
   ```

3. **Deploy all microservices and autoscalers:**
   ```bash
   ./deploy-all.sh
   ```

4. **Generate load to trigger autoscaling:**
   ```bash
   ./load-test.sh
   ```

5. **Monitor autoscaling behavior:**
   ```bash
   ./monitor-autoscaling.sh
   ```

6. **Clean up when finished:**
   ```bash
   ./cleanup.sh
   ```

## 🔍 Autoscaling Features

### Horizontal Pod Autoscaler (HPA)
- Automatically scales pods based on CPU and memory utilization
- Custom scaling policies with different thresholds for each service
- Configurable scale-up/down behavior

### Vertical Pod Autoscaler (VPA)
- Recommends and optionally sets optimal CPU and memory resources
- Prevents resource bottlenecks while optimizing allocation
- Modes: Auto, Off (recommendation only), Initial

## 📊 Monitoring

The `monitor-autoscaling.sh` script provides real-time information about:
- Current HPA status and scaling actions
- VPA recommendations
- Pod resource allocation
- Actual resource usage

## 🔧 Configuration Files

The deployment includes several YAML configuration files:
- `auth-deployment.yaml`: Auth service deployment with resource requests/limits
- `user-deployment.yaml`: User service deployment with resource requests/limits
- `frontend-deployment.yaml`: Frontend NGINX deployment
- `hpa-configs.yaml`: HPA configuration for all services
- `vpa-configs.yaml`: VPA configuration for all services

## 🛠️ Troubleshooting

- **Metrics server not available**: Run `minikube addons enable metrics-server` and wait 1-2 minutes
- **VPA not working**: Ensure the VPA components are running with `kubectl get pods -n kube-system | grep vpa`
- **Load testing not triggering scaling**: Check resource limits and HPA thresholds

## 📚 Learn More

- [Kubernetes Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)
- [Microservices Best Practices](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
