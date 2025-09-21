// PM2 ecosystem configuration for Next.js application
// Install PM2: npm install -g pm2
// Start: pm2 start ecosystem.config.js
// Stop: pm2 stop celebration-diamond
// Restart: pm2 restart celebration-diamond
// Status: pm2 status
// Logs: pm2 logs celebration-diamond

module.exports = {
  apps: [
    {
      name: 'celebration-diamond',
      script: 'npm',
      args: 'start',
      cwd: '/home/theaavashh/workplace/new/celebration-diamond/frontend', // Update this path
      instances: 1, // Use 'max' for cluster mode
      exec_mode: 'fork', // Use 'cluster' for multiple instances
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Auto restart configuration
      watch: false, // Set to true for development
      ignore_watch: ['node_modules', '.next', 'logs'],
      max_memory_restart: '1G',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced features
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'your-username', // Update with your server username
      host: 'your-server-ip', // Update with your server IP
      ref: 'origin/main',
      repo: 'your-git-repo-url', // Update with your Git repository URL
      path: '/home/theaavashh/workplace/new/celebration-diamond/frontend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
