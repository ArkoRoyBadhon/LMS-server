'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Lecture = void 0
const mongoose_1 = require('mongoose')
const lectureSchema = new mongoose_1.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    module: {
      type: mongoose_1.Schema.Types.ObjectId,
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
exports.Lecture = (0, mongoose_1.model)('Lecture', lectureSchema)
