"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductCategories = exports.toggleProductStatus = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAdminProducts = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function toBool(v, fallback = false) {
    if (typeof v === 'boolean')
        return v;
    if (typeof v === 'string')
        return v.toLowerCase() === 'true';
    return fallback;
}
function toNum(v, fallback = 0) {
    if (v === '' || v === null || v === undefined)
        return fallback;
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
}
function toStr(v, fallback = '') {
    return typeof v === 'string' ? v : fallback;
}
function extractUploads(req) {
    let imageUrls = [];
    let uploadedVideoUrl = null;
    if (req.files) {
        const files = req.files;
        if (files.images) {
            imageUrls = files.images.map(f => `/uploads/products/${f.filename}`);
        }
        if (files.video && files.video.length > 0) {
            uploadedVideoUrl = `/uploads/products/${files.video[0].filename}`;
        }
    }
    return { imageUrls, uploadedVideoUrl };
}
async function upsertImages(productId, uploaded, preserved) {
    if (uploaded.length > 0) {
        const existingImages = await prisma.productImage.findMany({ where: { productId } });
        const productImages = uploaded.map((url, i) => ({ productId, url, order: i, isActive: true }));
        await prisma.productImage.createMany({ data: productImages });
        for (const image of existingImages) {
            await prisma.productImage.update({ where: { id: image.id }, data: { isActive: false } });
        }
        return uploaded[0] || null;
    }
    if (preserved && preserved.length > 0) {
        const existingImages = await prisma.productImage.findMany({ where: { productId } });
        for (let i = 0; i < preserved.length; i++) {
            const url = preserved[i];
            const existing = existingImages.find(img => img.url === url);
            if (existing) {
                await prisma.productImage.update({ where: { id: existing.id }, data: { order: i, isActive: true } });
            }
            else {
                await prisma.productImage.create({ data: { productId, url, order: i, isActive: true } });
            }
        }
        const keep = new Set(preserved);
        const deactivate = existingImages.filter(img => !keep.has(img.url));
        for (const image of deactivate) {
            await prisma.productImage.update({ where: { id: image.id }, data: { isActive: false } });
        }
        return preserved[0] || null;
    }
    return null;
}
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
        const sanitized = products.map((p) => {
            const { caret, otherGemstones, stoneWeight, stoneType, settingType, size, color, ...rest } = p;
            return rest;
        });
        res.json({
            success: true,
            data: sanitized,
            count: sanitized.length,
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
        const sanitized = products.map((p) => {
            const { caret, otherGemstones, stoneWeight, stoneType, settingType, size, color, ...rest } = p;
            return rest;
        });
        res.json({
            success: true,
            data: sanitized,
            count: sanitized.length,
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
        const { caret, otherGemstones, stoneWeight, stoneType, settingType, size, color, ...rest } = product;
        res.json({
            success: true,
            data: rest
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
        const { productCode, name, description, fullDescription, category, subCategory, price, stock, isActive = true, goldWeight, goldPurity, goldType, goldCraftsmanship, goldDesignDescription, goldFinishedType, goldStones, goldStoneQuality, diamondType, diamondShapeCut, diamondColorGrade, diamondClarityGrade, diamondCutGrade, diamondMetalDetails, diamondCertification, diamondOrigin, diamondCaratWeight, diamondDetails, diamondQuantity, diamondSize, diamondWeight, diamondQuality, platinumWeight, platinumType, silverWeight, silverType, orderDuration, jewelryType, materialType, metalType, finish, digitalBrowser = false, website = false, distributor = false, culture, seoTitle, seoDescription, seoKeywords, seoSlug, videoUrl } = req.body;
        const safeName = toStr(name);
        const safeCategory = toStr(category);
        const { imageUrls, uploadedVideoUrl } = extractUploads(req);
        const product = await prisma.product.create({
            data: {
                productCode,
                name: safeName,
                description,
                fullDescription: fullDescription || null,
                category: safeCategory,
                subCategory,
                price: toNum(price, 0),
                stock: toNum(stock, 0),
                isActive: toBool(isActive, true),
                imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
                goldWeight,
                goldPurity,
                goldType,
                goldCraftsmanship,
                goldDesignDescription,
                goldFinishedType,
                goldStones,
                goldStoneQuality,
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
                diamondQuantity: diamondQuantity ? toNum(diamondQuantity) : null,
                diamondSize,
                diamondWeight,
                diamondQuality,
                platinumWeight,
                platinumType,
                silverWeight,
                silverType,
                orderDuration,
                jewelryType,
                materialType,
                metalType,
                finish,
                digitalBrowser: toBool(digitalBrowser, false),
                website: toBool(website, false),
                distributor: toBool(distributor, false),
                culture: culture || null,
                seoTitle: seoTitle || null,
                seoDescription: seoDescription || null,
                seoKeywords: seoKeywords || null,
                seoSlug: seoSlug || null,
                videoUrl: uploadedVideoUrl || videoUrl || null,
                status: 'draft'
            }
        });
        if (imageUrls.length > 0) {
            const productImages = imageUrls.map((url, index) => ({ productId: product.id, url, order: index, isActive: true }));
            await prisma.productImage.createMany({ data: productImages });
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
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Product Code already available',
                error: 'Unique constraint violation'
            });
            return;
        }
        if (error instanceof Error) {
            const response = {
                success: false,
                message: 'Failed to create product',
                error: error.message
            };
            if (process.env.NODE_ENV === 'development' && error.stack) {
                response.stack = error.stack;
            }
            res.status(500).json(response);
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to create product',
                error: 'Unknown error occurred'
            });
        }
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let { productCode, name, description, fullDescription, category, subCategory, price, stock, isActive, status, goldWeight, goldPurity, goldType, goldCraftsmanship, goldDesignDescription, goldFinishedType, goldStones, goldStoneQuality, diamondType, diamondShapeCut, diamondColorGrade, diamondClarityGrade, diamondCutGrade, diamondMetalDetails, diamondCertification, diamondOrigin, diamondCaratWeight, diamondDetails, diamondQuantity, diamondSize, diamondWeight, diamondQuality, platinumWeight, platinumType, silverWeight, silverType, orderDuration, jewelryType, materialType, metalType, finish, digitalBrowser, website, distributor, culture, seoTitle, seoDescription, seoKeywords, seoSlug, videoUrl } = req.body;
        console.log('Update product request for ID:', id);
        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files);
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        if (isActive !== undefined)
            isActive = toBool(isActive, existingProduct.isActive);
        if (digitalBrowser !== undefined)
            digitalBrowser = toBool(digitalBrowser, existingProduct?.digitalBrowser ?? false);
        if (website !== undefined)
            website = toBool(website, existingProduct?.website ?? false);
        if (distributor !== undefined)
            distributor = toBool(distributor, existingProduct?.distributor ?? false);
        if (price !== undefined)
            price = toNum(price, 0);
        if (stock !== undefined)
            stock = toNum(stock, 0);
        if (diamondQuantity !== undefined)
            diamondQuantity = diamondQuantity ? toNum(diamondQuantity) : null;
        const { imageUrls, uploadedVideoUrl } = extractUploads(req);
        let preservedImageUrls = null;
        if (req.body.imageUrls) {
            try {
                preservedImageUrls = JSON.parse(req.body.imageUrls);
            }
            catch { }
        }
        const mainImageUrl = await upsertImages(id, imageUrls, preservedImageUrls);
        req.body.imageUrl = mainImageUrl;
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
            goldPurity,
            goldType,
            goldCraftsmanship,
            goldDesignDescription,
            goldFinishedType,
            goldStones,
            goldStoneQuality,
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
            platinumWeight,
            platinumType,
            silverWeight,
            silverType,
            orderDuration,
            jewelryType,
            materialType,
            metalType,
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
                price: toNum(price, 0),
                stock: toNum(stock, 0),
                isActive: toBool(isActive, true),
                status: status || 'draft',
                imageUrl: mainImageUrl,
                goldWeight,
                goldPurity,
                goldType,
                goldCraftsmanship,
                goldDesignDescription,
                goldFinishedType,
                goldStones,
                goldStoneQuality,
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
                diamondQuantity: diamondQuantity ? toNum(diamondQuantity) : null,
                diamondSize,
                diamondWeight,
                diamondQuality,
                platinumWeight,
                platinumType,
                silverWeight,
                silverType,
                orderDuration,
                jewelryType,
                materialType,
                metalType,
                finish,
                digitalBrowser: toBool(digitalBrowser, false),
                website: toBool(website, false),
                distributor: toBool(distributor, false),
                culture: culture || null,
                seoTitle: seoTitle || null,
                seoDescription: seoDescription || null,
                seoKeywords: seoKeywords || null,
                seoSlug: seoSlug || null,
                videoUrl: uploadedVideoUrl || videoUrl || null
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
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Product Code already available',
                error: 'Unique constraint violation'
            });
            return;
        }
        if (error instanceof Error) {
            const response = {
                success: false,
                message: 'Failed to update product',
                error: error.message
            };
            if (process.env.NODE_ENV === 'development' && error.stack) {
                response.stack = error.stack;
            }
            res.status(500).json(response);
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to update product',
                error: 'Unknown error occurred'
            });
        }
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
                id: { in: categoryIds },
                isActive: true
            }
        });
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product categories',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getProductCategories = getProductCategories;
//# sourceMappingURL=productController.js.map