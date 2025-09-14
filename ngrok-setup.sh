#!/bin/bash

# Celebration Diamond - Ngrok Setup Script

echo "🚀 Setting up Ngrok for Celebration Diamond..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Ngrok is not installed. Installing ngrok..."
    
    # Detect OS and install ngrok
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
        tar -xzf ngrok-v3-stable-linux-amd64.tgz
        sudo mv ngrok /usr/local/bin/
        rm ngrok-v3-stable-linux-amd64.tgz
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ngrok/ngrok/ngrok
        else
            echo "Please install Homebrew first or download ngrok manually from https://ngrok.com/download"
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install ngrok manually from https://ngrok.com/download"
        exit 1
    fi
fi

# Check if ngrok is authenticated
if [ ! -f ~/.config/ngrok/ngrok.yml ]; then
    echo "🔐 Please authenticate ngrok first:"
    echo "1. Sign up at https://ngrok.com"
    echo "2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "3. Run: ngrok config add-authtoken YOUR_AUTHTOKEN"
    echo ""
    read -p "Press Enter after you've completed the authentication..."
fi

echo "✅ Ngrok is ready!"
echo ""
echo "🌐 Starting ngrok tunnel for your Next.js app..."
echo "📱 Your app will be available at the ngrok URL shown below"
echo ""

# Start ngrok tunnel
ngrok http 3000 --log=stdout

