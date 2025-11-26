"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleGalleryStatus = exports.deleteGallery = exports.updateGallery = exports.createGallery = exports.getGalleryById = exports.getAllGalleriesAdmin = exports.getAllGalleries = void 0;
const client_1 = require("@prisma/client");
const galleryValidation_1 = require("../validation/galleryValidation");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
class GalleryNotFoundError extends Error {
    constructor(id) {
        super(`Gallery with ID ${id} not found`);
        this.name = 'GalleryNotFoundError';
    }
}
class GalleryValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GalleryValidationError';
    }
}
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
    }
}
async function withTransaction(operation) {
    return await prisma.$transaction(async (tx) => {
        try {
            return await operation(tx);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseError(`Database operation failed: ${error.message}`);
            }
            throw error;
        }
    });
}
function validateRequest(schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError && error.errors) {
            const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
            throw new GalleryValidationError(`Validation failed: ${errorMessages.join(', ')}`);
        }
        throw error;
    }
}
function buildPaginationResponse(items, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        data: items,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}
const getAllGalleries = async (req, res) => {
    try {
        const queryParams = validateRequest(galleryValidation_1.GalleryQuerySchema, req.query);
        const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;
        const where = {
            isActive: isActive ?? true,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { subtitle: { contains: search, mode: 'insensitive' } },
                    { galleryItems: { some: { title: { contains: search, mode: 'insensitive' } } } }
                ]
            })
        };
        const orderBy = {
            [sortBy]: sortOrder
        };
        const skip = (page - 1) * limit;
        const [galleries, total] = await Promise.all([
            prisma.gallery.findMany({
                where,
                include: {
                    galleryItems: {
                        where: { isActive: true },
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.gallery.count({ where })
        ]);
        const response = buildPaginationResponse(galleries, total, page, limit);
        res.status(200).json({
            success: true,
            data: response.data,
            pagination: response.pagination,
            message: 'Galleries retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all galleries error:', error);
        if (error instanceof GalleryValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getAllGalleries = getAllGalleries;
const getAllGalleriesAdmin = async (req, res) => {
    try {
        const queryParams = validateRequest(galleryValidation_1.GalleryQuerySchema, req.query);
        const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;
        const where = {
            ...(isActive !== undefined && { isActive }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { subtitle: { contains: search, mode: 'insensitive' } },
                    { galleryItems: { some: { title: { contains: search, mode: 'insensitive' } } } }
                ]
            })
        };
        const orderBy = {
            [sortBy]: sortOrder
        };
        const skip = (page - 1) * limit;
        const [galleries, total] = await Promise.all([
            prisma.gallery.findMany({
                where,
                include: {
                    galleryItems: {
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.gallery.count({ where })
        ]);
        const response = buildPaginationResponse(galleries, total, page, limit);
        res.status(200).json({
            success: true,
            data: response.data,
            pagination: response.pagination,
            message: 'Galleries retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all galleries admin error:', error);
        if (error instanceof GalleryValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getAllGalleriesAdmin = getAllGalleriesAdmin;
const getGalleryById = async (req, res) => {
    try {
        const { id } = validateRequest(galleryValidation_1.GalleryIdSchema, req.params);
        const gallery = await prisma.gallery.findUnique({
            where: { id },
            include: {
                galleryItems: {
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });
        if (!gallery) {
            throw new GalleryNotFoundError(id);
        }
        res.status(200).json({
            success: true,
            data: gallery,
            message: 'Gallery retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get gallery by ID error:', error);
        if (error instanceof GalleryNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof GalleryValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getGalleryById = getGalleryById;
const createGallery = async (req, res) => {
    try {
        const galleryData = validateRequest(galleryValidation_1.CreateGalleryRequestSchema, req.body);
        const gallery = await withTransaction(async (tx) => {
            const newGallery = await tx.gallery.create({
                data: {
                    title: galleryData.title,
                    subtitle: galleryData.subtitle,
                    isActive: galleryData.isActive,
                    sortOrder: galleryData.sortOrder,
                    galleryItems: galleryData.galleryItems ? {
                        create: galleryData.galleryItems.map((item, index) => ({
                            title: item.title,
                            imageUrl: item.imageUrl,
                            description: item.description,
                            sortOrder: item.sortOrder || index + 1,
                            isActive: item.isActive
                        }))
                    } : undefined
                },
                include: {
                    galleryItems: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });
            return newGallery;
        });
        res.status(201).json({
            success: true,
            data: gallery,
            message: 'Gallery created successfully'
        });
    }
    catch (error) {
        console.error('Create gallery error:', error);
        if (error instanceof GalleryValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.createGallery = createGallery;
const updateGallery = async (req, res) => {
    try {
        const { id } = validateRequest(galleryValidation_1.GalleryIdSchema, req.params);
        const updateData = validateRequest(galleryValidation_1.UpdateGalleryRequestSchema, req.body);
        const existingGallery = await prisma.gallery.findUnique({
            where: { id },
            include: { galleryItems: true }
        });
        if (!existingGallery) {
            throw new GalleryNotFoundError(id);
        }
        const gallery = await withTransaction(async (tx) => {
            const updatedGallery = await tx.gallery.update({
                where: { id },
                data: {
                    title: updateData.title,
                    subtitle: updateData.subtitle,
                    isActive: updateData.isActive,
                    sortOrder: updateData.sortOrder
                }
            });
            if (updateData.galleryItems) {
                await tx.galleryItem.deleteMany({
                    where: { galleryId: id }
                });
                await tx.galleryItem.createMany({
                    data: updateData.galleryItems.map((item, index) => ({
                        galleryId: id,
                        title: item.title,
                        imageUrl: item.imageUrl,
                        description: item.description,
                        sortOrder: item.sortOrder || index + 1,
                        isActive: item.isActive
                    }))
                });
            }
            return await tx.gallery.findUnique({
                where: { id },
                include: {
                    galleryItems: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });
        });
        res.status(200).json({
            success: true,
            data: gallery,
            message: 'Gallery updated successfully'
        });
    }
    catch (error) {
        console.error('Update gallery error:', error);
        if (error instanceof GalleryNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof GalleryValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.updateGallery = updateGallery;
const deleteGallery = async (req, res) => {
    try {
        const { id } = validateRequest(galleryValidation_1.GalleryIdSchema, req.params);
        const existingGallery = await prisma.gallery.findUnique({
            where: { id }
        });
        if (!existingGallery) {
            throw new GalleryNotFoundError(id);
        }
        await withTransaction(async (tx) => {
            await tx.gallery.delete({
                where: { id }
            });
        });
        res.status(200).json({
            success: true,
            message: 'Gallery deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete gallery error:', error);
        if (error instanceof GalleryNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof GalleryValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.deleteGallery = deleteGallery;
const toggleGalleryStatus = async (req, res) => {
    try {
        const { id } = validateRequest(galleryValidation_1.GalleryIdSchema, req.params);
        const gallery = await withTransaction(async (tx) => {
            const currentGallery = await tx.gallery.findUnique({
                where: { id },
                include: { galleryItems: true }
            });
            if (!currentGallery) {
                throw new GalleryNotFoundError(id);
            }
            const updatedGallery = await tx.gallery.update({
                where: { id },
                data: {
                    isActive: !currentGallery.isActive
                },
                include: {
                    galleryItems: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });
            return updatedGallery;
        });
        res.status(200).json({
            success: true,
            data: gallery,
            message: `Gallery ${gallery.isActive ? 'activated' : 'deactivated'} successfully`
        });
    }
    catch (error) {
        console.error('Toggle gallery status error:', error);
        if (error instanceof GalleryNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof GalleryValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.toggleGalleryStatus = toggleGalleryStatus;
//# sourceMappingURL=galleryController.js.map