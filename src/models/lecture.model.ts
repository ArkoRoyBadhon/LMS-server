import { Document, model, Schema } from 'mongoose'

interface ILecture extends Document {
  title: string
  module: Schema.Types.ObjectId
  // course: Schema.Types.ObjectId
  video_url: string
  pdf_urls: string[]
  position: number
  isFreePreview: boolean
  isPublished: boolean
}

const lectureSchema = new Schema<ILecture>({
  title: {
    type: String,
    required: true,
  },
  module: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  // course: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Course',
  //   required: true,
  // },
  video_url: {
    type: String,
    required: true,
  },
  pdf_urls: {
    type: [String],
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  isFreePreview: {
    type: Boolean,
    required: true,
  },
  isPublished: {
    type: Boolean,
    required: true,
  },
})

export const Lecture = model<ILecture>('Lecture', lectureSchema)
