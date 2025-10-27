import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Get all reviews for a specific product
export const getProductReviews = async (req: Request, res: Response<ApiResponse<Review[]>>) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
    });
  }
};

// Get all reviews (Admin)
export const getAllReviews = async (req: Request, res: Response<ApiResponse<Review[]>>) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
    });
  }
};

// Create a new review
export const createReview = async (req: Request, res: Response<ApiResponse<Review>>) => {
  try {
    const { productId, customerName, rating, comment } = req.body;

    // Validation
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerName,
        rating,
        comment,
      },
    });

    res.json({
      success: true,
      data: review,
      message: 'Review created successfully',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
    });
  }
};

// Update review (Admin)
export const updateReview = async (req: Request, res: Response<ApiResponse<Review>>) => {
  try {
    const { id } = req.params;
    const { customerName, rating, comment, isActive } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        customerName,
        rating,
        comment,
        isActive,
      },
    });

    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
    });
  }
};

// Delete review (Admin)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
    });
  }
};

// Toggle review status (Admin)
export const toggleReviewStatus = async (req: Request, res: Response<ApiResponse<Review>>) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isActive: !review.isActive,
      },
    });

    res.json({
      success: true,
      data: updatedReview,
      message: 'Review status updated successfully',
    });
  } catch (error) {
    console.error('Error toggling review status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review status',
    });
  }
};



