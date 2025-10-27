#!/bin/bash

# Server setup script for Celebration Diamond Next.js application
# Run this script on your Ubuntu/Debian server to install all dependencies
# Make executable: chmod +x server-setup.sh
# Run: ./server-setup.sh

set -e  # Exit on any error

echo "🛠️  Setting up server for Celebration Diamond..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Update system packages
print_header "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
print_header "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
print_header "Installing PM2 process manager..."
npm install -g pm2

# Install Nginx
print_header "Installing Nginx..."
apt install -y nginx

# Install Git (if not already installed)
print_header "Installing Git..."
apt install -y git

# Install additional useful tools
print_header "Installing additional tools..."
apt install -y curl wget unzip htop nano

# Configure firewall
print_header "Configuring firewall..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable

# Create application user (optional but recommended)
print_header "Creating application user..."
if ! id "celebration" &>/dev/null; then
    useradd -m -s /bin/bash celebration
    usermod -aG sudo celebration
    print_status "Created user 'celebration'"
else
    print_warning "User 'celebration' already exists"
fi

# Create application directory
print_header "Setting up application directory..."
mkdir -p /var/www/celebration-diamond
chown celebration:celebration /var/www/celebration-diamond

# Configure Nginx
print_header "Configuring Nginx..."
# Remove default Nginx site
rm -f /etc/nginx/sites-enabled/default

# Create Nginx configuration
cat > /etc/nginx/sites-available/celebration-diamond << 'EOF'
server {
    listen 80;
    server_name _;  # Replace with your domain
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/celebration-diamond /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Start and enable services
print_header "Starting services..."
systemctl start nginx
systemctl enable nginx

# Install SSL with Let's Encrypt (optional)
print_header "Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx

# Create PM2 startup script
print_header "Setting up PM2 startup..."
sudo -u celebration pm2 startup systemd -u celebration --hp /home/celebration

print_status "✅ Server setup completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Upload your application files to /var/www/celebration-diamond"
echo "2. Run the deployment script: ./deploy.sh"
echo "3. Setup SSL: sudo certbot --nginx -d your-domain.com"
echo "4. Update domain in Nginx configuration"
echo ""
print_status "Useful commands:"
echo "- Check Nginx status: systemctl status nginx"
echo "- Check PM2 processes: pm2 status"
echo "- View Nginx logs: tail -f /var/log/nginx/error.log"
echo "- View application logs: pm2 logs"
