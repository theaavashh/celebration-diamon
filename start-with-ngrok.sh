#!/bin/bash

# Celebration Diamond - Start with Ngrok

echo "🚀 Starting Celebration Diamond with Ngrok tunnel..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start Next.js development server in background
echo "🔨 Starting Next.js development server..."
npm run dev &
NEXTJS_PID=$!

# Wait for Next.js to start
echo "⏳ Waiting for Next.js to start..."
sleep 5

# Check if Next.js is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Failed to start Next.js server"
    kill $NEXTJS_PID 2>/dev/null
    exit 1
fi

echo "✅ Next.js server is running on http://localhost:3000"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Ngrok is not installed. Please run ./ngrok-setup.sh first"
    kill $NEXTJS_PID 2>/dev/null
    exit 1
fi

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
echo "📱 Your app will be available at the ngrok URL shown below"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $NEXTJS_PID 2>/dev/null
    pkill -f ngrok 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start ngrok
ngrok http 3000 --log=stdout

