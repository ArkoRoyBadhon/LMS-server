import { z } from 'zod'

export const moduleValidationSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' }),
  course: z.string().regex(/^[a-fA-F0-9]{24}$/, {
    message: 'Invalid ObjectId format for course',
  }),
  module_number: z.number().int().positive().optional(), // Optional, will be auto-generated if not provided
  isPublished: z.boolean().default(false),
  lectures: z
    .array(
      z.string().regex(/^[a-fA-F0-9]{24}$/, {
        message: 'Invalid ObjectId format for lectures',
      }),
    )
    .default([]),
})
