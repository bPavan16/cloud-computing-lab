# 🚀 Microservices-Based Web Application with Kubernetes

> Build a complete microservices architecture locally on Ubuntu using Kubernetes - no cloud subscription required!

[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![NGINX](https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=nginx&logoColor=white)](https://nginx.org/)
[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white)](https://ubuntu.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tools & Technologies](#tools--technologies)
- [Installation Guide](#installation-guide)
- [Project Setup](#project-setup)
- [Deployment](#deployment)
- [Monitoring & Debugging](#monitoring--debugging)
- [Cleanup](#cleanup)
- [Tips & Troubleshooting](#tips--troubleshooting)

## 🌟 Overview

This project demonstrates how to build a production-like microservices environment on your local Ubuntu machine. You'll create a web application with:

- HTML/CSS/JS frontend served by NGINX
- Multiple backend microservices (Auth & User services)
- Full Kubernetes orchestration with Minikube
- Service discovery and load balancing

Perfect for learning cloud-native development without cloud costs!

## 🏗️ Architecture

```
┌─────────┐     ┌─────────────────┐     ┌───────────────────────────┐
│ Browser │────▶│ NGINX Frontend  │────▶│ Kubernetes Service Mesh   │
└─────────┘     └─────────────────┘     │  ┌─────────────────────┐  │
                                                                                │  │ Auth Microservice   │  │
                                                                                │  └─────────────────────┘  │
                                                                                │  ┌─────────────────────┐  │
                                                                                │  │ User Microservice   │  │
                                                                                │  └─────────────────────┘  │
                                                                                └───────────────────────────┘
```

## 🛠️ Tools & Technologies

| **Component**        | **Technology**  | **Purpose**                                |
|----------------------|-----------------|-------------------------------------------|
| Operating System     | Ubuntu          | Base system for development                |
| Container Runtime    | Docker          | Build and run application containers       |
| Orchestration        | Kubernetes      | Container orchestration and management     |
| Local Cluster        | Minikube        | Single-node Kubernetes cluster            |
| CLI Tool             | kubectl         | Kubernetes command-line interface          |
| Frontend Server      | NGINX           | Serve static web content                   |
| Backend Services     | Node.js/Python  | API microservices                          |
| Configuration        | YAML            | Kubernetes resource definitions            |

## 📥 Installation Guide

### Prerequisites

```bash
# Update package list
sudo apt update

# Install Docker
sudo apt install -y docker.io
sudo usermod -aG docker $USER
newgrp docker

# Install kubectl
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube
minikube start --driver=docker
```

## 🏗️ Project Setup

### Directory Structure

```
k8s-microservices-app/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── css/
│   │   └── js/
│   └── Dockerfile
├── auth-service/
│   ├── index.js (or app.py)
│   ├── package.json (or requirements.txt)
│   └── Dockerfile
├── user-service/
│   ├── index.js (or app.py)
│   ├── package.json (or requirements.txt)
│   └── Dockerfile
└── kubernetes/
        ├── auth-deployment.yaml
        ├── user-deployment.yaml
        └── frontend-deployment.yaml
```

### Create Microservices

#### Auth Service (Node.js Example)

Create `auth-service/index.js`:
```javascript
// Add your Node.js service code here
```

Create `auth-service/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install express
CMD ["node", "index.js"]
```

Create `user-service/index.js`:
```javascript
// Add your Node.js service code here
```

Create `user-service/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install express
CMD ["node", "index.js"]
```

### Frontend Setup

Create `frontend/Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY public/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🚢 Deployment

### Build Docker Images

Set up your Docker environment to use Minikube's Docker daemon:
```bash
minikube start --driver=docker
```

Then build your Docker images:

```bash
# Point shell to minikube's Docker daemon
eval $(minikube docker-env)

# Build all images
docker build -t auth-service:latest ./auth-service
docker build -t user-service:latest ./user-service
docker build -t frontend:latest ./frontend
```

### Deploy to Kubernetes

```bash
# Apply all deployments and services
kubectl apply -f kubernetes/auth-deployment.yaml
kubectl apply -f kubernetes/user-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml

# OR

kubectl apply -f kubernetes/
```

# Get the URL to access your frontend
```bash
minikube service frontend 
```

## 🔍 Monitoring & Debugging

### Basic Monitoring Commands

```bash
# View all resources
kubectl get all

# Check pod status
kubectl get pods
kubectl describe pod <pod-name>

# Check services
kubectl get services

# View logs
kubectl logs <pod-name>
```

### Debugging Tools

```bash
# Execute commands in a running container
kubectl exec -it <pod-name> -- /bin/bash

# Forward ports for direct access
kubectl port-forward service/auth-service 8080:3000

# View recent events
kubectl get events --sort-by='.lastTimestamp'
```

## 🧹 Cleanup

```bash
# Remove all resources
kubectl delete -f kubernetes/

# Stop Minikube
minikube stop

# Delete cluster (optional)
minikube delete
```

## 💡 Tips & Troubleshooting

- **Image Pull Issues**: Use `imagePullPolicy: Never` in your YAML files when using locally built images
- **Networking Problems**: Check service endpoints with `kubectl get endpoints`
- **Pod Crashes**: Examine logs with `kubectl logs` and check resource constraints
- **Storage**: Use `minikube mount` for local filesystem access

---

## 🎓 Learn More

- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [NGINX Documentation](https://nginx.org/en/docs/)

Happy coding! 👨‍💻
