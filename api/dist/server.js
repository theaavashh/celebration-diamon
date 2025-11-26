"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const quoteWebSocket_1 = require("./websocket/quoteWebSocket");
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const heroRoutes_1 = __importDefault(require("./routes/heroRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const subcategoryRoutes_1 = __importDefault(require("./routes/subcategoryRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const quoteRoutes_1 = __importDefault(require("./routes/quoteRoutes"));
const weddingPlannerRoutes_1 = __importDefault(require("./routes/weddingPlannerRoutes"));
const cultureRoutes_1 = __importDefault(require("./routes/cultureRoutes"));
const ringCustomizationRoutes_1 = __importDefault(require("./routes/ringCustomizationRoutes"));
const diamondCertificationRoutes_1 = __importDefault(require("./routes/diamondCertificationRoutes"));
const celebrationProcessRoutes_1 = __importDefault(require("./routes/celebrationProcessRoutes"));
const faqRoutes_1 = __importDefault(require("./routes/faqRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
const popupRoutes_1 = __importDefault(require("./routes/popupRoutes"));
const testimonialRoutes_1 = __importDefault(require("./routes/testimonialRoutes"));
const testimonialSettingsRoutes_1 = __importDefault(require("./routes/testimonialSettingsRoutes"));
const faqSettingsRoutes_1 = __importDefault(require("./routes/faqSettingsRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const seoRoutes_1 = __importDefault(require("./routes/seoRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const retailerRoutes_1 = __importDefault(require("./routes/retailerRoutes"));
const aboutUsRoutes_1 = __importDefault(require("./routes/aboutUsRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const termsRoutes_1 = __importDefault(require("./routes/termsRoutes"));
const privacyPolicyRoutes_1 = __importDefault(require("./routes/privacyPolicyRoutes"));
const helpCenterRoutes_1 = __importDefault(require("./routes/helpCenterRoutes"));
const returnPolicyRoutes_1 = __importDefault(require("./routes/returnPolicyRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env['PORT'] || 5000;
const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004'
    ];
app.use((0, cors_1.default)({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || (process.env['NODE_ENV'] === 'development' ? '60000' : '900000')),
    max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || (process.env['NODE_ENV'] === 'development' ? '1000' : '100')),
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
app.use('/uploads', express_1.default.static('uploads'));
if (process.env['NODE_ENV'] === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env['NODE_ENV']
    });
});
app.use('/api/banners', bannerRoutes_1.default);
app.use('/api/hero', heroRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/subcategories', subcategoryRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admins', adminRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/quotes', quoteRoutes_1.default);
app.use('/api/wedding-planners', weddingPlannerRoutes_1.default);
app.use('/api/cultures', cultureRoutes_1.default);
app.use('/api/ring-customizations', ringCustomizationRoutes_1.default);
app.use('/api/diamond-certifications', diamondCertificationRoutes_1.default);
app.use('/api/celebration-processes', celebrationProcessRoutes_1.default);
app.use('/api/faqs', faqRoutes_1.default);
app.use('/api/galleries', galleryRoutes_1.default);
app.use('/api/popup', popupRoutes_1.default);
app.use('/api/testimonials', testimonialRoutes_1.default);
app.use('/api/testimonial-settings', testimonialSettingsRoutes_1.default);
app.use('/api/faq-settings', faqSettingsRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/seo', seoRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/roles', roleRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/retailers', retailerRoutes_1.default);
app.use('/api/about-us', aboutUsRoutes_1.default);
app.use('/api/stores', storeRoutes_1.default);
app.use('/api/terms', termsRoutes_1.default);
app.use('/api/privacy-policy', privacyPolicyRoutes_1.default);
app.use('/api/help-center', helpCenterRoutes_1.default);
app.use('/api/return-policy', returnPolicyRoutes_1.default);
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
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
const httpServer = (0, http_1.createServer)(app);
(0, quoteWebSocket_1.setupQuoteWebSocket)(httpServer);
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env['NODE_ENV']}`);
    console.log(`🌐 CORS enabled for: ${corsOrigins.join(', ')}`);
    console.log(`🔌 WebSocket server initialized`);
    console.log(`📝 Available routes:`);
    console.log(`   - /api/admins`);
    console.log(`   - /api/roles`);
});
//# sourceMappingURL=server.js.map