"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReturnPolicy = exports.updateReturnPolicy = exports.createReturnPolicy = exports.getReturnPolicyById = exports.getAllReturnPolicies = exports.getActiveReturnPolicy = void 0;
const database_1 = __importDefault(require("../config/database"));
const getActiveReturnPolicy = async (req, res) => {
    try {
        const returnPolicy = await database_1.default.returnPolicy.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        });
        if (!returnPolicy) {
            return res.status(404).json({
                success: false,
                message: 'No active return policy found'
            });
        }
        res.json({
            success: true,
            data: returnPolicy
        });
    }
    catch (error) {
        console.error('Error fetching active return policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch return policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getActiveReturnPolicy = getActiveReturnPolicy;
const getAllReturnPolicies = async (req, res) => {
    try {
        const returnPolicies = await database_1.default.returnPolicy.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json({
            success: true,
            data: returnPolicies,
            count: returnPolicies.length
        });
    }
    catch (error) {
        console.error('Error fetching all return policies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch return policies',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllReturnPolicies = getAllReturnPolicies;
const getReturnPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const returnPolicy = await database_1.default.returnPolicy.findUnique({
            where: { id }
        });
        if (!returnPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Return policy not found'
            });
        }
        res.json({
            success: true,
            data: returnPolicy
        });
    }
    catch (error) {
        console.error('Error fetching return policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch return policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getReturnPolicyById = getReturnPolicyById;
const createReturnPolicy = async (req, res) => {
    try {
        const { title = 'Return Policy', content, isActive = true } = req.body;
        const returnPolicy = await database_1.default.returnPolicy.create({
            data: {
                title,
                content,
                isActive: isActive === 'true' || isActive === true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Return policy created successfully',
            data: returnPolicy
        });
    }
    catch (error) {
        console.error('Error creating return policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create return policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createReturnPolicy = createReturnPolicy;
const updateReturnPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isActive } = req.body;
        const existingReturnPolicy = await database_1.default.returnPolicy.findUnique({
            where: { id }
        });
        if (!existingReturnPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Return policy not found'
            });
        }
        const updateData = {
            title: title !== undefined ? title : existingReturnPolicy.title,
            content: content !== undefined ? content : existingReturnPolicy.content,
            isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingReturnPolicy.isActive
        };
        const returnPolicy = await database_1.default.returnPolicy.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            message: 'Return policy updated successfully',
            data: returnPolicy
        });
    }
    catch (error) {
        console.error('Error updating return policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update return policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateReturnPolicy = updateReturnPolicy;
const deleteReturnPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const existingReturnPolicy = await database_1.default.returnPolicy.findUnique({
            where: { id }
        });
        if (!existingReturnPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Return policy not found'
            });
        }
        await database_1.default.returnPolicy.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Return policy deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting return policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete return policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteReturnPolicy = deleteReturnPolicy;
//# sourceMappingURL=returnPolicyController.js.map