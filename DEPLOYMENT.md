# PitchLense Deployment Guide

This guide will help you deploy the PitchLense application using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 2GB of available RAM
- At least 5GB of available disk space

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PitchLense
   ```

2. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Deploy using the deployment script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Access the application**
   - Application: http://localhost:3000
   - Health check: http://localhost:3000/health

## Manual Deployment

### 1. Build the Docker image
```bash
docker build -t pitchlense .
```

### 2. Run with Docker Compose
```bash
docker-compose up -d
```

### 3. Check the status
```bash
docker-compose ps
docker-compose logs -f pitchlense
```

## Configuration

### Environment Variables

Copy `env.example` to `.env` and configure the following variables:

#### Required Variables
- `JWT_SECRET`: Secret key for JWT token signing
- `GOOGLE_CLOUD_STORAGE_BUCKET`: Your GCS bucket name
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your GCS service account key

#### Optional Variables
- `NODE_ENV`: Environment (default: production)
- `PORT`: Application port (default: 3000)
- `DATABASE_PATH`: SQLite database path
- `CORS_ORIGIN`: CORS allowed origins

### Google Cloud Storage Setup

1. Create a Google Cloud Storage bucket
2. Create a service account with Storage Admin permissions
3. Download the service account key JSON file
4. Place it in your project directory
5. Update `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

## Production Deployment

### With Nginx (Recommended)

1. **Enable nginx service in docker-compose**
   ```bash
   docker-compose --profile production up -d
   ```

2. **Configure SSL certificates**
   - Place your SSL certificates in the `ssl/` directory
   - Update `nginx.conf` with your domain name
   - Uncomment the HTTPS server block

3. **Set up domain and DNS**
   - Point your domain to your server's IP
   - Configure DNS records

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
```

#### Production
```bash
NODE_ENV=production
LOG_LEVEL=info
BCRYPT_ROUNDS=12
```

## Monitoring and Maintenance

### Health Checks
The application includes health check endpoints:
- `/health` - Basic health check
- `/api/health` - Detailed health information

### Logs
```bash
# View application logs
docker-compose logs -f pitchlense

# View nginx logs
docker-compose logs -f nginx
```

### Database Backup
```bash
# Backup SQLite database
docker-compose exec pitchlense cp /app/backend/data/data.db /app/backend/data/backup-$(date +%Y%m%d).db
```

### Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Change port in docker-compose.yml
   ```

2. **Permission denied**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x deploy.sh
   ```

3. **Database connection issues**
   - Check if the data directory exists and is writable
   - Verify database path in environment variables

4. **Google Cloud Storage issues**
   - Verify service account key file path
   - Check bucket permissions
   - Ensure bucket exists and is accessible

### Debug Mode
```bash
# Run in debug mode
NODE_ENV=development docker-compose up
```

### Container Shell Access
```bash
# Access container shell
docker-compose exec pitchlense sh
```

## Security Considerations

1. **Change default secrets** in production
2. **Use HTTPS** in production (configure SSL certificates)
3. **Set up firewall** rules
4. **Regular security updates** for base images
5. **Monitor logs** for suspicious activity
6. **Backup data** regularly

## Scaling

### Horizontal Scaling
```yaml
# In docker-compose.yml
services:
  pitchlense:
    deploy:
      replicas: 3
```

### Load Balancer
Use nginx or a cloud load balancer to distribute traffic across multiple instances.

## Support

For deployment issues:
1. Check the logs: `docker-compose logs -f pitchlense`
2. Verify environment variables
3. Check network connectivity
4. Review the troubleshooting section above

## Performance Optimization

1. **Enable gzip compression** (already configured in nginx.conf)
2. **Set up caching** for static assets
3. **Use CDN** for static files
4. **Optimize database queries**
5. **Monitor resource usage**

```bash
# Monitor resource usage
docker stats
```
