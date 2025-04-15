"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentValidationSchema = void 0;
const zod_1 = require("zod");
exports.enrollmentValidationSchema = zod_1.z.object({
    user: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid user ID' }),
    course: zod_1.z
        .string()
        .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid course ID' }),
    enrolledAt: zod_1.z.date().optional(),
    status: zod_1.z
        .enum(['active', 'completed', 'cancelled'])
        .optional()
        .default('active'),
    accessibleVideos: zod_1.z
        .array(zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid video ID' }))
        .optional()
        .default([]),
    nextVideoToUnlock: zod_1.z
        .string()
        .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid video ID' })
        .optional(),
    isCompleted: zod_1.z.boolean().optional().default(false),
});
