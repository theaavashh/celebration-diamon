"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrivacyPolicy = exports.updatePrivacyPolicy = exports.createPrivacyPolicy = exports.getPrivacyPolicyById = exports.getAllPrivacyPolicies = exports.getActivePrivacyPolicy = void 0;
const database_1 = __importDefault(require("../config/database"));
const getActivePrivacyPolicy = async (req, res) => {
    try {
        const privacyPolicy = await database_1.default.privacyPolicy.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        });
        if (!privacyPolicy) {
            return res.status(404).json({
                success: false,
                message: 'No active privacy policy found'
            });
        }
        res.json({
            success: true,
            data: privacyPolicy
        });
    }
    catch (error) {
        console.error('Error fetching active privacy policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch privacy policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getActivePrivacyPolicy = getActivePrivacyPolicy;
const getAllPrivacyPolicies = async (req, res) => {
    try {
        const privacyPolicies = await database_1.default.privacyPolicy.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json({
            success: true,
            data: privacyPolicies,
            count: privacyPolicies.length
        });
    }
    catch (error) {
        console.error('Error fetching all privacy policies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch privacy policies',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllPrivacyPolicies = getAllPrivacyPolicies;
const getPrivacyPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const privacyPolicy = await database_1.default.privacyPolicy.findUnique({
            where: { id }
        });
        if (!privacyPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Privacy policy not found'
            });
        }
        res.json({
            success: true,
            data: privacyPolicy
        });
    }
    catch (error) {
        console.error('Error fetching privacy policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch privacy policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getPrivacyPolicyById = getPrivacyPolicyById;
const createPrivacyPolicy = async (req, res) => {
    try {
        const { title = 'Privacy Policy', content, isActive = true } = req.body;
        const privacyPolicy = await database_1.default.privacyPolicy.create({
            data: {
                title,
                content,
                isActive: isActive === 'true' || isActive === true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Privacy policy created successfully',
            data: privacyPolicy
        });
    }
    catch (error) {
        console.error('Error creating privacy policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create privacy policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createPrivacyPolicy = createPrivacyPolicy;
const updatePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isActive } = req.body;
        const existingPrivacyPolicy = await database_1.default.privacyPolicy.findUnique({
            where: { id }
        });
        if (!existingPrivacyPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Privacy policy not found'
            });
        }
        const updateData = {
            title: title !== undefined ? title : existingPrivacyPolicy.title,
            content: content !== undefined ? content : existingPrivacyPolicy.content,
            isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingPrivacyPolicy.isActive
        };
        const privacyPolicy = await database_1.default.privacyPolicy.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            message: 'Privacy policy updated successfully',
            data: privacyPolicy
        });
    }
    catch (error) {
        console.error('Error updating privacy policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update privacy policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updatePrivacyPolicy = updatePrivacyPolicy;
const deletePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const existingPrivacyPolicy = await database_1.default.privacyPolicy.findUnique({
            where: { id }
        });
        if (!existingPrivacyPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Privacy policy not found'
            });
        }
        await database_1.default.privacyPolicy.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Privacy policy deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting privacy policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete privacy policy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deletePrivacyPolicy = deletePrivacyPolicy;
//# sourceMappingURL=privacyPolicyController.js.map