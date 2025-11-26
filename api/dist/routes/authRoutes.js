"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
const loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
const registerValidation = [
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
        .withMessage('Password must be at least 6 characters long')
];
const generateToken = (adminId) => {
    const secret = process.env['JWT_SECRET'];
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id: adminId }, secret, { expiresIn: '7d' });
};
router.post('/login', loginValidation, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { email, password } = req.body;
        const admin = await database_1.default.admin.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const token = generateToken(admin.id);
        const { password: _, ...adminData } = admin;
        const isProduction = process.env['NODE_ENV'] === 'production';
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                admin: adminData,
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});
router.post('/register', registerValidation, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { fullname, username, email, password } = req.body;
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
        const admin = await database_1.default.admin.create({
            data: {
                fullname,
                username,
                email,
                password: hashedPassword
            }
        });
        const token = generateToken(admin.id);
        const { password: _, ...adminData } = admin;
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                admin: adminData,
                token
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});
router.post('/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        const admin = await database_1.default.admin.findUnique({
            where: { id: userId }
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        await database_1.default.admin.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        res.json({
            success: true,
            message: 'Password changed successfully',
            data: { message: 'Password changed successfully' }
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password change'
        });
    }
});
const retailerAdminValidation = [
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
    (0, express_validator_1.body)('shopName')
        .trim()
        .notEmpty()
        .withMessage('Shop name is required'),
    (0, express_validator_1.body)('panVatNo')
        .trim()
        .notEmpty()
        .withMessage('PAN/VAT number is required'),
    (0, express_validator_1.body)('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),
    (0, express_validator_1.body)('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),
    (0, express_validator_1.body)('city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    (0, express_validator_1.body)('state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    (0, express_validator_1.body)('zipCode')
        .trim()
        .notEmpty()
        .withMessage('ZIP code is required'),
    (0, express_validator_1.body)('country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),
];
router.post('/retailer/create', retailerAdminValidation, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { fullname, username, email, password, shopName, panVatNo, phone, address, city, state, zipCode, country, status = 'active' } = req.body;
        const existingRetailer = await database_1.default.retailer.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase() },
                    { username }
                ]
            }
        });
        if (existingRetailer) {
            return res.status(400).json({
                success: false,
                message: 'Retailer with this email or username already exists'
            });
        }
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const retailer = await database_1.default.retailer.create({
            data: {
                name: fullname,
                username,
                email: email.toLowerCase(),
                password: hashedPassword,
                shopName,
                panVatNo,
                phone,
                address,
                city,
                state,
                zipCode,
                country,
                status: status || 'active',
                totalOrders: 0,
                totalRevenue: 0,
                lastLogin: null
            }
        });
        const { password: _, ...retailerData } = retailer;
        res.status(201).json({
            success: true,
            message: 'Retailer created successfully',
            data: {
                retailer: retailerData
            }
        });
    }
    catch (error) {
        console.error('Retailer creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during retailer creation'
        });
    }
});
router.get('/me', async (req, res) => {
    try {
        let token = req.cookies?.authToken;
        if (!token) {
            const authHeader = req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        const secret = process.env['JWT_SECRET'];
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const admin = await database_1.default.admin.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                fullname: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }
        res.json({
            success: true,
            data: admin
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: 'strict',
            path: '/',
        });
        res.json({
            success: true,
            message: 'Logged out successfully',
            data: { message: 'Logged out successfully' }
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map