"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleValidationSchema = void 0;
const zod_1 = require("zod");
exports.moduleValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, { message: 'Title must be at least 3 characters long' }),
    course: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, {
        message: 'Invalid ObjectId format for course',
    }),
    module_number: zod_1.z.number().int().positive().optional(), // Optional, will be auto-generated if not provided
    isPublished: zod_1.z.boolean().default(false),
    lectures: zod_1.z
        .array(zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, {
        message: 'Invalid ObjectId format for lectures',
    }))
        .default([]),
});
