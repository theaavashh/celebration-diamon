"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSubcategoryStatus = exports.deleteSubcategory = exports.updateSubcategory = exports.createSubcategory = exports.getSubcategoryById = exports.getAdminSubcategories = exports.getSubcategoriesByCategoryId = exports.getAllSubcategories = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await database_1.default.subcategory.findMany({
            where: {
                isActive: true,
                category: {
                    isActive: true
                }
            },
            orderBy: { sortOrder: 'asc' },
            include: {
                category: true
            }
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
exports.getAllSubcategories = getAllSubcategories;
const getSubcategoriesByCategoryId = async (req, res) => {
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
exports.getSubcategoriesByCategoryId = getSubcategoriesByCategoryId;
const getAdminSubcategories = async (req, res) => {
    try {
        const subcategories = await database_1.default.subcategory.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                category: true
            }
        });
        console.log('Admin subcategories response:', subcategories);
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
exports.getAdminSubcategories = getAdminSubcategories;
const getSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await database_1.default.subcategory.findUnique({
            where: { id },
            include: {
                category: true
            }
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
        const { name, categoryId, isActive = true, sortOrder = 0 } = req.body;
        const category = await database_1.default.category.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }
        const isActiveBoolean = isActive === 'true' || isActive === true;
        const sortOrderNumber = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0;
        const subcategory = await database_1.default.subcategory.create({
            data: {
                name,
                categoryId,
                isActive: isActiveBoolean,
                sortOrder: sortOrderNumber
            },
            include: {
                category: true
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
        if (updateData.isActive !== undefined) {
            updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
        }
        if (updateData.sortOrder !== undefined) {
            updateData.sortOrder = typeof updateData.sortOrder === 'string' ? parseInt(updateData.sortOrder, 10) : updateData.sortOrder;
        }
        if (updateData.categoryId) {
            const category = await database_1.default.category.findUnique({
                where: { id: updateData.categoryId }
            });
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }
        const subcategory = await database_1.default.subcategory.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
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
            data: { isActive: !subcategory.isActive },
            include: {
                category: true
            }
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
//# sourceMappingURL=subcategoryController.js.map