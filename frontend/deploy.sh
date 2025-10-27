#!/bin/bash

# Deployment script for Celebration Diamond Next.js application
# Make executable: chmod +x deploy.sh
# Run: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting deployment of Celebration Diamond..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="celebration-diamond"
APP_DIR="/home/theaavashh/workplace/new/celebration-diamond/frontend"
NGINX_SITE="celebration-diamond"
DOMAIN="your-domain.com"  # Update with your domain

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Navigate to app directory
print_status "Navigating to application directory..."
cd $APP_DIR

# Install dependencies
print_status "Installing dependencies..."
npm ci --production

# Build the application
print_status "Building the application..."
npm run build

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Stop existing PM2 process if running
print_status "Stopping existing PM2 process..."
pm2 stop $APP_NAME 2>/dev/null || true

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
pm2 startup

# Configure Nginx
print_status "Configuring Nginx..."

# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/$NGINX_SITE

# Create symlink if it doesn't exist
if [ ! -L /etc/nginx/sites-enabled/$NGINX_SITE ]; then
    sudo ln -s /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
fi

# Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
print_status "Reloading Nginx..."
sudo systemctl reload nginx

# Enable Nginx to start on boot
print_status "Enabling Nginx to start on boot..."
sudo systemctl enable nginx

# Show application status
print_status "Application status:"
pm2 status

# Show application logs
print_status "Recent application logs:"
pm2 logs $APP_NAME --lines 10

print_status "✅ Deployment completed successfully!"
print_status "🌐 Your application should be available at: http://$DOMAIN"
print_status "📊 Monitor with: pm2 monit"
print_status "📝 View logs with: pm2 logs $APP_NAME"

# Optional: Setup SSL with Let's Encrypt
echo ""
print_warning "To setup SSL/HTTPS:"
echo "1. Update the domain in nginx.conf"
echo "2. Install certbot: sudo apt install certbot python3-certbot-nginx"
echo "3. Run: sudo certbot --nginx -d $DOMAIN"
echo "4. Uncomment HTTPS configuration in nginx.conf"
echo "5. Reload Nginx: sudo systemctl reload nginx"
