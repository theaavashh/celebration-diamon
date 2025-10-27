#!/bin/bash

# Celebration Diamond API Startup Script

echo "🚀 Starting Celebration Diamond API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from env.example..."
    cp env.example .env
    echo "📝 Please update .env file with your configuration before running again."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check database connection and push schema
echo "🗄️  Setting up database..."
npm run db:push

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo "✅ Setup complete! Starting server..."
echo "🌐 API will be available at http://localhost:3001"
echo "📊 Health check: http://localhost:3001/health"

# Start the server
npm run dev

