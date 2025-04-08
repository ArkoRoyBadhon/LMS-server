import { Document, model, Schema } from 'mongoose'

interface IModule extends Document {
  title: string
  course: Schema.Types.ObjectId
  position: number
  isPublished: boolean
}

const moduleSchema = new Schema<IModule>({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  isPublished: {
    type: Boolean,
    required: true,
  },
})

export const Module = model<IModule>('Module', moduleSchema)
