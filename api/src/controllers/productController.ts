import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Product, ApiResponse } from '../types';

const prisma = new PrismaClient();

// Get all products (public)
export const getAllProducts = async (req: Request, res: Response<ApiResponse<Product[]>>) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
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
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            where: { isActive: true },
            orderBy: { order: 'asc' as const }
          }
        }
      }),
      prisma.product.count({ where })
    ]);
    
    res.json({
      success: true,
      data: products as unknown as Product[],
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
    const { category, search, status, page = 1, limit = 10 } = req.query;
    
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
    
    // Add status filter
    if (status && status !== 'all') {
      where.status = status as string;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            orderBy: { order: 'asc' as const }
          }
        }
      }),
      prisma.product.count({ where })
    ]);
    
    res.json({
      success: true,
      data: products as unknown as Product[],
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
      where: { id },
      include: {
        images: {
          where: { isActive: true },
          orderBy: { order: 'asc' as const }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product as unknown as Product
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
      fullDescription,
      category,
      subCategory,
      price,
      stock,
      isActive = true,
      // Gold Fields
      goldWeight,
      goldPurity,
      goldType,
      goldCraftsmanship,
      goldDesignDescription,
      goldFinishedType,
      goldStones,
      goldStoneQuality,
      // Diamond Fields
      diamondType,
      diamondShapeCut,
      diamondColorGrade,
      diamondClarityGrade,
      diamondCutGrade,
      diamondMetalDetails,
      diamondCertification,
      diamondOrigin,
      diamondCaratWeight,
      diamondDetails,
      diamondQuantity,
      diamondSize,
      diamondWeight,
      diamondQuality,
      // Platinum Fields
      platinumWeight,
      platinumType,
      // Silver Fields
      silverWeight,
      silverType,
      // Other Fields
      otherGemstones,
      orderDuration,
      stoneWeight,
      caret,
      jewelryType,
      materialType,
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
      seoSlug,
      videoUrl
    } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required fields'
      });
    }
    
    // Get uploaded file paths
    let imageUrls: string[] = [];
    let uploadedVideoUrl: string | null = null;
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Handle image uploads
      if (files.images) {
        imageUrls = files.images.map(file => `/uploads/products/${file.filename}`);
      }
      
      // Handle video upload
      if (files.video && files.video.length > 0) {
        uploadedVideoUrl = `/uploads/products/${files.video[0].filename}`;
      }
    }
    
    // Create product first
    const product = await prisma.product.create({
      data: {
        productCode,
        name,
        description,
        fullDescription: fullDescription || null,
        category,
        subCategory,
        price: price && price !== '' ? Number(price) : 0,
        stock: Number(stock) || 0,
        isActive: isActive === 'true' || isActive === true,
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : null, // Keep for backward compatibility
        // Gold Fields
        goldWeight,
        goldPurity,
        goldType,
        goldCraftsmanship,
        goldDesignDescription,
        goldFinishedType,
        goldStones,
        goldStoneQuality,
        // Diamond Fields
        diamondType,
        diamondShapeCut,
        diamondColorGrade,
        diamondClarityGrade,
        diamondCutGrade,
        diamondMetalDetails,
        diamondCertification,
        diamondOrigin,
        diamondCaratWeight,
        diamondDetails,
        diamondQuantity: diamondQuantity ? Number(diamondQuantity) : null,
        diamondSize,
        diamondWeight,
        diamondQuality,
        // Platinum Fields
        platinumWeight,
        platinumType,
        // Silver Fields
        silverWeight,
        silverType,
        // Other Fields
        otherGemstones,
        orderDuration,
        stoneWeight,
        caret,
        jewelryType,
        materialType,
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
        seoSlug: seoSlug || null,
        // @ts-ignore - videoUrl exists in schema but TypeScript is not recognizing it
        videoUrl: uploadedVideoUrl || videoUrl || null,
        status: 'draft' // Default status
      } as any
    });
    
    // Create product images if any were uploaded
    if (imageUrls.length > 0) {
      const productImages = imageUrls.map((url: string, index: number) => ({
        productId: product.id,
        url,
        order: index,
        isActive: true
      }));
      
      await prisma.productImage.createMany({
        data: productImages
      });
    }
    
    // Fetch the complete product with images
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          orderBy: { order: 'asc' as const }
        }
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: completeProduct as unknown as Product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    // Provide more detailed error information
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: 'Unknown error occurred'
      });
    }
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response<ApiResponse<Product>>) => {
  try {
    const { id } = req.params;
    let {
      productCode,
      name,
      description,
      fullDescription,
      category,
      subCategory,
      price,
      stock,
      isActive,
      status,
      // Gold Fields
      goldWeight,
      goldPurity,
      goldType,
      goldCraftsmanship,
      goldDesignDescription,
      goldFinishedType,
      goldStones,
      goldStoneQuality,
      // Diamond Fields
      diamondType,
      diamondShapeCut,
      diamondColorGrade,
      diamondClarityGrade,
      diamondCutGrade,
      diamondMetalDetails,
      diamondCertification,
      diamondOrigin,
      diamondCaratWeight,
      diamondDetails,
      diamondQuantity,
      diamondSize,
      diamondWeight,
      diamondQuality,
      // Platinum Fields
      platinumWeight,
      platinumType,
      // Silver Fields
      silverWeight,
      silverType,
      // Other Fields
      otherGemstones,
      orderDuration,
      stoneWeight,
      caret,
      jewelryType,
      materialType,
      metalType,
      stoneType,
      settingType,
      size,
      color,
      finish,
      digitalBrowser,
      website,
      distributor,
      culture,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoSlug,
      videoUrl
    } = req.body;
    
    // Log incoming data for debugging
    console.log('Update product request for ID:', id);
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);
    
    // Validate product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Convert string boolean to actual boolean if present
    if (isActive !== undefined) {
      isActive = isActive === 'true' || isActive === true;
    }
    if (digitalBrowser !== undefined) {
      digitalBrowser = digitalBrowser === 'true' || digitalBrowser === true;
    }
    if (website !== undefined) {
      website = website === 'true' || website === true;
    }
    if (distributor !== undefined) {
      distributor = distributor === 'true' || distributor === true;
    }
    
    // Convert numeric fields
    if (price !== undefined) {
      // If price is empty string, set to 0, otherwise convert to number
      price = price === '' || price === null ? 0 : Number(price);
    }
    if (stock !== undefined) {
      stock = Number(stock);
    }
    if (diamondQuantity !== undefined) {
      diamondQuantity = diamondQuantity ? Number(diamondQuantity) : null;
    }
    
    // Handle image uploads
    let imageUrls: string[] = [];
    let uploadedVideoUrl: string | null = null;
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Handle image uploads
      if (files.images) {
        imageUrls = files.images.map(file => `/uploads/products/${file.filename}`);
      }
      
      // Handle video upload
      if (files.video && files.video.length > 0) {
        uploadedVideoUrl = `/uploads/products/${files.video[0].filename}`;
      }
    }
    
    // Check if image URLs are provided in the request body (for preserving existing images)
    let preservedImageUrls: string[] | null = null;
    if (req.body.imageUrls) {
      try {
        preservedImageUrls = JSON.parse(req.body.imageUrls);
        console.log('Parsed preserved image URLs:', preservedImageUrls);
      } catch (parseError) {
        console.error('Error parsing imageUrls:', parseError);
      }
    }
    
    // If new images are uploaded, update the product and create new image records
    if (imageUrls.length > 0) {
      // Update the main image URL for backward compatibility
      (req.body as any).imageUrl = imageUrls[0];
      
      // Get existing images for this product
      const existingImages = await prisma.productImage.findMany({
        where: { productId: id }
      });
      
      // Create new image records for uploaded images
      const productImages = imageUrls.map((url: string, index: number) => ({
        productId: id,
        url,
        order: index,
        isActive: true
      }));
      
      await prisma.productImage.createMany({
        data: productImages
      });
      
      // Soft delete existing images
      for (const image of existingImages) {
        await prisma.productImage.update({
          where: { id: image.id },
          data: { isActive: false }
        });
      }
    } else if (preservedImageUrls && preservedImageUrls.length > 0) {
      // If image URLs are provided in the request body, update them
      console.log('Preserving existing image URLs:', preservedImageUrls);
      (req.body as any).imageUrl = preservedImageUrls[0]; // Keep for backward compatibility
      
      // Get existing images for this product
      const existingImages = await prisma.productImage.findMany({
        where: { productId: id }
      });
      
      // Update existing images or create new ones as needed
      for (let i = 0; i < preservedImageUrls.length; i++) {
        const url = preservedImageUrls[i];
        const existingImage = existingImages.find(img => img.url === url);
        
        if (existingImage) {
          // Update existing image
          await prisma.productImage.update({
            where: { id: existingImage.id },
            data: { 
              order: i,
              isActive: true
            }
          });
        } else {
          // Create new image record
          await prisma.productImage.create({
            data: {
              productId: id,
              url,
              order: i,
              isActive: true
            }
          });
        }
      }
      
      // Soft delete images that are no longer in the list
      const urlsToKeep = new Set(preservedImageUrls);
      const imagesToDeactivate = existingImages.filter(img => !urlsToKeep.has(img.url));
      
      for (const image of imagesToDeactivate) {
        await prisma.productImage.update({
          where: { id: image.id },
          data: { isActive: false }
        });
      }
    }
    
    console.log('Final update data:', {
      productCode,
      name,
      description,
      fullDescription,
      category,
      subCategory,
      price,
      stock,
      isActive,
      // Gold Fields
      goldWeight,
      goldPurity,
      goldType,
      goldCraftsmanship,
      goldDesignDescription,
      goldFinishedType,
      goldStones,
      goldStoneQuality,
      // Diamond Fields
      diamondType,
      diamondShapeCut,
      diamondColorGrade,
      diamondClarityGrade,
      diamondCutGrade,
      diamondMetalDetails,
      diamondCertification,
      diamondOrigin,
      diamondCaratWeight,
      diamondDetails,
      diamondQuantity,
      diamondSize,
      diamondWeight,
      diamondQuality,
      // Platinum Fields
      platinumWeight,
      platinumType,
      // Silver Fields
      silverWeight,
      silverType,
      // Other Fields
      otherGemstones,
      orderDuration,
      stoneWeight,
      caret,
      jewelryType,
      materialType,
      metalType,
      stoneType,
      settingType,
      size,
      color,
      finish,
      digitalBrowser,
      website,
      distributor,
      culture,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoSlug,
      videoUrl
    });
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        productCode,
        name,
        description,
        fullDescription: fullDescription || null,
        category,
        subCategory,
        price: price && price !== '' ? Number(price) : 0,
        stock: Number(stock) || 0,
        isActive: isActive === 'true' || isActive === true,
        // @ts-ignore - status exists in schema but TypeScript is not recognizing it
        status: status || 'draft',
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : null, // Keep for backward compatibility
        // Gold Fields
        goldWeight,
        goldPurity,
        goldType,
        goldCraftsmanship,
        goldDesignDescription,
        goldFinishedType,
        goldStones,
        goldStoneQuality,
        // Diamond Fields
        diamondType,
        diamondShapeCut,
        diamondColorGrade,
        diamondClarityGrade,
        diamondCutGrade,
        diamondMetalDetails,
        diamondCertification,
        diamondOrigin,
        diamondCaratWeight,
        diamondDetails,
        diamondQuantity: diamondQuantity ? Number(diamondQuantity) : null,
        diamondSize,
        diamondWeight,
        diamondQuality,
        // Platinum Fields
        platinumWeight,
        platinumType,
        // Silver Fields
        silverWeight,
        silverType,
        // Other Fields
        otherGemstones,
        orderDuration,
        stoneWeight,
        caret,
        jewelryType,
        materialType,
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
        seoSlug: seoSlug || null,
        // @ts-ignore - videoUrl exists in schema but TypeScript is not recognizing it
        videoUrl: uploadedVideoUrl || videoUrl || null
      } as any
    });
    
    // Fetch the complete product with images
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          where: { isActive: true },
          orderBy: { order: 'asc' as const }
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: completeProduct as unknown as Product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    // Provide more detailed error information
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: 'Unknown error occurred'
      });
    }
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
    }) as any; // Explicit cast to any to bypass type checking temporarily
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Cycle through status values: draft -> active -> inactive -> draft
    let newStatus = product.status;
    if (product.status === 'draft') {
      newStatus = 'active';
    } else if (product.status === 'active') {
      newStatus = 'inactive';
    } else {
      newStatus = 'draft';
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        // @ts-ignore - status exists in schema but TypeScript is not recognizing it
        status: newStatus
      }
    }) as any; // Explicit cast to any to bypass type checking temporarily
    
    res.json({
      success: true,
      message: `Product status updated to ${newStatus} successfully`,
      data: updatedProduct as unknown as Product
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get product categories
export const getProductCategories = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    // Get distinct categories from products
    const productCategories = await prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true
      }
    });
    
    // Get full category objects from the categories table
    const categoryIds = productCategories.map(c => c.category);
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        isActive: true
      }
    });
    
    res.json({
      success: true,
      data: categories
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