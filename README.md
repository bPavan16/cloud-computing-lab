# Cloud Computing - Hands-on Lab Exercises

<div align="center">

![Cloud Computing](https://img.shields.io/badge/Cloud%20Computing-Labs-blue)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=flat-square&logo=ansible&logoColor=white)
![Microservices](https://img.shields.io/badge/Microservices-FF6F00?style=flat-square&logo=microservices&logoColor=white)

</div>

## 📋 Overview

This repository contains a collection of hands-on lab exercises assigned for the Cloud Computing course at KLE Technological University. These exercises provide practical experience with container technologies, orchestration, infrastructure as code, and microservices architecture.

## 🧪 Lab Exercises

### 1. Microservices with Docker (microservices-app-docker)

A simple microservices application built with Docker, featuring:

- **Frontend Service:** NGINX serving HTML/CSS/JS
- **Auth Service:** Node.js service handling authentication
- **User Service:** Node.js service for user data management
- **Docker Compose:** Service orchestration without Kubernetes

**Key Learning Outcomes:**
- Containerization of Node.js applications
- Docker Compose for multi-container applications
- Microservices communication patterns
- Frontend-backend integration in containerized environments

**Technologies Used:** Docker, Node.js, Express, NGINX

### 2. Kubernetes Microservices Deployment (k8s-microservices-deploy)

Basic Kubernetes deployment of a three-tier microservices application:

- Separate deployments for frontend, auth, and user services
- Kubernetes service objects for internal communication
- NodePort service for external access

**Key Learning Outcomes:**
- Basic Kubernetes objects (Deployments, Services, Pods)
- Kubernetes manifest files (YAML)
- Application deployment on Kubernetes
- Service discovery in Kubernetes

**Technologies Used:** Kubernetes, Docker, Node.js, NGINX

### 3. Kubernetes Autoscaling (k8s-microservices-scale)

Advanced Kubernetes deployment featuring both horizontal and vertical pod autoscaling:

- Horizontal Pod Autoscaler (HPA) configurations
- Vertical Pod Autoscaler (VPA) configurations
- Load testing scripts to demonstrate autoscaling
- Monitoring and observability tools

**Key Learning Outcomes:**
- Kubernetes autoscaling concepts
- Resource management in Kubernetes
- Performance testing and load generation
- Monitoring Kubernetes cluster behavior

**Technologies Used:** Kubernetes, HPA, VPA, Shell Scripting

### 4. Infrastructure as Code with Ansible (ansible-web-app)

Automated deployment of a web application using Ansible:

- Role-based Ansible structure
- MongoDB database configuration
- NGINX web server setup
- Node.js application deployment

**Key Learning Outcomes:**
- Infrastructure as Code principles
- Ansible playbooks and roles
- Configuration management
- Service orchestration without containers

**Technologies Used:** Ansible, Node.js, MongoDB, NGINX

### 5. Advanced Ansible Deployment (ansible-demo)

Multi-server application deployment using Ansible roles:

- Web application server role
- Database server role
- Common configuration role
- Templating for configuration files

**Key Learning Outcomes:**
- Multi-node orchestration
- Advanced Ansible patterns
- Environment-specific configurations
- Database initialization and schema management

**Technologies Used:** Ansible, MySQL, Node.js, EJS Templates

## 🚀 Getting Started

Each lab exercise has its own directory with a specific README and setup instructions. The general approach for all exercises is:

1. Clone this repository
2. Navigate to the exercise directory
3. Follow the README instructions in that directory

Example:

```bash
git clone https://github.com/bPavan16/cloud-computing-labs.git
cd cloud-computing-labs/microservices-app-docker
# Follow the instructions in the README.md
```

## 📚 Prerequisites

Different labs have different prerequisites, but generally you'll need:

- Ubuntu Linux environment (local or VM)
- Docker and Docker Compose
- Kubernetes (Minikube for local development)
- Ansible
- Node.js
- Basic understanding of YAML and JSON

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- KLE Technological University for the course structure
- The open-source community for the tools and technologies used
- All contributors to this repository

---

<div align="center">

Created with ❤️ by [Pavan H Bhakta](https://github.com/bPavan16)

</div>

