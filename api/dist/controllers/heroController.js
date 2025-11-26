"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleHeroSectionStatus = exports.deleteHeroSection = exports.updateHeroSection = exports.createHeroSection = exports.getHeroSectionById = exports.getAdminHeroSections = exports.getAllHeroSections = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllHeroSections = async (req, res) => {
    try {
        const heroSections = await database_1.default.hero.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: heroSections,
            count: heroSections.length
        });
    }
    catch (error) {
        console.error('Error fetching hero sections:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hero sections',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllHeroSections = getAllHeroSections;
const getAdminHeroSections = async (req, res) => {
    try {
        const heroSections = await database_1.default.hero.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: heroSections,
            count: heroSections.length
        });
    }
    catch (error) {
        console.error('Error fetching hero sections:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hero sections',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAdminHeroSections = getAdminHeroSections;
const getHeroSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const heroSection = await database_1.default.hero.findUnique({
            where: { id }
        });
        if (!heroSection) {
            return res.status(404).json({
                success: false,
                message: 'Hero section not found'
            });
        }
        res.json({
            success: true,
            data: heroSection
        });
    }
    catch (error) {
        console.error('Error fetching hero section:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hero section',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getHeroSectionById = getHeroSectionById;
const createHeroSection = async (req, res) => {
    try {
        const { heading, subHeading, description, ctaTitle, ctaLink, isActive = true } = req.body;
        const isActiveBoolean = isActive === 'true' || isActive === true;
        if (isActiveBoolean) {
            await database_1.default.hero.updateMany({
                where: { isActive: true },
                data: { isActive: false }
            });
        }
        const imageUrl = req.file ? `/uploads/hero/${req.file.filename}` : null;
        const heroSection = await database_1.default.hero.create({
            data: {
                heading,
                subHeading: subHeading || null,
                description: description || null,
                ctaTitle: ctaTitle || null,
                ctaLink: ctaLink || null,
                imageUrl,
                isActive: isActiveBoolean
            }
        });
        res.status(201).json({
            success: true,
            message: 'Hero section created successfully',
            data: heroSection
        });
    }
    catch (error) {
        console.error('Error creating hero section:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create hero section',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createHeroSection = createHeroSection;
const updateHeroSection = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const isActiveBoolean = updateData.isActive === 'true' || updateData.isActive === true;
        if (isActiveBoolean === true) {
            await database_1.default.hero.updateMany({
                where: {
                    isActive: true,
                    id: { not: id }
                },
                data: { isActive: false }
            });
        }
        const imageUrl = req.file ? `/uploads/hero/${req.file.filename}` : updateData.imageUrl;
        const heroSection = await database_1.default.hero.update({
            where: { id },
            data: {
                ...updateData,
                subHeading: updateData.subHeading || null,
                description: updateData.description || null,
                ctaTitle: updateData.ctaTitle || null,
                ctaLink: updateData.ctaLink || null,
                imageUrl: imageUrl || null,
                isActive: isActiveBoolean
            }
        });
        res.json({
            success: true,
            message: 'Hero section updated successfully',
            data: heroSection
        });
    }
    catch (error) {
        console.error('Error updating hero section:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update hero section',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateHeroSection = updateHeroSection;
const deleteHeroSection = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.hero.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Hero section deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting hero section:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete hero section',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteHeroSection = deleteHeroSection;
const toggleHeroSectionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const heroSection = await database_1.default.hero.findUnique({
            where: { id }
        });
        if (!heroSection) {
            return res.status(404).json({
                success: false,
                message: 'Hero section not found'
            });
        }
        if (!heroSection.isActive) {
            await database_1.default.hero.updateMany({
                where: {
                    isActive: true,
                    id: { not: id }
                },
                data: { isActive: false }
            });
        }
        const updatedHeroSection = await database_1.default.hero.update({
            where: { id },
            data: { isActive: !heroSection.isActive }
        });
        res.json({
            success: true,
            message: `Hero section ${updatedHeroSection.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedHeroSection
        });
    }
    catch (error) {
        console.error('Error toggling hero section status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle hero section status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.toggleHeroSectionStatus = toggleHeroSectionStatus;
//# sourceMappingURL=heroController.js.map