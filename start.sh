#!/bin/bash

# Start the FastAPI backend in the background
echo "Starting FastAPI backend..."
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2 &

# Wait 3 seconds for the backend to fully start
echo "Waiting 3 seconds for ui to start..."
sleep 3

# Start NGINX to serve the built frontend and reverse proxy API
echo "Starting NGINX..."
npm start
