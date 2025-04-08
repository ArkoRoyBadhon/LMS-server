import { Document, model, Schema } from 'mongoose'

interface ICourse extends Document {
  title: string
  description: string
  thumbnail: string
  price: number
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

export const Course = model<ICourse>('Course', courseSchema)
