'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Course = void 0
const mongoose_1 = require('mongoose')
const courseSchema = new mongoose_1.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    description: {
      type: String,
      required: true,
      minLength: 3,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    modules: {
      type: [mongoose_1.Schema.Types.ObjectId],
      ref: 'Module',
    },
  },
  {
    timestamps: true,
  },
)
exports.Course = (0, mongoose_1.model)('Course', courseSchema)
