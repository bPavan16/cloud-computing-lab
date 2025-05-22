# Microservices-Based Web Application on Ubuntu with Kubernetes

Create a microservices-based web application on Ubuntu using Kubernetes, an HTML frontend, and open-source tools—without requiring any paid cloud subscription. This approach simulates a real cloud environment locally using tools like:

- **Minikube** (local Kubernetes cluster)
- **Docker** (for containerization)
- **NGINX** (for serving the HTML frontend)
- **Node.js** or **Python** (for backend microservices)
- **kubectl** (Kubernetes CLI)

## Architecture

```
Browser → NGINX (HTML frontend) → Kubernetes (Services)
                            ├── Auth Service
                            └── User Service
```

## Tools You’ll Use

| **Function**         | **Tool**       |
|-----------------------|----------------|
| OS                   | Ubuntu         |
| Kubernetes (local)   | Minikube       |
| Container Engine     | Docker         |
| CLI                  | kubectl        |
| Static HTML Server   | NGINX          |
| Backend APIs         | Node.js/Python |
| Orchestration        | Kubernetes YAML|

---

## Step-by-Step Guide

### Step 1: Install Prerequisites

#### Install Docker
```bash
sudo apt update
sudo apt install -y docker.io
sudo usermod -aG docker $USER
newgrp docker
```

#### Install Minikube & kubectl
```bash
# Install kubectl
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

#### Start Minikube
```bash
minikube start --driver=docker
```

---

### Step 2: Create Project Structure
```bash
mkdir k8s-microservices && cd k8s-microservices
mkdir auth-service user-service frontend
```

---

### Step 3: Create Microservices

#### `auth-service/index.js` (Node.js example)
```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.json({ message: `Hello, ${username}` });
});

app.listen(3000, () => console.log('Auth running on port 3000'));
```

#### Create `Dockerfile` inside `auth-service`:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install express
CMD ["node", "index.js"]
```

Repeat the same for `user-service`, with an endpoint like `/users`.

---

### Step 4: Create Frontend

#### `frontend/index.html`
```html
<!DOCTYPE html>
<html>
<head><title>Frontend</title></head>
<body>
  <h1>Microservices Frontend</h1>
  <button onclick="login()">Login</button>
  <script>
    function login() {
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "1234" })
      })
      .then(res => res.json())
      .then(data => alert(data.message));
    }
  </script>
</body>
</html>
```

#### Create `Dockerfile` for NGINX in `frontend/`:
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

---

### Step 5: Build Docker Images
```bash
eval $(minikube docker-env)

docker build -t auth-service ./auth-service
docker build -t user-service ./user-service
docker build -t frontend ./frontend
```

---

### Step 6: Write Kubernetes Deployment Files

#### `auth-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
      - name: auth
        image: auth-service
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

Repeat similarly for `user-service`.

#### `frontend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: frontend
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30080
```

---

### Step 7: Deploy Everything
```bash
kubectl apply -f auth-deployment.yaml
kubectl apply -f user-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

---

### Step 8: Access Your App
```bash
minikube service frontend --url
```

Visit the URL shown (e.g., `http://192.168.49.2:30080`) in your browser.

---

## Summary

You now have a fully working microservices web app on:

- Local Ubuntu machine
- Using Kubernetes (Minikube)
- With HTML frontend + backend microservices
- 100% open source and cloud-free
