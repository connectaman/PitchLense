#!/bin/bash

# PitchLense Environment Setup Script

echo "🚀 Setting up PitchLense environment variables..."

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. .env file unchanged."
        exit 1
    fi
fi

# Copy template to .env
if [ -f "env.template" ]; then
    cp env.template .env
    echo "✅ Created .env file from template"
else
    echo "❌ env.template not found!"
    exit 1
fi

# Ask for custom values
echo ""
echo "🔧 Configure your environment variables:"
echo ""

# Backend API URL
read -p "Backend API URL [http://localhost:8000]: " backend_url
backend_url=${backend_url:-http://localhost:8000}

# Database URL
read -p "Database URL [postgresql://postgres:password@localhost:5432/pitchlense_db]: " db_url
db_url=${db_url:-postgresql://postgres:password@localhost:5432/pitchlense_db}

# Redis URL
read -p "Redis URL [redis://localhost:6379]: " redis_url
redis_url=${redis_url:-redis://localhost:6379}

# JWT Secret
read -p "JWT Secret (leave empty for random): " jwt_secret
if [ -z "$jwt_secret" ]; then
    jwt_secret=$(openssl rand -hex 32)
    echo "Generated JWT Secret: $jwt_secret"
fi

# Google AI API Key
read -p "Google AI API Key (optional): " google_api_key

# Update .env file with custom values
sed -i.bak "s|BACKEND_API_URL=.*|BACKEND_API_URL=$backend_url|g" .env
sed -i.bak "s|REACT_APP_BACKEND_API_URL=.*|REACT_APP_BACKEND_API_URL=$backend_url|g" .env
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=$db_url|g" .env
sed -i.bak "s|REDIS_URL=.*|REDIS_URL=$redis_url|g" .env
sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$jwt_secret|g" .env

if [ ! -z "$google_api_key" ]; then
    sed -i.bak "s|GOOGLE_AI_API_KEY=.*|GOOGLE_AI_API_KEY=$google_api_key|g" .env
fi

# Remove backup file
rm .env.bak

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "📋 Your configuration:"
echo "   Backend API: $backend_url"
echo "   Database: $db_url"
echo "   Redis: $redis_url"
echo "   JWT Secret: ${jwt_secret:0:16}..."
echo ""
echo "🔒 Remember to:"
echo "   - Never commit .env files to version control"
echo "   - Use strong secrets in production"
echo "   - Keep your API keys secure"
echo ""
echo "🚀 You can now start the application!"
