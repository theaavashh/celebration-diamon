import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, Product } from '../types';

// Get all products (public)
export const getAllProducts = async (req: Request, res: Response<ApiResponse<Product[]>>) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    const where: any = {
      isActive: true
    };
    
    if (category) {
      where.category = {
        equals: category as string,
        mode: 'insensitive'
      };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { productCode: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);
    
    res.json({
      success: true,
      data: products,
      count: products.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all products (admin)
export const getAdminProducts = async (req: Request, res: Response<ApiResponse<Product[]>>) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    
    if (category) {
      where.category = {
        equals: category as string,
        mode: 'insensitive'
      };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { productCode: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);
    
    res.json({
      success: true,
      data: products,
      count: products.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response<ApiResponse<Product>>) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response<ApiResponse<Product>>) => {
  try {
    const {
      productCode,
      name,
      description,
      briefDescription,
      fullDescription,
      category,
      subCategory,
      price,
      stock,
      isActive = true,
      goldWeight,
      diamondDetails,
      diamondQuantity,
      diamondSize,
      diamondWeight,
      diamondQuality,
      otherGemstones,
      orderDuration,
      metalType,
      stoneType,
      settingType,
      size,
      color,
      finish,
      digitalBrowser = false,
      website = false,
      distributor = false,
      culture,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoSlug
    } = req.body;
    
    // Get uploaded file path
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;
    
    const product = await prisma.product.create({
      data: {
        productCode,
        name,
        description,
        briefDescription: briefDescription || null,
        fullDescription: fullDescription || null,
        category,
        subCategory,
        price: Number(price),
        stock: Number(stock) || 0,
        isActive: isActive === 'true' || isActive === true,
        imageUrl,
        goldWeight,
        diamondDetails,
        diamondQuantity: diamondQuantity ? Number(diamondQuantity) : null,
        diamondSize,
        diamondWeight,
        diamondQuality,
        otherGemstones,
        orderDuration,
        metalType,
        stoneType,
        settingType,
        size,
        color,
        finish,
        digitalBrowser: digitalBrowser === 'true' || digitalBrowser === true,
        website: website === 'true' || website === true,
        distributor: distributor === 'true' || distributor === true,
        culture: culture || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        seoSlug: seoSlug || null
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response<ApiResponse<Product>>) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Convert string boolean to actual boolean if present
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }
    if (updateData.digitalBrowser !== undefined) {
      updateData.digitalBrowser = updateData.digitalBrowser === 'true' || updateData.digitalBrowser === true;
    }
    if (updateData.website !== undefined) {
      updateData.website = updateData.website === 'true' || updateData.website === true;
    }
    if (updateData.distributor !== undefined) {
      updateData.distributor = updateData.distributor === 'true' || updateData.distributor === true;
    }
    
    // Convert numeric fields
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }
    if (updateData.diamondQuantity !== undefined) {
      updateData.diamondQuantity = updateData.diamondQuantity ? Number(updateData.diamondQuantity) : null;
    }
    
    // Get uploaded file path if new image is uploaded
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : updateData.imageUrl;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        imageUrl: imageUrl || null
      }
    });
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle product status
export const toggleProductStatus = async (req: Request, res: Response<ApiResponse<Product>>) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive }
    });
    
    res.json({
      success: true,
      message: `Product ${updatedProduct.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get product categories
export const getProductCategories = async (req: Request, res: Response<ApiResponse<string[]>>) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      where: { isActive: true }
    });
    
    const uniqueCategories = [...new Set(categories.map(p => p.category))];
    
    res.json({
      success: true,
      data: uniqueCategories
    });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};





