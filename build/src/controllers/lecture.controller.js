'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const mongoose_1 = require('mongoose')
const AppError_1 = __importDefault(require('../error/AppError'))
const lecture_model_1 = require('../models/lecture.model')
const module_model_1 = require('../models/module.model')
const HandleCatchAsync_1 = __importDefault(require('../utils/HandleCatchAsync'))
const SendResponse_1 = __importDefault(require('../utils/SendResponse'))
const createLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const {
    title,
    module: moduleId,
    video_url,
    pdf_urls,
    isFreePreview,
    isPublished,
  } = req.body
  const session = await (0, mongoose_1.startSession)()
  try {
    await session.withTransaction(async () => {
      const moduleExists =
        await module_model_1.Module.findById(moduleId).session(session)
      if (!moduleExists) {
        throw new AppError_1.default(404, 'Module not found')
      }
      const [lecture] = await lecture_model_1.Lecture.create(
        [
          {
            title,
            module: moduleId,
            video_url,
            pdf_urls,
            isFreePreview,
            isPublished,
          },
        ],
        { session },
      )
      await module_model_1.Module.findByIdAndUpdate(
        moduleId,
        { $push: { lectures: lecture._id } },
        { session },
      )
      ;(0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: 'Lecture created successfully',
        data: lecture,
      })
    })
  } catch {
    throw new AppError_1.default(
      500,
      'An error occurred while creating the lecture',
    )
  } finally {
    session.endSession()
  }
})
const getLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError_1.default(400, 'Lecture id is required')
  }
  const lecture = await lecture_model_1.Lecture.findById(id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture fetched successfully',
    data: lecture,
  })
})
const getAllLectures = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const lecture = await lecture_model_1.Lecture.find()
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Lectures fetched successfully',
    data: lecture,
  })
})
const getLecturesByModule = (0, HandleCatchAsync_1.default)(
  async (req, res) => {
    const id = req.params.id
    if (!id) {
      throw new AppError_1.default(400, 'Module id is required')
    }
    const isexists = await module_model_1.Module.findById(id)
    if (!isexists) {
      throw new AppError_1.default(404, 'Module not found')
    }
    const lecture = await lecture_model_1.Lecture.find({ module: id })
    ;(0, SendResponse_1.default)(res, {
      success: true,
      statusCode: 200,
      message: 'Lectures fetched successfully',
      data: lecture,
    })
  },
)
const updateLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError_1.default(400, 'Lecture id is required')
  }
  const lecture = await lecture_model_1.Lecture.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture updated successfully',
    data: lecture,
  })
})
const deleteLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError_1.default(400, 'Lecture id is required')
  }
  const lecture = await lecture_model_1.Lecture.findByIdAndDelete(id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture deleted successfully',
    data: lecture,
  })
})
exports.default = {
  createLecture,
  getLecture,
  getAllLectures,
  getLecturesByModule,
  updateLecture,
  deleteLecture,
}
