"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleRingCustomizationStatus = exports.deleteRingCustomization = exports.updateRingCustomization = exports.createRingCustomization = exports.getRingCustomizationById = exports.getAllRingCustomizationsAdmin = exports.getAllRingCustomizations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllRingCustomizations = async (req, res) => {
    try {
        const ringCustomizations = await prisma.ringCustomization.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(ringCustomizations);
    }
    catch (error) {
        console.error('Get ring customizations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllRingCustomizations = getAllRingCustomizations;
const getAllRingCustomizationsAdmin = async (req, res) => {
    try {
        const ringCustomizations = await prisma.ringCustomization.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(ringCustomizations);
    }
    catch (error) {
        console.error('Get ring customizations admin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllRingCustomizationsAdmin = getAllRingCustomizationsAdmin;
const getRingCustomizationById = async (req, res) => {
    try {
        const { id } = req.params;
        const ringCustomization = await prisma.ringCustomization.findUnique({
            where: { id }
        });
        if (!ringCustomization) {
            return res.status(404).json({ error: 'Ring customization not found' });
        }
        res.json(ringCustomization);
    }
    catch (error) {
        console.error('Get ring customization by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getRingCustomizationById = getRingCustomizationById;
const createRingCustomization = async (req, res) => {
    try {
        const { title, description, ctaText, ctaLink, processImageUrl, example1Title, example1Desc, example1ImageUrl, example2Title, example2Desc, example2ImageUrl, isActive, sortOrder } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!ctaText || ctaText.trim() === '') {
            return res.status(400).json({ error: 'CTA text is required' });
        }
        const ringCustomization = await prisma.ringCustomization.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                ctaText: ctaText.trim(),
                ctaLink: ctaLink?.trim() || null,
                processImageUrl: processImageUrl?.trim() || null,
                example1Title: example1Title?.trim() || null,
                example1Desc: example1Desc?.trim() || null,
                example1ImageUrl: example1ImageUrl?.trim() || null,
                example2Title: example2Title?.trim() || null,
                example2Desc: example2Desc?.trim() || null,
                example2ImageUrl: example2ImageUrl?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                sortOrder: sortOrder || 0
            }
        });
        res.status(201).json(ringCustomization);
    }
    catch (error) {
        console.error('Create ring customization error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createRingCustomization = createRingCustomization;
const updateRingCustomization = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, ctaText, ctaLink, processImageUrl, example1Title, example1Desc, example1ImageUrl, example2Title, example2Desc, example2ImageUrl, isActive, sortOrder } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!ctaText || ctaText.trim() === '') {
            return res.status(400).json({ error: 'CTA text is required' });
        }
        const existingRingCustomization = await prisma.ringCustomization.findUnique({
            where: { id }
        });
        if (!existingRingCustomization) {
            return res.status(404).json({ error: 'Ring customization not found' });
        }
        const ringCustomization = await prisma.ringCustomization.update({
            where: { id },
            data: {
                title: title.trim(),
                description: description.trim(),
                ctaText: ctaText.trim(),
                ctaLink: ctaLink?.trim() || null,
                processImageUrl: processImageUrl?.trim() || null,
                example1Title: example1Title?.trim() || null,
                example1Desc: example1Desc?.trim() || null,
                example1ImageUrl: example1ImageUrl?.trim() || null,
                example2Title: example2Title?.trim() || null,
                example2Desc: example2Desc?.trim() || null,
                example2ImageUrl: example2ImageUrl?.trim() || null,
                isActive: isActive !== undefined ? isActive : existingRingCustomization.isActive,
                sortOrder: sortOrder !== undefined ? sortOrder : existingRingCustomization.sortOrder
            }
        });
        res.json(ringCustomization);
    }
    catch (error) {
        console.error('Update ring customization error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateRingCustomization = updateRingCustomization;
const deleteRingCustomization = async (req, res) => {
    try {
        const { id } = req.params;
        const existingRingCustomization = await prisma.ringCustomization.findUnique({
            where: { id }
        });
        if (!existingRingCustomization) {
            return res.status(404).json({ error: 'Ring customization not found' });
        }
        await prisma.ringCustomization.delete({
            where: { id }
        });
        res.json({ message: 'Ring customization deleted successfully' });
    }
    catch (error) {
        console.error('Delete ring customization error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteRingCustomization = deleteRingCustomization;
const toggleRingCustomizationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingRingCustomization = await prisma.ringCustomization.findUnique({
            where: { id }
        });
        if (!existingRingCustomization) {
            return res.status(404).json({ error: 'Ring customization not found' });
        }
        const ringCustomization = await prisma.ringCustomization.update({
            where: { id },
            data: {
                isActive: !existingRingCustomization.isActive
            }
        });
        res.json(ringCustomization);
    }
    catch (error) {
        console.error('Toggle ring customization status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleRingCustomizationStatus = toggleRingCustomizationStatus;
//# sourceMappingURL=ringCustomizationController.js.map