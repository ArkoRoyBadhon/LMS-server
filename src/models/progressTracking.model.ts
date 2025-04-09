import { Document, model, Schema } from 'mongoose'

interface IProgressTracking extends Document {
  user: Schema.Types.ObjectId
  enrollment: Schema.Types.ObjectId
  accessibleVideos: Schema.Types.ObjectId[]
  completedVideos: Schema.Types.ObjectId[]
  nextVideoToUnlock: Schema.Types.ObjectId
  isCompleted: boolean
}

const progressTrackingSchema = new Schema<IProgressTracking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    accessibleVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        default: [],
      },
    ],
    completedVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        default: [],
      },
    ],
    nextVideoToUnlock: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const ProgressTracking = model<IProgressTracking>(
  'ProgressTracking',
  progressTrackingSchema,
)
