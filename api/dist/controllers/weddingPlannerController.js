"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWeddingPlannerStatus = exports.deleteWeddingPlanner = exports.updateWeddingPlanner = exports.createWeddingPlanner = exports.getWeddingPlannerById = exports.getAllWeddingPlannersAdmin = exports.getAllWeddingPlanners = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllWeddingPlanners = async (req, res) => {
    try {
        const weddingPlanners = await prisma.weddingPlanner.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(weddingPlanners);
    }
    catch (error) {
        console.error('Get wedding planners error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllWeddingPlanners = getAllWeddingPlanners;
const getAllWeddingPlannersAdmin = async (req, res) => {
    try {
        const weddingPlanners = await prisma.weddingPlanner.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(weddingPlanners);
    }
    catch (error) {
        console.error('Get wedding planners admin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllWeddingPlannersAdmin = getAllWeddingPlannersAdmin;
const getWeddingPlannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const weddingPlanner = await prisma.weddingPlanner.findUnique({
            where: { id }
        });
        if (!weddingPlanner) {
            return res.status(404).json({ error: 'Wedding planner not found' });
        }
        res.json(weddingPlanner);
    }
    catch (error) {
        console.error('Get wedding planner by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getWeddingPlannerById = getWeddingPlannerById;
const createWeddingPlanner = async (req, res) => {
    try {
        const { title, description, ctaText, ctaLink, imageUrl, badgeText, badgeSubtext, isActive, sortOrder } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!ctaText || ctaText.trim() === '') {
            return res.status(400).json({ error: 'CTA text is required' });
        }
        const weddingPlanner = await prisma.weddingPlanner.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                ctaText: ctaText.trim(),
                ctaLink: ctaLink?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
                badgeText: badgeText?.trim() || null,
                badgeSubtext: badgeSubtext?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                sortOrder: sortOrder || 0
            }
        });
        res.status(201).json(weddingPlanner);
    }
    catch (error) {
        console.error('Create wedding planner error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createWeddingPlanner = createWeddingPlanner;
const updateWeddingPlanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, ctaText, ctaLink, imageUrl, badgeText, badgeSubtext, isActive, sortOrder } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!ctaText || ctaText.trim() === '') {
            return res.status(400).json({ error: 'CTA text is required' });
        }
        const existingWeddingPlanner = await prisma.weddingPlanner.findUnique({
            where: { id }
        });
        if (!existingWeddingPlanner) {
            return res.status(404).json({ error: 'Wedding planner not found' });
        }
        const weddingPlanner = await prisma.weddingPlanner.update({
            where: { id },
            data: {
                title: title.trim(),
                description: description.trim(),
                ctaText: ctaText.trim(),
                ctaLink: ctaLink?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
                badgeText: badgeText?.trim() || null,
                badgeSubtext: badgeSubtext?.trim() || null,
                isActive: isActive !== undefined ? isActive : existingWeddingPlanner.isActive,
                sortOrder: sortOrder !== undefined ? sortOrder : existingWeddingPlanner.sortOrder
            }
        });
        res.json(weddingPlanner);
    }
    catch (error) {
        console.error('Update wedding planner error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateWeddingPlanner = updateWeddingPlanner;
const deleteWeddingPlanner = async (req, res) => {
    try {
        const { id } = req.params;
        const existingWeddingPlanner = await prisma.weddingPlanner.findUnique({
            where: { id }
        });
        if (!existingWeddingPlanner) {
            return res.status(404).json({ error: 'Wedding planner not found' });
        }
        await prisma.weddingPlanner.delete({
            where: { id }
        });
        res.json({ message: 'Wedding planner deleted successfully' });
    }
    catch (error) {
        console.error('Delete wedding planner error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteWeddingPlanner = deleteWeddingPlanner;
const toggleWeddingPlannerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingWeddingPlanner = await prisma.weddingPlanner.findUnique({
            where: { id }
        });
        if (!existingWeddingPlanner) {
            return res.status(404).json({ error: 'Wedding planner not found' });
        }
        const weddingPlanner = await prisma.weddingPlanner.update({
            where: { id },
            data: {
                isActive: !existingWeddingPlanner.isActive
            }
        });
        res.json(weddingPlanner);
    }
    catch (error) {
        console.error('Toggle wedding planner status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleWeddingPlannerStatus = toggleWeddingPlannerStatus;
//# sourceMappingURL=weddingPlannerController.js.map