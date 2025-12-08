"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSubcategoryStatus = exports.deleteSubcategory = exports.updateSubcategory = exports.createSubcategory = exports.getSubcategoryById = exports.getSubcategoriesByCategory = exports.toggleCategoryStatus = exports.deleteCategory = exports.updateCategory = exports.createCategoryWithSubcategories = exports.getCategoryById = exports.getAdminCategories = exports.getAllCategories = void 0;
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const getAllCategories = async (req, res) => {
    try {
        const categories = await database_1.default.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: categories,
            count: categories.length
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
exports.getAllCategories = getAllCategories;
const getAdminCategories = async (req, res) => {
    try {
        const categories = await database_1.default.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                subcategories: {
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });
        res.json({
            success: true,
            data: categories,
            count: categories.length
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
exports.getAdminCategories = getAdminCategories;
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await database_1.default.category.findUnique({
            where: { id }
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        res.json({
            success: true,
            data: category
        });
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getCategoryById = getCategoryById;
const createCategoryWithSubcategories = async (req, res) => {
    try {
        const isActiveValue = req.body.isActive;
        const isActive = typeof isActiveValue === 'string'
            ? isActiveValue.toLowerCase() === 'true'
            : (typeof isActiveValue === 'boolean' ? isActiveValue : true);
        let subcategories = Array.isArray(req.body.subcategories) ? req.body.subcategories : [];
        const { title, link, iconUrl: iconUrlFromBody, imageUrl: imageUrlFromBody, navImage1Url: navImage1UrlFromBody, navImage2Url: navImage2UrlFromBody, sortOrder = 0 } = req.body;
        let iconUrl = iconUrlFromBody || null;
        let imageUrl = imageUrlFromBody || null;
        let navImage1Url = navImage1UrlFromBody || null;
        let navImage2Url = navImage2UrlFromBody || null;
        if (req.files) {
            const files = req.files;
            if (files.icon && files.icon[0]) {
                iconUrl = `/uploads/categories/icons/${files.icon[0].filename}`;
            }
            if (files.image && files.image[0]) {
                imageUrl = `/uploads/categories/images/${files.image[0].filename}`;
            }
            if (files.navImage1 && files.navImage1[0]) {
                navImage1Url = `/uploads/categories/nav-images/${files.navImage1[0].filename}`;
            }
            if (files.navImage2 && files.navImage2[0]) {
                navImage2Url = `/uploads/categories/nav-images/${files.navImage2[0].filename}`;
            }
        }
        const createTransaction = async (includeNavFields) => {
            return database_1.default.$transaction(async (tx) => {
                const data = {
                    title,
                    iconUrl,
                    imageUrl,
                    link: link || null,
                    isActive,
                    sortOrder: typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0
                };
                if (includeNavFields) {
                    if (navImage1Url)
                        data.navImage1Url = navImage1Url;
                    if (navImage2Url)
                        data.navImage2Url = navImage2Url;
                }
                const category = await tx.category.create({
                    data
                });
                if (subcategories.length > 0) {
                    const subcategoryData = subcategories.map((sub, index) => ({
                        name: sub.name,
                        categoryId: category.id,
                        isActive: sub.isActive !== undefined ? sub.isActive : true,
                        sortOrder: sub.sortOrder !== undefined ? sub.sortOrder : index
                    }));
                    await tx.subcategory.createMany({
                        data: subcategoryData
                    });
                }
                const completeCategory = await tx.category.findUnique({
                    where: { id: category.id },
                    include: {
                        subcategories: {
                            orderBy: { sortOrder: 'asc' }
                        }
                    }
                });
                return completeCategory;
            });
        };
        let result = null;
        try {
            result = await createTransaction(true);
        }
        catch (err) {
            const isValidationError = err instanceof client_1.Prisma.PrismaClientValidationError;
            const message = err?.message || '';
            const unknownNavArg = isValidationError && (message.includes('Unknown arg') || message.includes('Unknown argument')) && (message.includes('navImage1Url') || message.includes('navImage2Url'));
            if (unknownNavArg) {
                result = await createTransaction(false);
            }
            else {
                throw err;
            }
        }
        res.status(201).json({
            success: true,
            message: 'Category and subcategories created successfully',
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create category with subcategories',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createCategoryWithSubcategories = createCategoryWithSubcategories;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        let iconUrl = updateData.iconUrl;
        let imageUrl = updateData.imageUrl;
        let navImage1Url = updateData.navImage1Url;
        let navImage2Url = updateData.navImage2Url;
        if (req.files) {
            const files = req.files;
            if (files.icon && files.icon[0]) {
                iconUrl = `/uploads/categories/icons/${files.icon[0].filename}`;
            }
            if (files.image && files.image[0]) {
                imageUrl = `/uploads/categories/images/${files.image[0].filename}`;
            }
            if (files.navImage1 && files.navImage1[0]) {
                navImage1Url = `/uploads/categories/nav-images/${files.navImage1[0].filename}`;
            }
            if (files.navImage2 && files.navImage2[0]) {
                navImage2Url = `/uploads/categories/nav-images/${files.navImage2[0].filename}`;
            }
        }
        const dataToUpdate = {};
        if (updateData.title !== undefined)
            dataToUpdate.title = updateData.title;
        if (updateData.link !== undefined) {
            dataToUpdate.link = updateData.link === '' ? null : updateData.link;
        }
        if (updateData.isActive !== undefined) {
            dataToUpdate.isActive = typeof updateData.isActive === 'string'
                ? updateData.isActive.toLowerCase() === 'true'
                : updateData.isActive;
        }
        if (updateData.sortOrder !== undefined) {
            const parsed = typeof updateData.sortOrder === 'string' ? parseInt(updateData.sortOrder, 10) : updateData.sortOrder;
            dataToUpdate.sortOrder = Number.isNaN(parsed) ? 0 : parsed;
        }
        if (iconUrl !== undefined)
            dataToUpdate.iconUrl = iconUrl === '' ? null : iconUrl;
        if (imageUrl !== undefined)
            dataToUpdate.imageUrl = imageUrl === '' ? null : imageUrl;
        if (navImage1Url !== undefined)
            dataToUpdate.navImage1Url = navImage1Url === '' ? null : navImage1Url;
        if (navImage2Url !== undefined)
            dataToUpdate.navImage2Url = navImage2Url === '' ? null : navImage2Url;
        const tryUpdate = async (includeNavFields) => {
            const data = { ...dataToUpdate };
            if (!includeNavFields) {
                delete data.navImage1Url;
                delete data.navImage2Url;
            }
            return database_1.default.category.update({
                where: { id },
                data
            });
        };
        let category = null;
        try {
            category = await tryUpdate(true);
        }
        catch (err) {
            const isValidationError = err instanceof client_1.Prisma.PrismaClientValidationError;
            const message = err?.message || '';
            const unknownNavArg = isValidationError && (message.includes('Unknown arg') || message.includes('Unknown argument')) && (message.includes('navImage1Url') || message.includes('navImage2Url'));
            if (unknownNavArg) {
                category = await tryUpdate(false);
            }
            else {
                throw err;
            }
        }
        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.$transaction([
            database_1.default.subcategory.deleteMany({
                where: { categoryId: id }
            }),
            database_1.default.category.delete({
                where: { id }
            })
        ]);
        res.json({
            success: true,
            message: 'Category and associated subcategories deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteCategory = deleteCategory;
const toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await database_1.default.category.findUnique({
            where: { id }
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        const updatedCategory = await database_1.default.category.update({
            where: { id },
            data: { isActive: !category.isActive }
        });
        res.json({
            success: true,
            message: `Category ${updatedCategory.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedCategory
        });
    }
    catch (error) {
        console.error('Error toggling category status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle category status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.toggleCategoryStatus = toggleCategoryStatus;
const getSubcategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const subcategories = await database_1.default.subcategory.findMany({
            where: {
                categoryId,
                isActive: true
            },
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: subcategories,
            count: subcategories.length
        });
    }
    catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getSubcategoriesByCategory = getSubcategoriesByCategory;
const getSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await database_1.default.subcategory.findUnique({
            where: { id }
        });
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }
        res.json({
            success: true,
            data: subcategory
        });
    }
    catch (error) {
        console.error('Error fetching subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategory',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getSubcategoryById = getSubcategoryById;
const createSubcategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, isActive = true, sortOrder = 0 } = req.body;
        const subcategory = await database_1.default.subcategory.create({
            data: {
                name,
                categoryId,
                isActive,
                sortOrder
            }
        });
        res.status(201).json({
            success: true,
            message: 'Subcategory created successfully',
            data: subcategory
        });
    }
    catch (error) {
        console.error('Error creating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subcategory',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createSubcategory = createSubcategory;
const updateSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        const subcategory = await database_1.default.subcategory.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            message: 'Subcategory updated successfully',
            data: subcategory
        });
    }
    catch (error) {
        console.error('Error updating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update subcategory',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateSubcategory = updateSubcategory;
const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.subcategory.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Subcategory deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete subcategory',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteSubcategory = deleteSubcategory;
const toggleSubcategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await database_1.default.subcategory.findUnique({
            where: { id }
        });
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }
        const updatedSubcategory = await database_1.default.subcategory.update({
            where: { id },
            data: { isActive: !subcategory.isActive }
        });
        res.json({
            success: true,
            message: `Subcategory ${updatedSubcategory.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedSubcategory
        });
    }
    catch (error) {
        console.error('Error toggling subcategory status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle subcategory status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.toggleSubcategoryStatus = toggleSubcategoryStatus;
//# sourceMappingURL=categoryController.js.map