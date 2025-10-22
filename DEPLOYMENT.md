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

**AI & APIs:**
- `GEMINI_API_KEY`: Google Gemini AI API key for analysis
- `FMP_API_KEY`: Financial Modeling Prep API key for market data

**Google Cloud Platform:**
- `BUCKET` / `GCS_BUCKET`: Google Cloud Storage bucket name
- `GOOGLE_CLOUD_PROJECT`: Your GCP project ID
- `CLOUD_RUN_URL`: Cloud Run service endpoint for AI processing
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account key JSON

**Database (MySQL/Cloud SQL):**
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host address
- `DB_NAME`: Database name (default: pitchlense)
- `DB_PORT`: Database port (default: 3306)
- `DB_SSL`: Enable SSL (true/false)

**Authentication:**
- `JWT_SECRET`: Secret key for JWT signing (use strong random string)

#### Optional Variables

**Email Integration (Gmail):**
- `GMAIL_USER`, `IMAP_USER`, `SMTP_USER`: Email addresses
- `GMAIL_APP_PASSWORD`, `IMAP_PASSWORD`, `SMTP_PASSWORD`: App passwords
- `IMAP_HOST`, `IMAP_PORT`: IMAP server settings
- `SMTP_HOST`, `SMTP_PORT`: SMTP server settings

**Application:**
- `NODE_ENV`: Environment mode (production/development)
- `PORT`: Application port (default: 3000)

### Google Cloud Platform Setup

1. **Create a GCP project** and enable APIs:
   - Gemini AI API
   - Cloud Storage API
   - Cloud Natural Language API
   - Cloud SQL Admin API (if using Cloud SQL)

2. **Set up Google Cloud Storage**:
   - Create a bucket for file uploads
   - Create service account with Storage Admin role
   - Download service account key JSON
   - Set `GOOGLE_APPLICATION_CREDENTIALS` path

3. **Set up Cloud SQL** (or external MySQL):
   - Create MySQL 8.0+ instance
   - Create database: `pitchlense`
   - Run `backend/database.sql` to create tables
   - Configure connection (TCP or Unix socket)

4. **Set up Cloud Run** (optional, for AI processing):
   - Deploy AI processing service
   - Get the service URL
   - Set `CLOUD_RUN_URL`

### API Keys Setup

#### Financial Modeling Prep (FMP)
1. Sign up at [financialmodelingprep.com](https://financialmodelingprep.com/)
2. Get your API key from the dashboard
3. Set `FMP_API_KEY` in `.env`

**Used for:**
- Real-time company search
- Market news (General, Stock, Crypto, Forex)
- Insider trading data
- Crowdfunding campaigns
- Equity offerings
- Company financials and profile data
- Market performance metrics
- Commodities pricing
- Economic indicators

#### Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Set `GEMINI_API_KEY` in `.env`

**Used for:**
- Startup pitch analysis
- Founder DNA analysis
- Email pitch evaluation
- Q&A chat responses
- Meeting transcript analysis

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
