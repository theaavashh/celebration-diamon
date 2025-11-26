"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTerms = exports.updateTerms = exports.createTerms = exports.getTermsById = exports.getAllTerms = exports.getActiveTerms = void 0;
const database_1 = __importDefault(require("../config/database"));
const getActiveTerms = async (req, res) => {
    try {
        const terms = await database_1.default.termsAndConditions.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        });
        if (!terms) {
            return res.status(404).json({
                success: false,
                message: 'No active terms found'
            });
        }
        res.json({
            success: true,
            data: terms
        });
    }
    catch (error) {
        console.error('Error fetching active terms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch terms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getActiveTerms = getActiveTerms;
const getAllTerms = async (req, res) => {
    try {
        const terms = await database_1.default.termsAndConditions.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json({
            success: true,
            data: terms,
            count: terms.length
        });
    }
    catch (error) {
        console.error('Error fetching all terms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch terms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllTerms = getAllTerms;
const getTermsById = async (req, res) => {
    try {
        const { id } = req.params;
        const terms = await database_1.default.termsAndConditions.findUnique({
            where: { id }
        });
        if (!terms) {
            return res.status(404).json({
                success: false,
                message: 'Terms not found'
            });
        }
        res.json({
            success: true,
            data: terms
        });
    }
    catch (error) {
        console.error('Error fetching terms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch terms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getTermsById = getTermsById;
const createTerms = async (req, res) => {
    try {
        const { title = 'Terms & Conditions', content, isActive = true } = req.body;
        const terms = await database_1.default.termsAndConditions.create({
            data: {
                title,
                content,
                isActive: isActive === 'true' || isActive === true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Terms created successfully',
            data: terms
        });
    }
    catch (error) {
        console.error('Error creating terms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create terms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createTerms = createTerms;
const updateTerms = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isActive } = req.body;
        const existingTerms = await database_1.default.termsAndConditions.findUnique({
            where: { id }
        });
        if (!existingTerms) {
            return res.status(404).json({
                success: false,
                message: 'Terms not found'
            });
        }
        const updateData = {
            title: title !== undefined ? title : existingTerms.title,
            content: content !== undefined ? content : existingTerms.content,
            isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingTerms.isActive
        };
        const terms = await database_1.default.termsAndConditions.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            message: 'Terms updated successfully',
            data: terms
        });
    }
    catch (error) {
        console.error('Error updating terms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update terms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateTerms = updateTerms;
const deleteTerms = async (req, res) => {
    try {
        const { id } = req.params;
        const existingTerms = await database_1.default.termsAndConditions.findUnique({
            where: { id }
        });
        if (!existingTerms) {
            return res.status(404).json({
                success: false,
                message: 'Terms not found'
            });
        }
        await database_1.default.termsAndConditions.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Terms deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting terms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete terms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteTerms = deleteTerms;
//# sourceMappingURL=termsController.js.map