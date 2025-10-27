import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: appointments
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments'
    });
  }
};

// Get single appointment by ID
export const getAppointmentById = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment'
    });
  }
};

// Create new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      productName,
      name,
      email,
      phone,
      culture,
      appointmentType,
      preferredDate,
      preferredTime,
      additionalNotes
    } = req.body;
    
    // Validation
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
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment'
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment'
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.appointment.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete appointment'
    });
  }
};

