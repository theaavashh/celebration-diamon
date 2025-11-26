import { Request, Response } from 'express';
export declare const getAllTestimonialSections: (req: Request, res: Response) => Promise<void>;
export declare const getAllTestimonialSectionsAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getTestimonialSectionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTestimonialSection: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTestimonialSection: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTestimonialSection: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleTestimonialSectionStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=testimonialSectionController.d.ts.map