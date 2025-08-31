# Environment Setup

This document explains how to set up environment variables for the PitchLense project.

## Quick Setup

1. Copy the template file:
   ```bash
   cp env.template .env
   ```

2. Update the values in `.env` with your actual configuration.

## Environment Variables

### Frontend Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `REACT_APP_BACKEND_API_URL` | Backend API URL for frontend requests | `http://localhost:8000` |

### Backend Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `BACKEND_API_URL` | Backend API URL | `http://localhost:8000` |
| `DATABASE_URL` | PostgreSQL database connection string | `postgresql://username:password@localhost:5432/pitchlense_db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT token generation | `your-secret-key-here` |
| `GOOGLE_AI_API_KEY` | Google AI API key for AI features | `your-google-ai-api-key-here` |
| `NODE_ENV` | Environment (development/production) | `development` |

## Configuration Examples

### Development Environment
```env
BACKEND_API_URL=http://localhost:8000
REACT_APP_BACKEND_API_URL=http://localhost:8000
DATABASE_URL=postgresql://postgres:password@localhost:5432/pitchlense_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
GOOGLE_AI_API_KEY=your-google-ai-api-key
NODE_ENV=development
```

### Production Environment
```env
BACKEND_API_URL=https://api.pitchlense.com
REACT_APP_BACKEND_API_URL=https://api.pitchlense.com
DATABASE_URL=postgresql://prod_user:prod_password@prod-db:5432/pitchlense_prod
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=very-secure-production-secret-key
GOOGLE_AI_API_KEY=your-production-google-ai-api-key
NODE_ENV=production
```

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets in production
- Rotate API keys regularly
- Use environment-specific configurations

## Docker Environment

When using Docker, you can pass environment variables through:

1. **Docker Compose** (recommended):
   ```yaml
   environment:
     - BACKEND_API_URL=http://localhost:8000
     - DATABASE_URL=postgresql://postgres:password@db:5432/pitchlense
   ```

2. **Docker run**:
   ```bash
   docker run -e BACKEND_API_URL=http://localhost:8000 pitchlense
   ```

3. **Environment file**:
   ```bash
   docker run --env-file .env pitchlense
   ```

## Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**:
   - Check `REACT_APP_BACKEND_API_URL` is correct
   - Ensure backend is running on the specified port
   - Check CORS configuration in backend

2. **Database connection failed**:
   - Verify `DATABASE_URL` format
   - Check database server is running
   - Ensure database exists and user has permissions

3. **Redis connection failed**:
   - Verify `REDIS_URL` format
   - Check Redis server is running
   - Ensure Redis is accessible from the application

### Validation

You can validate your environment setup by running:

```bash
# Frontend
npm run build

# Backend
python -c "from app.core.config import settings; print('Config loaded successfully')"
```
