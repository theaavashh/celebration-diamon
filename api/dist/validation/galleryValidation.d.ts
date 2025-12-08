import { z } from 'zod';
export declare const GalleryItemSchema: z.ZodObject<{
    imageUrl: z.ZodString;
    sortOrder: z.ZodNumber;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const GallerySchema: z.ZodObject<{
    title: z.ZodString;
    subtitle: z.ZodString;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    galleryItems: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        imageUrl: z.ZodString;
        sortOrder: z.ZodNumber;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const CreateGalleryRequestSchema: z.ZodObject<{
    title: z.ZodString;
    subtitle: z.ZodString;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    galleryItems: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        imageUrl: z.ZodString;
        sortOrder: z.ZodNumber;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const UpdateGalleryRequestSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    subtitle: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    galleryItems: z.ZodOptional<z.ZodArray<z.ZodObject<{
        imageUrl: z.ZodString;
        sortOrder: z.ZodNumber;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const GalleryIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const GalleryItemIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const GalleryQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        title: "title";
        sortOrder: "sortOrder";
        createdAt: "createdAt";
        updatedAt: "updatedAt";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    isActive: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GalleryItemResponseSchema: z.ZodObject<{
    id: z.ZodString;
    galleryId: z.ZodString;
    imageUrl: z.ZodString;
    isActive: z.ZodBoolean;
    sortOrder: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const GalleryResponseSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodString;
    isActive: z.ZodBoolean;
    sortOrder: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    galleryItems: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        galleryId: z.ZodString;
        imageUrl: z.ZodString;
        isActive: z.ZodBoolean;
        sortOrder: z.ZodNumber;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const GalleryListResponseSchema: z.ZodObject<{
    galleries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        subtitle: z.ZodString;
        isActive: z.ZodBoolean;
        sortOrder: z.ZodNumber;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        galleryItems: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            galleryId: z.ZodString;
            imageUrl: z.ZodString;
            isActive: z.ZodBoolean;
            sortOrder: z.ZodNumber;
            createdAt: z.ZodDate;
            updatedAt: z.ZodDate;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    pagination: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateGalleryRequest = z.infer<typeof CreateGalleryRequestSchema>;
export type UpdateGalleryRequest = z.infer<typeof UpdateGalleryRequestSchema>;
export type GalleryQuery = z.infer<typeof GalleryQuerySchema>;
export type GalleryResponse = z.infer<typeof GalleryResponseSchema>;
export type GalleryItemResponse = z.infer<typeof GalleryItemResponseSchema>;
export type GalleryListResponse = z.infer<typeof GalleryListResponseSchema>;
//# sourceMappingURL=galleryValidation.d.ts.map