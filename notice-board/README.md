# Running the Dockerized Notice Board Application

You can run this Docker application by following these steps:

1. First, build a Docker image from your Dockerfile:

```bash
cd /home/pavan/Downloads/notice-board
docker build -t notice-board .
```

2. Then run a container from the image:

```bash
docker run -p 5000:5000 notice-board
```

This maps port 5000 from the container to port 5000 on your host machine, allowing you to access the application.

3. Access the application in your web browser by navigating to:
   
```
http://localhost:5000
```

If you want to run the container in the background (detached mode):

```bash
docker run -d -p 5000:5000 notice-board
```

To stop the container later:

```bash
# List running containers
docker ps

# Stop the container using the container ID
docker stop <container_id>
```


# Kubernetes Autoscaling

# Auto-scaling Notice Board Application with Kubernetes

To auto-scale your Dockerized Notice Board application using Kubernetes, follow these steps:

## 1. Create a Kubernetes Deployment

First, create a file named `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notice-board
spec:
  selector:
    matchLabels:
      app: notice-board
  replicas: 2  # Start with 2 replicas
  template:
    metadata:
      labels:
        app: notice-board
    spec:
      containers:
      - name: notice-board
        image: notice-board:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5000
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"
```

## 2. Create a Kubernetes Service

Create a file named `service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: notice-board-service
spec:
  selector:
    app: notice-board
  ports:
  - port: 80
    targetPort: 5000
  type: LoadBalancer
```

## 3. Set up Horizontal Pod Autoscaler (HPA)

Create a file named `hpa.yaml`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: notice-board-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: notice-board
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 4. Deploy to Kubernetes

First, build and push your Docker image:

```bash
# Build the image
docker build -t notice-board:latest .

# If using a remote registry like Docker Hub
# docker tag notice-board:latest yourusername/notice-board:latest
# docker push yourusername/notice-board:latest
```

Then deploy to your Kubernetes cluster:

```bash
# Apply the deployment
kubectl apply -f deployment.yaml

# Apply the service
kubectl apply -f service.yaml

# Apply the HPA
kubectl apply -f hpa.yaml
```

## 5. Monitor the Autoscaling

Check the status of your HPA:

```bash
kubectl get hpa notice-board-hpa --watch
```

## Additional Configuration Options

1. **Memory-based scaling**: Modify the HPA to scale based on memory usage:

```yaml
metrics:
- type: Resource
  resource:
    name: memory
    target:
      type: Utilization
      averageUtilization: 80
```

2. **Custom metrics scaling**: If you set up Prometheus, you can scale based on custom metrics like request count:

```yaml
metrics:
- type: Pods
  pods:
    metric:
      name: http_requests_per_second
    target:
      type: AverageValue
      averageValue: 10
```

3. **Vertical Pod Autoscaler (VPA)**: Consider using VPA alongside HPA to automatically adjust CPU and memory resources.

For production environments, ensure you have a proper database setup since the containers are ephemeral and data would be lost when pods are terminated.




# Setting Up Port Forwarding with Docker Desktop Kubernetes

I'll guide you through setting up port forwarding using kubectl with Docker Desktop's Kubernetes cluster (no Minikube):

## 1. Prepare Your Application

First, ensure your application is built and deployed:

```bash
# Build the Docker image
docker build -t notice-board:latest .

# Apply Kubernetes configurations
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## 2. Verify Your Deployments

Check if your pods are running:

```bash
kubectl get pods -l app=notice-board
```

You should see your pods with status "Running":
```
NAME                           READY   STATUS    RESTARTS   AGE
notice-board-abc123def-abcd1   1/1     Running   0          2m
notice-board-abc123def-abcd2   1/1     Running   0          2m
notice-board-abc123def-abcd3   1/1     Running   0          2m
notice-board-abc123def-abcd4   1/1     Running   0          2m
```

## 3. Set Up Port Forwarding

You have two options for port forwarding:

### Option 1: Forward to the Service (Recommended)

This directs traffic to any available pod through the service:

```bash
# Forward local port 8080 to the service's port 80
kubectl port-forward service/notice-board-service 8080:80
```

You'll see output like:
```
Forwarding from 127.0.0.1:8080 -> 5000
Forwarding from [::1]:8080 -> 5000
```

### Option 2: Forward to a Specific Pod

If you want to target a specific pod instance:

```bash
# Get the first pod name
POD_NAME=$(kubectl get pods -l app=notice-board -o jsonpath="{.items[0].metadata.name}")

# Set up port forwarding to that pod
kubectl port-forward $POD_NAME 8080:5000
```

## 4. Access Your Application

While the port forwarding is running, you can access your app at:

```
http://localhost:8080
```

## 5. Advanced Port Forwarding Options

### Multiple Ports

You can forward multiple ports from the same service:

```bash
# Forward to multiple local ports for testing
kubectl port-forward service/notice-board-service 8080:80 8081:80
```

### Forwarding in the Background

To run port forwarding in the background:

```bash
# Start in background
kubectl port-forward service/notice-board-service 8080:80 &

# Get the process ID
PF_PID=$!

# Later, to kill the port forwarding:
kill $PF_PID
```

### Allow External Access

By default, port forwarding only binds to localhost. To allow external access:

```bash
kubectl port-forward --address 0.0.0.0 service/notice-board-service 8080:80
```

This allows other devices on your network to access your service.

## 6. Troubleshooting

If you encounter issues:

1. **Port already in use**:
   ```bash
   # Use a different local port
   kubectl port-forward service/notice-board-service 8081:80
   ```

2. **Service not found**:
   ```bash
   # Check if service exists
   kubectl get service
   ```

3. **Connection refused**:
   ```bash
   # Check if pods are running
   kubectl get pods -l app=notice-board
   kubectl describe pods -l app=notice-board
   ```

Port forwarding is excellent for development and debugging but remember it's not intended for production use - it requires keeping the terminal session open (unless run in the background) and only works while the `kubectl` command runs.