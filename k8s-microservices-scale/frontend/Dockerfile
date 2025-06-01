FROM nginx:alpine

# Copy the frontend files from local directory
COPY index.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure nginx serves only local content
EXPOSE 80