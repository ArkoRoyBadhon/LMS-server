import { Document, model, Schema } from 'mongoose'

interface IModule extends Document {
  title: string
  course: Schema.Types.ObjectId
  module_number: number
  isPublished: boolean
  lectures: Schema.Types.ObjectId[]
}

const moduleSchema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    module_number: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    lectures: {
      type: [Schema.Types.ObjectId],
      ref: 'Lecture',
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

moduleSchema.index({ module_number: 1 }, { unique: true })

moduleSchema.pre('save', async function (next) {
  if (!this.isNew || this.module_number) {
    return next()
  }

  try {
    const lastModule = await Module.find()

    this.module_number = lastModule ? lastModule.length + 1 : 1
    next()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err)
  }
})

export const Module = model<IModule>('Module', moduleSchema)
