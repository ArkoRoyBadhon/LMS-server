import { Document, model, Schema } from 'mongoose'

interface IProgressTracking extends Document {
  user: Schema.Types.ObjectId
  course: Schema.Types.ObjectId
  lecture: Schema.Types.ObjectId
  isCompleted: boolean
}

const progressTrackingSchema = new Schema<IProgressTracking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  lecture: {
    type: Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
})

export const ProgressTracking = model<IProgressTracking>(
  'ProgressTracking',
  progressTrackingSchema,
)
