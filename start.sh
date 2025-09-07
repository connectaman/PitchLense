#!/bin/bash

# Start the FastAPI backend in the background
echo "Starting FastAPI backend..."
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 3 --proxy-headers --forwarded-allow-ips="*" --access-log &

# Wait 3 seconds for the backend to fully start
echo "Waiting 3 seconds for backend to start..."
sleep 3

# Configure NGINX to listen on Cloud Run provided $PORT (default 8080)
PORT_TO_LISTEN=${PORT:-80}
echo "Configuring NGINX to listen on PORT=${PORT_TO_LISTEN}..."
sed -i "s/listen 80;/listen ${PORT_TO_LISTEN};/" /etc/nginx/nginx.conf

# Start NGINX to serve the built frontend and reverse proxy API
echo "Starting NGINX..."
nginx -g 'daemon off;'
