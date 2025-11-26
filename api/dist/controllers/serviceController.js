"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleServiceStatus = exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getAdminServices = exports.getAllServices = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllServices = async (req, res) => {
    try {
        const services = await database_1.default.service.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: services,
            count: services.length
        });
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllServices = getAllServices;
const getAdminServices = async (req, res) => {
    try {
        const services = await database_1.default.service.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: services,
            count: services.length
        });
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAdminServices = getAdminServices;
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await database_1.default.service.findUnique({
            where: { id }
        });
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        res.json({
            success: true,
            data: service
        });
    }
    catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch service',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getServiceById = getServiceById;
const createService = async (req, res) => {
    try {
        const { title, description, link, isActive = true, sortOrder = 0 } = req.body;
        const isActiveBoolean = isActive === 'true' || isActive === true;
        const sortOrderNumber = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0;
        const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : null;
        const service = await database_1.default.service.create({
            data: {
                title,
                description,
                imageUrl,
                link: link || null,
                isActive: isActiveBoolean,
                sortOrder: sortOrderNumber
            }
        });
        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create service',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createService = createService;
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (updateData.isActive !== undefined) {
            updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
        }
        if (updateData.sortOrder !== undefined) {
            updateData.sortOrder = typeof updateData.sortOrder === 'string' ? parseInt(updateData.sortOrder, 10) : updateData.sortOrder;
        }
        const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : updateData.imageUrl;
        const service = await database_1.default.service.update({
            where: { id },
            data: {
                ...updateData,
                imageUrl: imageUrl || null,
                link: updateData.link || null
            }
        });
        res.json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    }
    catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update service',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateService = updateService;
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.service.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete service',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteService = deleteService;
const toggleServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await database_1.default.service.findUnique({
            where: { id }
        });
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        const updatedService = await database_1.default.service.update({
            where: { id },
            data: { isActive: !service.isActive }
        });
        res.json({
            success: true,
            message: `Service ${updatedService.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedService
        });
    }
    catch (error) {
        console.error('Error toggling service status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle service status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.toggleServiceStatus = toggleServiceStatus;
//# sourceMappingURL=serviceController.js.map