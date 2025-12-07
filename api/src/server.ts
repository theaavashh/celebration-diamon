import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { setupQuoteWebSocket } from './websocket/quoteWebSocket';

// Import routes
import bannerRoutes from './routes/bannerRoutes';
import midBannerRoutes from './routes/midBannerRoutes';
import heroRoutes from './routes/heroRoutes';
import categoryRoutes from './routes/categoryRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';
import serviceRoutes from './routes/serviceRoutes';
import quoteRoutes from './routes/quoteRoutes';
import weddingPlannerRoutes from './routes/weddingPlannerRoutes';
import cultureRoutes from './routes/cultureRoutes';
import ringCustomizationRoutes from './routes/ringCustomizationRoutes';
import diamondCertificationRoutes from './routes/diamondCertificationRoutes';
import celebrationProcessRoutes from './routes/celebrationProcessRoutes';
import faqRoutes from './routes/faqRoutes';
import galleryRoutes from './routes/galleryRoutes';
import popupRoutes from './routes/popupRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import testimonialSettingsRoutes from './routes/testimonialSettingsRoutes';
import faqSettingsRoutes from './routes/faqSettingsRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import seoRoutes from './routes/seoRoutes';
import reviewRoutes from './routes/reviewRoutes';
import roleRoutes from './routes/roleRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import retailerRoutes from './routes/retailerRoutes';
import aboutUsRoutes from './routes/aboutUsRoutes';
import storeRoutes from './routes/storeRoutes';
import termsRoutes from './routes/termsRoutes';
import privacyPolicyRoutes from './routes/privacyPolicyRoutes';
import helpCenterRoutes from './routes/helpCenterRoutes';
import returnPolicyRoutes from './routes/returnPolicyRoutes';
import attributeOptionRoutes from './routes/attributeOptionRoutes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// CORS configuration - must come before other middleware
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004'
    ];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'x-csrf-token']
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allow CORS to work properly
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || (process.env['NODE_ENV'] === 'development' ? '60000' : '900000')), // default 1 min in dev, 15 min otherwise
  max: parseInt(
    process.env['RATE_LIMIT_MAX_REQUESTS'] || (process.env['NODE_ENV'] === 'development' ? '1000' : '100')
  ), // higher allowance during local development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Apply rate limiting to all routes except attribute-options for development
// For development, disable rate limiting completely to avoid issues during testing
if (process.env['NODE_ENV'] === 'development') {
  console.log('⚠️  Rate limiting disabled in development mode');
} else {
  app.use('/api/', limiter);
}

// Cookie parser middleware (must come before routes)
app.use(cookieParser());

// CSRF protection middleware
import { csrfValidate } from './middleware/csrfMiddleware';
// Apply CSRF protection to all routes except GET, HEAD, OPTIONS
app.use(csrfValidate);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Logging middleware
if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV']
  });
});

// API routes
app.use('/api/banners', bannerRoutes);
app.use('/api/mid-banners', midBannerRoutes);
app.use('/api/hero', heroRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/wedding-planners', weddingPlannerRoutes);
app.use('/api/cultures', cultureRoutes);
app.use('/api/ring-customizations', ringCustomizationRoutes);
app.use('/api/diamond-certifications', diamondCertificationRoutes);
app.use('/api/celebration-processes', celebrationProcessRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/popup', popupRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/testimonial-settings', testimonialSettingsRoutes);
app.use('/api/faq-settings', faqSettingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/about-us', aboutUsRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/privacy-policy', privacyPolicyRoutes);
app.use('/api/help-center', helpCenterRoutes);
app.use('/api/return-policy', returnPolicyRoutes);
app.use('/api/attribute-options', attributeOptionRoutes);

// Add category routes
app.use('/api/categories', categoryRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Celebration Diamond API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      banners: '/api/banners',
      auth: '/api/auth',
      products: '/api/products',
      'attribute-options': '/api/attribute-options',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const httpServer = createServer(app);

// Setup WebSocket
setupQuoteWebSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env['NODE_ENV']}`);
  console.log(`🌐 CORS enabled for: ${corsOrigins.join(', ')}`);
  console.log(`🔌 WebSocket server initialized`);
  console.log(`📝 Available routes:`);
  console.log(`   - /api/admins`);
  console.log(`   - /api/roles`);
  console.log(`   - /api/attribute-options`);
});