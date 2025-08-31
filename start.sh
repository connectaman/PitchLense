#!/bin/bash

# Start nginx in the background
echo "Starting nginx..."
nginx -g "daemon off;" &

# Wait a moment for nginx to start
sleep 2

# Start the FastAPI backend
echo "Starting FastAPI backend..."
cd /app/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1

# Keep the container running
wait
