# Multi-stage build for AI Analyst Platform
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies (include devDependencies for build tools like Tailwind/PostCSS)
RUN npm ci

# Copy frontend source code explicitly (ensure public exists)
COPY frontend/package*.json ./
COPY frontend/public ./public
COPY frontend/src ./src
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/tsconfig.json ./

# Debug: verify public/index.html is present
RUN ls -la /app/frontend && ls -la /app/frontend/public || true

# Build frontend
RUN npm run build

# Python backend stage
FROM python:3.11-slim AS backend-builder

# Set working directory for backend
WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Ensure Python logs are unbuffered and set a default log level
ENV PYTHONUNBUFFERED=1 LOG_LEVEL=INFO

# Install system dependencies for production
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Send Nginx logs to stdout/stderr for Cloud Run visibility
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Copy Python dependencies from backend stage
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copy backend application
COPY backend/ ./backend/

# Copy built frontend from frontend stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose ports
EXPOSE 80 8000

# Health check (nginx proxies /health to backend)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start the application
CMD ["./start.sh"]
