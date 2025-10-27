"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    if (err.message.includes('P2002')) {
        return res.status(400).json({
            success: false,
            message: 'A record with this information already exists.'
        });
    }
    if (err.message.includes('P2025')) {
        return res.status(404).json({
            success: false,
            message: 'Record not found.'
        });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired.'
        });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error.',
            error: err.message
        });
    }
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON in request body.'
        });
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message: process.env['NODE_ENV'] === 'production' ? 'Something went wrong!' : message,
        ...(process.env['NODE_ENV'] === 'development' && { error: err.stack })
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map