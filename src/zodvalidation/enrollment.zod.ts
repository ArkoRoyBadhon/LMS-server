import { z } from 'zod'

export const enrollmentValidationSchema = z.object({
  user: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid user ID' }),
  course: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid course ID' }),
  enrolledAt: z.date().optional(),
  status: z
    .enum(['active', 'completed', 'cancelled'])
    .optional()
    .default('active'),
  accessibleVideos: z
    .array(
      z.string().regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid video ID' }),
    )
    .optional()
    .default([]),
  nextVideoToUnlock: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid video ID' })
    .optional(),
  isCompleted: z.boolean().optional().default(false),
})
