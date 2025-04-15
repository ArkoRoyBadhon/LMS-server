"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidationSchema = void 0;
const zod_1 = require("zod");
exports.courseValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, { message: 'Title must be at least 3 characters long' }),
    description: zod_1.z
        .string()
        .min(3, { message: 'Description must be at least 3 characters long' }),
    thumbnail: zod_1.z.string().url({ message: 'Thumbnail must be a valid URL' }),
    price: zod_1.z.number().min(0, { message: 'Price must be a positive number' }),
});
