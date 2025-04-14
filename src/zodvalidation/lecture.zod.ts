import { z } from 'zod'

export const lectureValidationSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' }),
  module: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid module ID' }),
  video_url: z.string().url({ message: 'Invalid video URL format' }),
  pdf_urls: z
    .array(z.string().url({ message: 'Invalid PDF URL format' }))
    .optional(),
  isFreePreview: z.boolean().default(false),
  isPublished: z.boolean().default(false),
})
