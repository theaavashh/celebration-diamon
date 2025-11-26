"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCultureStatus = exports.deleteCulture = exports.updateCulture = exports.createCulture = exports.getCultureById = exports.getAllCulturesAdmin = exports.getAllCultures = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCultures = async (req, res) => {
    try {
        const cultures = await prisma.culture.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(cultures);
    }
    catch (error) {
        console.error('Get cultures error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllCultures = getAllCultures;
const getAllCulturesAdmin = async (req, res) => {
    try {
        const cultures = await prisma.culture.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(cultures);
    }
    catch (error) {
        console.error('Get cultures admin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllCulturesAdmin = getAllCulturesAdmin;
const getCultureById = async (req, res) => {
    try {
        const { id } = req.params;
        const culture = await prisma.culture.findUnique({
            where: { id }
        });
        if (!culture) {
            return res.status(404).json({ error: 'Culture not found' });
        }
        res.json(culture);
    }
    catch (error) {
        console.error('Get culture by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCultureById = getCultureById;
const createCulture = async (req, res) => {
    try {
        const { name, title, subtitle, description, ctaText, ctaLink, imageUrl, isActive, sortOrder } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Culture name is required' });
        }
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!subtitle || subtitle.trim() === '') {
            return res.status(400).json({ error: 'Subtitle is required' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!ctaText || ctaText.trim() === '') {
            return res.status(400).json({ error: 'CTA text is required' });
        }
        const culture = await prisma.culture.create({
            data: {
                name: name.trim(),
                title: title.trim(),
                subtitle: subtitle.trim(),
                description: description.trim(),
                ctaText: ctaText.trim(),
                ctaLink: ctaLink?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                sortOrder: sortOrder || 0
            }
        });
        res.status(201).json(culture);
    }
    catch (error) {
        console.error('Create culture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createCulture = createCulture;
const updateCulture = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, subtitle, description, ctaText, ctaLink, imageUrl, isActive, sortOrder } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Culture name is required' });
        }
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!subtitle || subtitle.trim() === '') {
            return res.status(400).json({ error: 'Subtitle is required' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!ctaText || ctaText.trim() === '') {
            return res.status(400).json({ error: 'CTA text is required' });
        }
        const existingCulture = await prisma.culture.findUnique({
            where: { id }
        });
        if (!existingCulture) {
            return res.status(404).json({ error: 'Culture not found' });
        }
        const culture = await prisma.culture.update({
            where: { id },
            data: {
                name: name.trim(),
                title: title.trim(),
                subtitle: subtitle.trim(),
                description: description.trim(),
                ctaText: ctaText.trim(),
                ctaLink: ctaLink?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
                isActive: isActive !== undefined ? isActive : existingCulture.isActive,
                sortOrder: sortOrder !== undefined ? sortOrder : existingCulture.sortOrder
            }
        });
        res.json(culture);
    }
    catch (error) {
        console.error('Update culture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateCulture = updateCulture;
const deleteCulture = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCulture = await prisma.culture.findUnique({
            where: { id }
        });
        if (!existingCulture) {
            return res.status(404).json({ error: 'Culture not found' });
        }
        await prisma.culture.delete({
            where: { id }
        });
        res.json({ message: 'Culture deleted successfully' });
    }
    catch (error) {
        console.error('Delete culture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteCulture = deleteCulture;
const toggleCultureStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCulture = await prisma.culture.findUnique({
            where: { id }
        });
        if (!existingCulture) {
            return res.status(404).json({ error: 'Culture not found' });
        }
        const culture = await prisma.culture.update({
            where: { id },
            data: {
                isActive: !existingCulture.isActive
            }
        });
        res.json(culture);
    }
    catch (error) {
        console.error('Toggle culture status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleCultureStatus = toggleCultureStatus;
//# sourceMappingURL=cultureController.js.map