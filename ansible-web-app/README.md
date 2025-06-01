# 🚀 Registration App Deployment Using Ansible

<div align="center">

![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![NGINX](https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white)

</div>

## 📦 Project Overview

This project automates the deployment of a full-stack registration web application using **Ansible**. It sets up:

- A **Node.js** backend (`app.js`)
- A **MongoDB** database
- An **NGINX** server to serve frontend files and act as a reverse proxy

Everything is deployed automatically using a single Ansible playbook.

---

## 📁 File Structure

```
registration-app/
├── ansible/
│   ├── inventory
│   ├── playbook.yml
│   └── files/
│       ├── index.html
│       ├── style.css
│       └── app.js
├── README.md
```

## ⚙️ Prerequisites and Package Installation

<details open>
<summary><b>System Update and Base Packages</b></summary>

```bash
# Update and upgrade system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl gnupg
sudo apt install -y ansible nodejs npm nginx ufw
```
</details>

## 🍃 MongoDB Installation

<details open>
<summary><b>MongoDB Setup (Ubuntu 22.04/24.04 compatible)</b></summary>

```bash
# 1. Import MongoDB public key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 2. Add MongoDB repo (use jammy for 24.04)
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Reload package list
sudo apt update

# 4. Install MongoDB
sudo apt install -y mongodb-org

# 5. Start and enable MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. (Optional) Install mongosh if missing
sudo apt install -y mongodb-mongosh
```
</details>

## 🔥 NGINX Configuration

<details open>
<summary><b>Start & Enable NGINX</b></summary>

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```
</details>

## 🔐 Firewall Configuration

<details open>
<summary><b>Enable UFW Firewall and Allow Ports</b></summary>

```bash
# Method 1: Service-based configuration
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000/tcp     # Node.js
sudo ufw allow 27017/tcp    # MongoDB
sudo ufw enable

# Method 2: Port-based configuration
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 3000
sudo ufw allow 27017
sudo ufw enable

# Check status
sudo ufw status
```
</details>

## ▶️ Deployment Process

<details open>
<summary><b>Running the Ansible Playbook</b></summary>

```bash
# 1. Move to the ansible directory
cd registration-app/ansible

# 2. Run the playbook
ansible-playbook -i inventory playbook.yml --ask-become-pass
```

> **What this will do:**
> - Install missing packages
> - Copy frontend files
> - Deploy the backend app
> - Start all required services

</details>

## ✅ Validation Steps

<details open>
<summary><b>Validating the Deployment</b></summary>

```bash
# 1. Check all services
sudo systemctl status mongod
sudo systemctl status nginx
ps aux | grep node

# 2. Test the frontend and backend
curl http://localhost

curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Pavan H Bhakta","email":"pavan@example.com"}'

# 3. Check MongoDB entries
mongosh
use registration
db.users.find().pretty()
```
</details>

## 🛑 Service Management

<details>
<summary><b>Stopping the Services</b></summary>

```bash
# Stop MongoDB and NGINX
sudo systemctl stop mongod
sudo systemctl stop nginx

# Kill Node.js manually (if pkill fails)
ps aux | grep node
sudo kill <PID>

# Or try:
pkill node
```
</details>

<details>
<summary><b>Restarting the Services</b></summary>

```bash
# Start MongoDB and NGINX
sudo systemctl start mongod
sudo systemctl start nginx

# Start Node.js manually
node /path/to/app.js &

# Or simply rerun:
ansible-playbook -i inventory playbook.yml 
```
</details>

## Stopping the Services
```bash
ansible-playbook -i inventory stop.yml
```

## 🧪 Troubleshooting

<details>
<summary><b>Common Issues and Solutions</b></summary>

| Issue | Check Command | Solution |
|-------|--------------|----------|
| MongoDB not starting | `sudo journalctl -u mongod` | Check logs for errors |
| Node process not terminating | `ps aux \| grep node` | Use `sudo kill <PID>` |
| NGINX errors | `sudo tail -f /var/log/nginx/error.log` | Review config files |
| Playbook fails | Use `--ask-become-pass` flag | Ensure sudo access |
| Firewall issues | `sudo ufw status` | Verify ports are open |

</details>

## 📌 Notes

> **Production Considerations:**
> - Node.js should ideally run as a service or using PM2 for persistence
> - This project is for learning Ansible and basic app deployment
> - For production use, add process managers, log rotation, health checks, etc.

---

<div align="center">

## 👩‍💻 Author

**Pavan H Bhakta**  
Registration App Deployment with Ansible  
May 2025

</div>