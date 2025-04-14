import { Document, model, Schema } from 'mongoose'

interface ILecture extends Document {
  title: string
  module: Schema.Types.ObjectId
  video_url: string
  pdf_urls: string[]
  isFreePreview: boolean
  isPublished: boolean
}

const lectureSchema = new Schema<ILecture>(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    video_url: {
      type: String,
      required: true,
    },
    pdf_urls: {
      type: [String],
      required: true,
    },
    isFreePreview: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export const Lecture = model<ILecture>('Lecture', lectureSchema)
