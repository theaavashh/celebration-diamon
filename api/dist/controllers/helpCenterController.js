"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHelpCenter = exports.updateHelpCenter = exports.createHelpCenter = exports.getHelpCenterById = exports.getAllHelpCenters = exports.getActiveHelpCenter = void 0;
const database_1 = __importDefault(require("../config/database"));
const getActiveHelpCenter = async (req, res) => {
    try {
        const helpCenter = await database_1.default.helpCenter.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        });
        if (!helpCenter) {
            return res.status(404).json({
                success: false,
                message: 'No active help center found'
            });
        }
        res.json({
            success: true,
            data: helpCenter
        });
    }
    catch (error) {
        console.error('Error fetching active help center:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch help center',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getActiveHelpCenter = getActiveHelpCenter;
const getAllHelpCenters = async (req, res) => {
    try {
        const helpCenters = await database_1.default.helpCenter.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json({
            success: true,
            data: helpCenters,
            count: helpCenters.length
        });
    }
    catch (error) {
        console.error('Error fetching all help centers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch help centers',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllHelpCenters = getAllHelpCenters;
const getHelpCenterById = async (req, res) => {
    try {
        const { id } = req.params;
        const helpCenter = await database_1.default.helpCenter.findUnique({
            where: { id }
        });
        if (!helpCenter) {
            return res.status(404).json({
                success: false,
                message: 'Help center not found'
            });
        }
        res.json({
            success: true,
            data: helpCenter
        });
    }
    catch (error) {
        console.error('Error fetching help center:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch help center',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getHelpCenterById = getHelpCenterById;
const createHelpCenter = async (req, res) => {
    try {
        const { title = 'Help Center', content, isActive = true } = req.body;
        const helpCenter = await database_1.default.helpCenter.create({
            data: {
                title,
                content,
                isActive: isActive === 'true' || isActive === true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Help center created successfully',
            data: helpCenter
        });
    }
    catch (error) {
        console.error('Error creating help center:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create help center',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createHelpCenter = createHelpCenter;
const updateHelpCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isActive } = req.body;
        const existingHelpCenter = await database_1.default.helpCenter.findUnique({
            where: { id }
        });
        if (!existingHelpCenter) {
            return res.status(404).json({
                success: false,
                message: 'Help center not found'
            });
        }
        const updateData = {
            title: title !== undefined ? title : existingHelpCenter.title,
            content: content !== undefined ? content : existingHelpCenter.content,
            isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingHelpCenter.isActive
        };
        const helpCenter = await database_1.default.helpCenter.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            message: 'Help center updated successfully',
            data: helpCenter
        });
    }
    catch (error) {
        console.error('Error updating help center:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update help center',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateHelpCenter = updateHelpCenter;
const deleteHelpCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const existingHelpCenter = await database_1.default.helpCenter.findUnique({
            where: { id }
        });
        if (!existingHelpCenter) {
            return res.status(404).json({
                success: false,
                message: 'Help center not found'
            });
        }
        await database_1.default.helpCenter.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Help center deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting help center:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete help center',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteHelpCenter = deleteHelpCenter;
//# sourceMappingURL=helpCenterController.js.map