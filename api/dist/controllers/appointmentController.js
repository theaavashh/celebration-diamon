"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.updateAppointmentStatus = exports.createAppointment = exports.getAppointmentById = exports.getAllAppointments = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: appointments
        });
    }
    catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch appointments'
        });
    }
};
exports.getAllAppointments = getAllAppointments;
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await prisma.appointment.findUnique({
            where: { id }
        });
        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }
        res.json({
            success: true,
            data: appointment
        });
    }
    catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch appointment'
        });
    }
};
exports.getAppointmentById = getAppointmentById;
const createAppointment = async (req, res) => {
    try {
        const { productId, productName, name, email, phone, culture, appointmentType, preferredDate, preferredTime, additionalNotes } = req.body;
        if (!name || !email || !phone || !appointmentType || !preferredDate || !preferredTime) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        const appointment = await prisma.appointment.create({
            data: {
                productId: productId || null,
                productName: productName || null,
                name,
                email,
                phone,
                culture: culture || null,
                appointmentType,
                preferredDate,
                preferredTime,
                additionalNotes: additionalNotes || null,
                status: 'PENDING'
            }
        });
        res.json({
            success: true,
            data: appointment
        });
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create appointment'
        });
    }
};
exports.createAppointment = createAppointment;
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }
        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                status,
                updatedAt: new Date()
            }
        });
        res.json({
            success: true,
            data: appointment
        });
    }
    catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update appointment'
        });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.appointment.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete appointment'
        });
    }
};
exports.deleteAppointment = deleteAppointment;
//# sourceMappingURL=appointmentController.js.map