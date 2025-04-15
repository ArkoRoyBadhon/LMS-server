'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Module = void 0
const mongoose_1 = require('mongoose')
const moduleSchema = new mongoose_1.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    course: {
      type: mongoose_1.Schema.Types.ObjectId,
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
      type: [mongoose_1.Schema.Types.ObjectId],
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
    const lastModule = await exports.Module.find()
    this.module_number = lastModule ? lastModule.length + 1 : 1
    next()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    next(err)
  }
})
exports.Module = (0, mongoose_1.model)('Module', moduleSchema)
