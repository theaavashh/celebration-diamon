"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoleById = exports.getAllRoles = exports.roleValidation = void 0;
const database_1 = __importDefault(require("../config/database"));
const express_validator_1 = require("express-validator");
exports.roleValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Role name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Role name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description must not exceed 200 characters')
];
const getAllRoles = async (req, res) => {
    try {
        const roles = await database_1.default.role.findMany({
            where: { isActive: true },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({
            success: true,
            data: roles
        });
    }
    catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching roles'
        });
    }
};
exports.getAllRoles = getAllRoles;
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await database_1.default.role.findUnique({
            where: { id }
        });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }
        res.json({
            success: true,
            data: role
        });
    }
    catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role'
        });
    }
};
exports.getRoleById = getRoleById;
const createRole = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { name, description, permissions } = req.body;
        const existingRole = await database_1.default.role.findUnique({
            where: { name }
        });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: 'Role with this name already exists'
            });
        }
        const role = await database_1.default.role.create({
            data: {
                name,
                description,
                permissions
            }
        });
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role
        });
    }
    catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating role'
        });
    }
};
exports.createRole = createRole;
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, permissions } = req.body;
        const existingRole = await database_1.default.role.findUnique({
            where: { id }
        });
        if (!existingRole) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }
        const role = await database_1.default.role.update({
            where: { id },
            data: {
                name,
                description,
                permissions
            }
        });
        res.json({
            success: true,
            message: 'Role updated successfully',
            data: role
        });
    }
    catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating role'
        });
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const existingRole = await database_1.default.role.findUnique({
            where: { id }
        });
        if (!existingRole) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }
        await database_1.default.role.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Role deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting role'
        });
    }
};
exports.deleteRole = deleteRole;
//# sourceMappingURL=roleController.js.map