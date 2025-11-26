import { Request, Response } from 'express';
export declare const getAllAppointments: (req: Request, res: Response) => Promise<void>;
export declare const getAppointmentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAppointmentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAppointment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=appointmentController.d.ts.map