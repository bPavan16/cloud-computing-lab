# Microservices App on Ubuntu with Open-Source Tools

Build and run microservices in a "cloud-like" environment on Ubuntu using only open-source tools — no cloud subscription required. This guide walks you through the process using Docker and Docker Compose.

## Features
- ✅ **Ubuntu** (as host OS)
- ✅ **HTML** (frontend)
- ✅ **Docker + Docker Compose** (for service isolation)
- ✅ **Node.js or Python** (backend)
- ✅ **NGINX** (for serving static HTML)
- ✅ **Local-only infrastructure** (simulating the cloud)

---

## Architecture Overview
```
User --> NGINX (HTML) --> Microservices via REST APIs
                         ├── Auth Service (Node.js/Python)
                         └── User Service (Node.js/Python)
```

---

## Tools You’ll Use (All Free and Open Source)

| **Purpose**              | **Tool**              |
|--------------------------|-----------------------|
| OS                       | Ubuntu               |
| Containerization         | Docker               |
| Orchestration (local)    | Docker Compose       |
| Web Server (static HTML) | NGINX                |
| Backend APIs             | Node.js / Python     |
| Service Communication    | REST over HTTP       |
| Database (optional)      | SQLite / PostgreSQL  |

---

## Step-by-Step Instructions

### 1. Install System Dependencies on Ubuntu
```bash
sudo apt update && sudo apt install -y curl git docker.io docker-compose
sudo systemctl enable docker --now
sudo usermod -aG docker $USER
newgrp docker  # Apply group change immediately
```

---

### 2. Create Project Structure
```bash
mkdir microservices-app && cd microservices-app
mkdir frontend auth-service user-service
```

---

### 3. Build Frontend (HTML)
Create `frontend/index.html`:
```html
<!DOCTYPE html>
<html>
<head><title>Microservices Demo</title></head>
<body>
  <h1>Hello from Microservices App</h1>
  <button onclick="login()">Login</button>
  <script>
    function login() {
      fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "1234" })
      })
      .then(res => res.json())
      .then(data => alert("Login: " + data.message))
      .catch(err => console.error(err));
    }
  </script>
</body>
</html>
```

---

### 4. Create Auth Service
Create `auth-service/index.js`:
```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    res.json({ message: "Login successful" });
  } else {
    res.json({ message: "Login failed" });
  }
});

app.listen(5001, () => console.log("Auth service running on port 5001"));
```

Create `auth-service/Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install express
CMD ["node", "index.js"]
```

---

### 5. Create User Service
Create `user-service/index.js`:
```javascript
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
});

app.listen(5002, () => console.log("User service running on port 5002"));
```

Create `user-service/Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install express
CMD ["node", "index.js"]
```

---

### 6. Create Docker Compose File
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  auth:
    build: ./auth-service
    ports:
      - "5001:5001"

  user:
    build: ./user-service
    ports:
      - "5002:5002"

  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    ports:
      - "8080:80"
```

---

### 7. Run the Entire System
In the root `microservices-app/` folder, run:
```bash
docker-compose up --build
```

---

### Access the Services
- **Frontend (HTML):** [http://localhost:8080](http://localhost:8080)
- **Auth API:** [http://localhost:5001/login](http://localhost:5001/login)
- **User API:** [http://localhost:5002/users](http://localhost:5002/users)

Enjoy your local microservices setup!