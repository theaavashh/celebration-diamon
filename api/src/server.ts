import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import bannerRoutes from './routes/bannerRoutes';
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

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// CORS configuration - must come before other middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allow CORS to work properly
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

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
app.use('/api/hero', heroRoutes);
app.use('/api/categories', categoryRoutes);
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
      health: '/health'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env['NODE_ENV']}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000, http://localhost:3001, http://localhost:3002, http://localhost:3003, http://localhost:3004`);
  console.log(`📝 Available routes:`);
  console.log(`   - /api/admins`);
  console.log(`   - /api/roles`);
});

export default app;