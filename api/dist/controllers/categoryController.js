"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCategoryStatus = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAdminCategories = exports.getAllCategories = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllCategories = async (req, res) => {
    try {
        const categories = await database_1.default.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        console.log('Public categories response:', categories);
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
            orderBy: { sortOrder: 'asc' }
        });
        console.log('Admin categories response:', categories);
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
const createCategory = async (req, res) => {
    try {
        const { title, link, isActive = true, sortOrder = 0 } = req.body;
        const isActiveBoolean = isActive === 'true' || isActive === true;
        const sortOrderNumber = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0;
        const imageUrl = req.file ? `/uploads/categories/${req.file.filename}` : null;
        const category = await database_1.default.category.create({
            data: {
                title,
                imageUrl,
                link: link || null,
                isActive: isActiveBoolean,
                sortOrder: sortOrderNumber
            }
        });
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (updateData.isActive !== undefined) {
            updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
        }
        if (updateData.sortOrder !== undefined) {
            updateData.sortOrder = typeof updateData.sortOrder === 'string' ? parseInt(updateData.sortOrder, 10) : updateData.sortOrder;
        }
        const imageUrl = req.file ? `/uploads/categories/${req.file.filename}` : updateData.imageUrl;
        const category = await database_1.default.category.update({
            where: { id },
            data: {
                ...updateData,
                imageUrl: imageUrl || null,
                link: updateData.link || null
            }
        });
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
        await database_1.default.category.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Category deleted successfully'
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
//# sourceMappingURL=categoryController.js.map