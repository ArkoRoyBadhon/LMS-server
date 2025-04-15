'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.lectureValidationSchema = void 0
const zod_1 = require('zod')
exports.lectureValidationSchema = zod_1.z.object({
  title: zod_1.z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' }),
  module: zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid module ID' }),
  video_url: zod_1.z.string().url({ message: 'Invalid video URL format' }),
  pdf_urls: zod_1.z
    .array(zod_1.z.string().url({ message: 'Invalid PDF URL format' }))
    .optional(),
  isFreePreview: zod_1.z.boolean().default(false),
  isPublished: zod_1.z.boolean().default(false),
})
