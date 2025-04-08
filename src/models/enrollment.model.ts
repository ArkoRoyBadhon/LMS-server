import { Document, model, Schema } from 'mongoose'

interface IEnrollment extends Document {
  user: Schema.Types.ObjectId
  course: Schema.Types.ObjectId
  enrolledAt: Date
  status: 'active' | 'completed' | 'cancelled'
}

const enrollmentSchema = new Schema<IEnrollment>({
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
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
})

export const Enrollment = model<IEnrollment>('Enrollment', enrollmentSchema)
