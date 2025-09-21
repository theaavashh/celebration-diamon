# 🚀 Deployment Guide for Celebration Diamond

This guide will help you deploy your Next.js application to a server using Nginx and PM2.

## 📋 Prerequisites

- Ubuntu/Debian server (VPS or dedicated server)
- Root or sudo access
- Domain name (optional but recommended)
- Git repository (if deploying from Git)

## 🛠️ Quick Setup

### Option 1: Automated Setup (Recommended)

1. **Upload files to your server:**
   ```bash
   scp -r . user@your-server-ip:/var/www/celebration-diamond/
   ```

2. **Run the server setup script:**
   ```bash
   sudo ./server-setup.sh
   ```

3. **Deploy the application:**
   ```bash
   ./deploy.sh
   ```

### Option 2: Manual Setup

#### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

#### Step 2: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/celebration-diamond

# Enable the site
sudo ln -s /etc/nginx/sites-available/celebration-diamond /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 3: Deploy Application

```bash
# Install dependencies
npm ci --production

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

## 🔧 Configuration Files

### Nginx Configuration (`nginx.conf`)
- Reverse proxy to Next.js app on port 3000
- Static file caching
- SSL/HTTPS support (commented out)
- Update `your-domain.com` with your actual domain

### PM2 Configuration (`ecosystem.config.js`)
- Process management
- Auto-restart on failure
- Logging configuration
- Update paths for your server

### Deployment Script (`deploy.sh`)
- Automated deployment process
- Builds and starts the application
- Configures Nginx
- Provides status information

## 🌐 Domain and SSL Setup

### 1. Update Domain
Edit `nginx.conf` and replace `your-domain.com` with your actual domain.

### 2. Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Uncomment HTTPS configuration in nginx.conf
# Reload Nginx
sudo systemctl reload nginx
```

## 🐳 Docker Deployment (Alternative)

### Using Docker Compose
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Using Docker
```bash
# Build image
docker build -t celebration-diamond .

# Run container
docker run -p 3000:3000 celebration-diamond
```

## 📊 Monitoring and Maintenance

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs celebration-diamond

# Restart application
pm2 restart celebration-diamond

# Stop application
pm2 stop celebration-diamond

# Monitor resources
pm2 monit
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep node
```

## 🔄 Updates and Maintenance

### Updating Application
```bash
# Pull latest changes
git pull origin main

# Run deployment script
./deploy.sh
```

### Backup
```bash
# Backup application files
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/celebration-diamond

# Backup PM2 configuration
pm2 save
```

## 🚨 Troubleshooting

### Common Issues

1. **Port 3000 already in use:**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Nginx configuration error:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **PM2 process not starting:**
   ```bash
   pm2 logs celebration-diamond
   pm2 describe celebration-diamond
   ```

4. **Permission issues:**
   ```bash
   sudo chown -R $USER:$USER /var/www/celebration-diamond
   ```

### Log Locations
- Application logs: `pm2 logs celebration-diamond`
- Nginx logs: `/var/log/nginx/error.log`
- System logs: `journalctl -u nginx`

## 📞 Support

If you encounter issues:
1. Check the logs using the commands above
2. Verify all configuration files are correct
3. Ensure all dependencies are installed
4. Check firewall settings

## 🔐 Security Considerations

1. **Firewall:** Only open necessary ports (22, 80, 443)
2. **SSL:** Always use HTTPS in production
3. **Updates:** Keep system and dependencies updated
4. **Monitoring:** Set up monitoring and alerting
5. **Backups:** Regular backups of application and data

---

**Happy Deploying! 🎉**
