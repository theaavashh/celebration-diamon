"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
        const skip = (page - 1) * limit;
        const totalCount = await database_1.default.retailer.count();
        const retailers = await database_1.default.retailer.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                shopName: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                status: true,
                totalOrders: true,
                totalRevenue: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        });
        const formattedRetailers = retailers.map(retailer => ({
            id: retailer.id,
            name: retailer.name,
            email: retailer.email,
            phone: retailer.phone,
            address: `${retailer.address}, ${retailer.city}, ${retailer.state} ${retailer.zipCode}, ${retailer.country}`,
            status: retailer.status,
            registrationDate: retailer.createdAt.toISOString().split('T')[0],
            totalOrders: retailer.totalOrders,
            totalRevenue: retailer.totalRevenue,
            lastLogin: retailer.lastLogin || 'Never'
        }));
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            success: true,
            data: formattedRetailers,
            count: totalCount,
            page,
            limit,
            totalPages
        });
    }
    catch (error) {
        console.error('Error fetching retailers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching retailers'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const retailer = await database_1.default.retailer.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                shopName: true,
                panVatNo: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                status: true,
                totalOrders: true,
                totalRevenue: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!retailer) {
            return res.status(404).json({
                success: false,
                message: 'Retailer not found'
            });
        }
        res.json({
            success: true,
            data: retailer
        });
    }
    catch (error) {
        console.error('Error fetching retailer:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching retailer'
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (updateData.password) {
            const hashedPassword = await bcryptjs_1.default.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        else {
            delete updateData.password;
        }
        const retailer = await database_1.default.retailer.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                shopName: true,
                panVatNo: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                status: true,
                totalOrders: true,
                totalRevenue: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        res.json({
            success: true,
            message: 'Retailer updated successfully',
            data: retailer
        });
    }
    catch (error) {
        console.error('Error updating retailer:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating retailer'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.retailer.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Retailer deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting retailer:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting retailer'
        });
    }
});
exports.default = router;
//# sourceMappingURL=retailerRoutes.js.map