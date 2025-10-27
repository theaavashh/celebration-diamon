"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBannerStatus = exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBannerById = exports.getAdminBanners = exports.getAllBanners = void 0;
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("@/config/database"));
const getAllBanners = async (req, res) => {
    try {
        const { active_only = 'true' } = req.query;
        const whereClause = {};
        if (active_only === 'true') {
            whereClause.isActive = true;
            whereClause.OR = [
                { startDate: null },
                { startDate: { lte: new Date() } }
            ];
            whereClause.AND = [
                {
                    OR: [
                        { endDate: null },
                        { endDate: { gte: new Date() } }
                    ]
                }
            ];
        }
        const banners = await database_1.default.banner.findMany({
            where: whereClause,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        res.json({
            success: true,
            data: banners,
            count: banners.length
        });
    }
    catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch banners',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.getAllBanners = getAllBanners;
const getAdminBanners = async (_req, res) => {
    try {
        const banners = await database_1.default.banner.findMany({
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        res.json({
            success: true,
            data: banners,
            count: banners.length
        });
    }
    catch (error) {
        console.error('Error fetching admin banners:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch banners',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.getAdminBanners = getAdminBanners;
const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await database_1.default.banner.findUnique({
            where: { id }
        });
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        res.json({
            success: true,
            data: banner
        });
    }
    catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch banner',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.getBannerById = getBannerById;
const createBanner = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { title, description, text, linkText, linkUrl, backgroundColor, textColor, isActive, priority, startDate, endDate } = req.body;
        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }
        const banner = await database_1.default.banner.create({
            data: {
                title,
                description: description || null,
                text,
                linkText: linkText || null,
                linkUrl: linkUrl || null,
                backgroundColor: backgroundColor || '#ffffff',
                textColor: textColor || '#000000',
                isActive: isActive !== undefined ? isActive : true,
                priority: priority || 0,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null
            }
        });
        res.status(201).json({
            success: true,
            message: 'Banner created successfully',
            data: banner
        });
    }
    catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create banner',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { title, description, text, linkText, linkUrl, backgroundColor, textColor, isActive, priority, startDate, endDate } = req.body;
        const existingBanner = await database_1.default.banner.findUnique({
            where: { id }
        });
        if (!existingBanner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (text !== undefined)
            updateData.text = text;
        if (linkText !== undefined)
            updateData.linkText = linkText;
        if (linkUrl !== undefined)
            updateData.linkUrl = linkUrl;
        if (backgroundColor !== undefined)
            updateData.backgroundColor = backgroundColor;
        if (textColor !== undefined)
            updateData.textColor = textColor;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (priority !== undefined)
            updateData.priority = priority;
        if (startDate !== undefined)
            updateData.startDate = startDate ? new Date(startDate) : null;
        if (endDate !== undefined)
            updateData.endDate = endDate ? new Date(endDate) : null;
        const banner = await database_1.default.banner.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            message: 'Banner updated successfully',
            data: banner
        });
    }
    catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update banner',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const existingBanner = await database_1.default.banner.findUnique({
            where: { id }
        });
        if (!existingBanner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        await database_1.default.banner.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Banner deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete banner',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.deleteBanner = deleteBanner;
const toggleBannerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingBanner = await database_1.default.banner.findUnique({
            where: { id }
        });
        if (!existingBanner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        const banner = await database_1.default.banner.update({
            where: { id },
            data: {
                isActive: !existingBanner.isActive
            }
        });
        res.json({
            success: true,
            message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
            data: banner
        });
    }
    catch (error) {
        console.error('Error toggling banner status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle banner status',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.toggleBannerStatus = toggleBannerStatus;
//# sourceMappingURL=bannerController.js.map