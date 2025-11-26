"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAdminStatus = exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAdminById = exports.getAllAdmins = exports.adminUpdateValidation = exports.adminValidation = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
exports.adminValidation = [
    (0, express_validator_1.body)('fullname')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['admin', 'manager', 'editor', 'viewer'])
        .withMessage('Invalid role')
];
exports.adminUpdateValidation = [
    (0, express_validator_1.body)('fullname')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['admin', 'manager', 'editor', 'viewer'])
        .withMessage('Invalid role')
];
const getAllAdmins = async (req, res) => {
    try {
        const admins = await database_1.default.admin.findMany({
            include: {
                adminRoles: {
                    include: {
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        const adminsWithoutPasswords = admins.map(admin => {
            const { password, ...adminData } = admin;
            return adminData;
        });
        res.json({
            success: true,
            data: adminsWithoutPasswords
        });
    }
    catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admins'
        });
    }
};
exports.getAllAdmins = getAllAdmins;
const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await database_1.default.admin.findUnique({
            where: { id },
            include: {
                adminRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const { password, ...adminData } = admin;
        res.json({
            success: true,
            data: adminData
        });
    }
    catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin'
        });
    }
};
exports.getAdminById = getAdminById;
const createAdmin = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { fullname, username, email, password, role, roleIds } = req.body;
        const existingAdmin = await database_1.default.admin.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin with this email or username already exists'
            });
        }
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const admin = await database_1.default.$transaction(async (tx) => {
            const newAdmin = await tx.admin.create({
                data: {
                    fullname,
                    username,
                    email,
                    password: hashedPassword,
                    role: role || 'admin'
                }
            });
            if (roleIds && roleIds.length > 0) {
                await tx.adminRole.createMany({
                    data: roleIds.map(roleId => ({
                        adminId: newAdmin.id,
                        roleId
                    }))
                });
            }
            return newAdmin;
        });
        const adminWithRoles = await database_1.default.admin.findUnique({
            where: { id: admin.id },
            include: {
                adminRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        const { password: _, ...adminData } = adminWithRoles;
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: adminData
        });
    }
    catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admin'
        });
    }
};
exports.createAdmin = createAdmin;
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, username, email, password, role, isActive, roleIds } = req.body;
        const existingAdmin = await database_1.default.admin.findUnique({
            where: { id }
        });
        if (!existingAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const updateData = {};
        if (fullname !== undefined)
            updateData.fullname = fullname;
        if (username !== undefined)
            updateData.username = username;
        if (email !== undefined)
            updateData.email = email;
        if (role !== undefined)
            updateData.role = role;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (password) {
            const saltRounds = 12;
            updateData.password = await bcryptjs_1.default.hash(password, saltRounds);
        }
        const admin = await database_1.default.$transaction(async (tx) => {
            const updatedAdmin = await tx.admin.update({
                where: { id },
                data: updateData
            });
            if (roleIds) {
                await tx.adminRole.deleteMany({
                    where: { adminId: id }
                });
                if (roleIds.length > 0) {
                    await tx.adminRole.createMany({
                        data: roleIds.map(roleId => ({
                            adminId: id,
                            roleId
                        }))
                    });
                }
            }
            return updatedAdmin;
        });
        const adminWithRoles = await database_1.default.admin.findUnique({
            where: { id },
            include: {
                adminRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        const { password: _, ...adminData } = adminWithRoles;
        res.json({
            success: true,
            message: 'Admin updated successfully',
            data: adminData
        });
    }
    catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating admin'
        });
    }
};
exports.updateAdmin = updateAdmin;
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const existingAdmin = await database_1.default.admin.findUnique({
            where: { id }
        });
        if (!existingAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        await database_1.default.admin.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Admin deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting admin'
        });
    }
};
exports.deleteAdmin = deleteAdmin;
const toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await database_1.default.admin.findUnique({
            where: { id }
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const updatedAdmin = await database_1.default.admin.update({
            where: { id },
            data: {
                isActive: !admin.isActive
            },
            include: {
                adminRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        const { password, ...adminData } = updatedAdmin;
        res.json({
            success: true,
            message: `Admin ${updatedAdmin.isActive ? 'activated' : 'deactivated'} successfully`,
            data: adminData
        });
    }
    catch (error) {
        console.error('Error toggling admin status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling admin status'
        });
    }
};
exports.toggleAdminStatus = toggleAdminStatus;
//# sourceMappingURL=adminController.js.map