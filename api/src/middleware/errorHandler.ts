import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../types';

export const errorHandler = (err: ApiError, _req: Request, res: Response<ApiResponse>, _next: NextFunction) => {
  console.error('Error:', err);

  // Prisma errors
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

  // JWT errors
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

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error.',
      error: err.message
    });
  }

  // Syntax errors
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body.'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: process.env['NODE_ENV'] === 'production' ? 'Something went wrong!' : message,
    ...(process.env['NODE_ENV'] === 'development' && { error: err.stack })
  });
};
