import { z } from 'zod';
export declare const TestimonialSchema: z.ZodObject<{
    clientName: z.ZodString;
    clientTitle: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    company: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    content: z.ZodString;
    rating: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    imageUrl: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const CreateTestimonialRequestSchema: z.ZodObject<{
    clientName: z.ZodString;
    clientTitle: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    company: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    content: z.ZodString;
    rating: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    imageUrl: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const UpdateTestimonialRequestSchema: z.ZodObject<{
    clientName: z.ZodOptional<z.ZodString>;
    clientTitle: z.ZodOptional<z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>>;
    company: z.ZodOptional<z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>>;
    content: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    imageUrl: z.ZodOptional<z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, z.core.$strip>;
export declare const TestimonialIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const TestimonialQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        sortOrder: "sortOrder";
        createdAt: "createdAt";
        updatedAt: "updatedAt";
        clientName: "clientName";
        rating: "rating";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    isActive: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const TestimonialResponseSchema: z.ZodObject<{
    id: z.ZodString;
    clientName: z.ZodString;
    clientTitle: z.ZodNullable<z.ZodString>;
    company: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
    rating: z.ZodNullable<z.ZodNumber>;
    imageUrl: z.ZodNullable<z.ZodString>;
    isActive: z.ZodBoolean;
    sortOrder: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const TestimonialListResponseSchema: z.ZodObject<{
    testimonials: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        clientName: z.ZodString;
        clientTitle: z.ZodNullable<z.ZodString>;
        company: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
        rating: z.ZodNullable<z.ZodNumber>;
        imageUrl: z.ZodNullable<z.ZodString>;
        isActive: z.ZodBoolean;
        sortOrder: z.ZodNumber;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, z.core.$strip>>;
    pagination: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateTestimonialRequest = z.infer<typeof CreateTestimonialRequestSchema>;
export type UpdateTestimonialRequest = z.infer<typeof UpdateTestimonialRequestSchema>;
export type TestimonialQuery = z.infer<typeof TestimonialQuerySchema>;
export type TestimonialResponse = z.infer<typeof TestimonialResponseSchema>;
export type TestimonialListResponse = z.infer<typeof TestimonialListResponseSchema>;
//# sourceMappingURL=testimonialValidation.d.ts.map