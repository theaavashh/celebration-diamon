"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductCategories = exports.toggleProductStatus = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAdminProducts = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;
        const where = {
            isActive: true
        };
        if (category) {
            where.category = {
                equals: category,
                mode: 'insensitive'
            };
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { productCode: { contains: search, mode: 'insensitive' } }
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
                        orderBy: { order: 'asc' }
                    }
                }
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
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllProducts = getAllProducts;
const getAdminProducts = async (req, res) => {
    try {
        const { category, search, status, page = 1, limit = 10 } = req.query;
        const where = {};
        if (category) {
            where.category = {
                equals: category,
                mode: 'insensitive'
            };
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { productCode: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status && status !== 'all') {
            where.status = status;
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
                        orderBy: { order: 'asc' }
                    }
                }
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
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAdminProducts = getAdminProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
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
            data: product
        });
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { productCode, name, description, fullDescription, category, subCategory, price, stock, isActive = true, goldWeight, diamondDetails, stoneWeight, caret, diamondQuantity, diamondSize, diamondWeight, diamondQuality, otherGemstones, orderDuration, metalType, stoneType, settingType, size, color, finish, digitalBrowser = false, website = false, distributor = false, culture, seoTitle, seoDescription, seoKeywords, seoSlug } = req.body;
        let imageUrls = [];
        let uploadedVideoUrl = null;
        if (req.files) {
            const files = req.files;
            if (files.images) {
                imageUrls = files.images.map(file => `/uploads/products/${file.filename}`);
            }
            if (files.video && files.video.length > 0) {
                uploadedVideoUrl = `/uploads/products/${files.video[0].filename}`;
            }
        }
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
                imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
                goldWeight,
                diamondDetails,
                stoneWeight,
                caret,
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
                seoSlug: seoSlug || null,
                videoUrl: uploadedVideoUrl || null
            }
        });
        if (imageUrls.length > 0) {
            const productImages = imageUrls.map((url, index) => ({
                productId: product.id,
                url,
                order: index,
                isActive: true
            }));
            await prisma.productImage.createMany({
                data: productImages
            });
        }
        const completeProduct = await prisma.product.findUnique({
            where: { id: product.id },
            include: {
                images: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: completeProduct
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let { productCode, name, description, fullDescription, category, subCategory, price, stock, isActive, status, goldWeight, diamondDetails, stoneWeight, caret, diamondQuantity, diamondSize, diamondWeight, diamondQuality, otherGemstones, orderDuration, metalType, stoneType, settingType, size, color, finish, digitalBrowser, website, distributor, culture, seoTitle, seoDescription, seoKeywords, seoSlug, videoUrl } = req.body;
        console.log('Update product request for ID:', id);
        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files);
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
        if (price !== undefined) {
            price = price === '' || price === null ? 0 : Number(price);
        }
        if (stock !== undefined) {
            stock = Number(stock);
        }
        if (diamondQuantity !== undefined) {
            diamondQuantity = diamondQuantity ? Number(diamondQuantity) : null;
        }
        let imageUrls = [];
        let uploadedVideoUrl = null;
        if (req.files) {
            const files = req.files;
            if (files.images) {
                imageUrls = files.images.map(file => `/uploads/products/${file.filename}`);
            }
            if (files.video && files.video.length > 0) {
                uploadedVideoUrl = `/uploads/products/${files.video[0].filename}`;
            }
        }
        let preservedImageUrls = null;
        if (req.body.imageUrls) {
            try {
                preservedImageUrls = JSON.parse(req.body.imageUrls);
                console.log('Parsed preserved image URLs:', preservedImageUrls);
            }
            catch (parseError) {
                console.error('Error parsing imageUrls:', parseError);
            }
        }
        if (imageUrls.length > 0) {
            req.body.imageUrl = imageUrls[0];
            await prisma.productImage.updateMany({
                where: { productId: id },
                data: { isActive: false }
            });
            const productImages = imageUrls.map((url, index) => ({
                productId: id,
                url,
                order: index,
                isActive: true
            }));
            await prisma.productImage.createMany({
                data: productImages
            });
        }
        else if (preservedImageUrls && preservedImageUrls.length > 0) {
            console.log('Preserving existing image URLs:', preservedImageUrls);
            req.body.imageUrl = preservedImageUrls[0];
            await prisma.productImage.updateMany({
                where: { productId: id },
                data: { isActive: false }
            });
            const productImages = preservedImageUrls.map((url, index) => ({
                productId: id,
                url,
                order: index,
                isActive: true
            }));
            await prisma.productImage.createMany({
                data: productImages
            });
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
            goldWeight,
            diamondDetails,
            stoneWeight,
            caret,
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
                status: status || 'draft',
                imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
                goldWeight,
                diamondDetails,
                stoneWeight,
                caret,
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
                seoSlug: seoSlug || null,
                videoUrl: videoUrl || null
            }
        });
        const completeProduct = await prisma.product.findUnique({
            where: { id: product.id },
            include: {
                images: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                }
            }
        });
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: completeProduct
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteProduct = deleteProduct;
const toggleProductStatus = async (req, res) => {
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
        let newStatus = product.status;
        if (product.status === 'draft') {
            newStatus = 'active';
        }
        else if (product.status === 'active') {
            newStatus = 'inactive';
        }
        else {
            newStatus = 'draft';
        }
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                status: newStatus
            }
        });
        res.json({
            success: true,
            message: `Product status updated to ${newStatus} successfully`,
            data: updatedProduct
        });
    }
    catch (error) {
        console.error('Error toggling product status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.toggleProductStatus = toggleProductStatus;
const getProductCategories = async (req, res) => {
    try {
        const productCategories = await prisma.product.groupBy({
            by: ['category'],
            where: {
                isActive: true
            }
        });
        const categoryIds = productCategories.map(c => c.category);
        const categories = await prisma.category.findMany({
            where: {
                id: {
                    in: categoryIds
                }
            },
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getProductCategories = getProductCategories;
//# sourceMappingURL=productController.js.map