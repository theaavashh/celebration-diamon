"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = require("../controllers/appointmentController");
const router = (0, express_1.Router)();
router.get('/', appointmentController_1.getAllAppointments);
router.get('/:id', appointmentController_1.getAppointmentById);
router.post('/', appointmentController_1.createAppointment);
router.patch('/:id/status', appointmentController_1.updateAppointmentStatus);
router.delete('/:id', appointmentController_1.deleteAppointment);
exports.default = router;
//# sourceMappingURL=appointmentRoutes.js.map