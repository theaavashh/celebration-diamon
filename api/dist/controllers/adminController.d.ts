import { Request, Response } from 'express';
interface AdminCreateRequest {
    fullname: string;
    username: string;
    email: string;
    password: string;
    role: string;
    roleIds?: string[];
}
interface AdminUpdateRequest {
    fullname?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    isActive?: boolean;
    roleIds?: string[];
}
export declare const adminValidation: import("express-validator").ValidationChain[];
export declare const adminUpdateValidation: import("express-validator").ValidationChain[];
export declare const getAllAdmins: (req: Request, res: Response) => Promise<void>;
export declare const getAdminById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createAdmin: (req: Request<{}, {}, AdminCreateRequest>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAdmin: (req: Request<{
    id: string;
}, {}, AdminUpdateRequest>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleAdminStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=adminController.d.ts.map