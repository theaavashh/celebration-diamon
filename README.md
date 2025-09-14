# Celebration Diamond - Luxury Jewelry Website

A modern, responsive jewelry e-commerce website built with Next.js, featuring elegant animations and a premium user experience.

## 🌟 Features

- **Modern UI/UX**: Clean, elegant design with smooth animations
- **Responsive Design**: Optimized for all devices
- **Interactive Components**: Carousels, hover effects, and dynamic content
- **Product Showcase**: Beautiful jewelry galleries and collections
- **Ngrok Integration**: Easy local development with public tunneling

## 🚀 Quick Start with Ngrok

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Ngrok account (free at [ngrok.com](https://ngrok.com))

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Ngrok

```bash
# Run the ngrok setup script
./ngrok-setup.sh

# Or manually install ngrok
# Visit https://ngrok.com/download and follow instructions
```

### 3. Authenticate Ngrok

```bash
# Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
ngrok config add-authtoken YOUR_AUTHTOKEN
```

### 4. Start with Ngrok Tunnel

```bash
# This will start Next.js and create a public tunnel
npm run ngrok
```

Your app will be available at:
- **Local**: http://localhost:3000
- **Public**: https://your-ngrok-url.ngrok.io

## 🛠️ Development

### Start Development Server

```bash
# Start Next.js development server
npm run dev

# Or start with ngrok tunnel
npm run ngrok
```

### Build for Production

```bash
npm run build
npm start
```

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Start with Docker
npm run docker

# Stop Docker containers
npm run docker-stop

# View logs
npm run logs
```

## 📁 Project Structure

```
celebration-diamond/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── component/       # React components
│   │   └── public/          # Static assets
│   ├── Dockerfile           # Docker configuration
│   └── package.json
├── nginx.conf               # Nginx configuration
├── nginx-production.conf    # Production Nginx config
├── docker-compose.yml       # Docker Compose setup
├── ngrok-config.yml         # Ngrok configuration
├── start.sh                 # Docker startup script
├── ngrok-setup.sh          # Ngrok installation script
├── start-with-ngrok.sh     # Start with ngrok tunnel
└── package.json            # Root package.json
```

## 🌐 Ngrok Configuration

### Basic Usage

```bash
# Start ngrok tunnel
ngrok http 3000
```

### Advanced Configuration

Edit `ngrok-config.yml`:

```yaml
tunnels:
  celebration-diamond:
    proto: http
    addr: 3000
    subdomain: celebration-diamond
    inspect: true
    bind_tls: true
```

Then run:
```bash
ngrok start celebration-diamond
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run ngrok` - Start with ngrok tunnel
- `npm run ngrok-setup` - Install ngrok
- `npm run docker` - Start with Docker
- `npm run docker-stop` - Stop Docker containers
- `npm run logs` - View Docker logs

## 📱 Mobile Testing

With ngrok, you can easily test on mobile devices:

1. Start the ngrok tunnel: `npm run ngrok`
2. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
3. Open the URL on your mobile device
4. Test the responsive design and touch interactions

## 🔒 Security Notes

- Ngrok tunnels are public by default
- Use ngrok's authentication for secure tunnels
- Consider using custom subdomains for production
- Monitor ngrok usage to avoid rate limits

## 🎨 Customization

### Styling
- Edit components in `frontend/src/component/`
- Modify global styles in `frontend/src/app/globals.css`
- Update Tailwind configuration as needed

### Content
- Update product data in component files
- Modify images in `frontend/public/`
- Customize text and copy throughout the site

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Production
```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support

For issues or questions:
1. Check the ngrok documentation: https://ngrok.com/docs
2. Review Next.js documentation: https://nextjs.org/docs
3. Check Docker logs: `npm run logs`

## 📄 License

MIT License - see LICENSE file for details.

---

**Celebration Diamond** - Crafting luxury, one diamond at a time. ✨

