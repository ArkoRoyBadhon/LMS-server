import { z } from 'zod'

export const courseValidationSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' }),
  thumbnail: z.string().url({ message: 'Thumbnail must be a valid URL' }),
  price: z.number().min(0, { message: 'Price must be a positive number' }),
})
