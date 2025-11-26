"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCelebrationProcessStatus = exports.deleteCelebrationProcess = exports.updateCelebrationProcess = exports.createCelebrationProcess = exports.getCelebrationProcessById = exports.getAllCelebrationProcessesAdmin = exports.getAllCelebrationProcesses = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCelebrationProcesses = async (req, res) => {
    try {
        const celebrationProcesses = await prisma.celebrationProcess.findMany({
            where: { isActive: true },
            include: {
                steps: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(celebrationProcesses);
    }
    catch (error) {
        console.error('Get celebration processes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllCelebrationProcesses = getAllCelebrationProcesses;
const getAllCelebrationProcessesAdmin = async (req, res) => {
    try {
        const celebrationProcesses = await prisma.celebrationProcess.findMany({
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(celebrationProcesses);
    }
    catch (error) {
        console.error('Get celebration processes admin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllCelebrationProcessesAdmin = getAllCelebrationProcessesAdmin;
const getCelebrationProcessById = async (req, res) => {
    try {
        const { id } = req.params;
        const celebrationProcess = await prisma.celebrationProcess.findUnique({
            where: { id },
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        if (!celebrationProcess) {
            return res.status(404).json({ error: 'Celebration process not found' });
        }
        res.json(celebrationProcess);
    }
    catch (error) {
        console.error('Get celebration process by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCelebrationProcessById = getCelebrationProcessById;
const createCelebrationProcess = async (req, res) => {
    try {
        const { title, description, imageUrl, isActive, sortOrder, steps } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        const celebrationProcess = await prisma.celebrationProcess.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                sortOrder: sortOrder || 0,
                steps: steps ? {
                    create: steps.map((step, index) => ({
                        title: step.title.trim(),
                        description: step.description.trim(),
                        icon: step.icon.trim(),
                        order: step.order || index + 1,
                        isActive: step.isActive !== undefined ? step.isActive : true
                    }))
                } : undefined
            },
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        res.status(201).json(celebrationProcess);
    }
    catch (error) {
        console.error('Create celebration process error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createCelebrationProcess = createCelebrationProcess;
const updateCelebrationProcess = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, imageUrl, isActive, sortOrder, steps } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        const existingCelebrationProcess = await prisma.celebrationProcess.findUnique({
            where: { id }
        });
        if (!existingCelebrationProcess) {
            return res.status(404).json({ error: 'Celebration process not found' });
        }
        const celebrationProcess = await prisma.$transaction(async (tx) => {
            const updatedProcess = await tx.celebrationProcess.update({
                where: { id },
                data: {
                    title: title.trim(),
                    description: description?.trim() || null,
                    imageUrl: imageUrl?.trim() || null,
                    isActive: isActive !== undefined ? isActive : existingCelebrationProcess.isActive,
                    sortOrder: sortOrder !== undefined ? sortOrder : existingCelebrationProcess.sortOrder
                }
            });
            if (steps) {
                await tx.celebrationProcessStep.deleteMany({
                    where: { celebrationProcessId: id }
                });
                await tx.celebrationProcessStep.createMany({
                    data: steps.map((step, index) => ({
                        celebrationProcessId: id,
                        title: step.title.trim(),
                        description: step.description.trim(),
                        icon: step.icon.trim(),
                        order: step.order || index + 1,
                        isActive: step.isActive !== undefined ? step.isActive : true
                    }))
                });
            }
            return await tx.celebrationProcess.findUnique({
                where: { id },
                include: {
                    steps: {
                        orderBy: { order: 'asc' }
                    }
                }
            });
        });
        res.json(celebrationProcess);
    }
    catch (error) {
        console.error('Update celebration process error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateCelebrationProcess = updateCelebrationProcess;
const deleteCelebrationProcess = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCelebrationProcess = await prisma.celebrationProcess.findUnique({
            where: { id }
        });
        if (!existingCelebrationProcess) {
            return res.status(404).json({ error: 'Celebration process not found' });
        }
        await prisma.celebrationProcess.delete({
            where: { id }
        });
        res.json({ message: 'Celebration process deleted successfully' });
    }
    catch (error) {
        console.error('Delete celebration process error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteCelebrationProcess = deleteCelebrationProcess;
const toggleCelebrationProcessStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCelebrationProcess = await prisma.celebrationProcess.findUnique({
            where: { id }
        });
        if (!existingCelebrationProcess) {
            return res.status(404).json({ error: 'Celebration process not found' });
        }
        const celebrationProcess = await prisma.celebrationProcess.update({
            where: { id },
            data: {
                isActive: !existingCelebrationProcess.isActive
            },
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        res.json(celebrationProcess);
    }
    catch (error) {
        console.error('Toggle celebration process status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleCelebrationProcessStatus = toggleCelebrationProcessStatus;
//# sourceMappingURL=celebrationProcessController.js.map