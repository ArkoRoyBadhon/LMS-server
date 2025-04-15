'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const mongoose_1 = require('mongoose')
const AppError_1 = __importDefault(require('../error/AppError'))
const course_model_1 = require('../models/course.model')
const module_model_1 = require('../models/module.model')
const lecture_model_1 = require('../models/lecture.model')
const createModuleService = async moduleData => {
  const { title, course, isPublished } = moduleData
  const session = await (0, mongoose_1.startSession)()
  try {
    return await session.withTransaction(async () => {
      const courseExists =
        await course_model_1.Course.findById(course).session(session)
      if (!courseExists) {
        throw new AppError_1.default(404, 'Course not found')
      }
      const [module] = await module_model_1.Module.create(
        [
          {
            title,
            course,
            isPublished,
          },
        ],
        { session },
      )
      await course_model_1.Course.findByIdAndUpdate(
        course,
        { $push: { modules: module._id } },
        { session },
      )
      return module
    })
  } finally {
    session.endSession()
  }
}
const getModuleService = async id => {
  if (!id) {
    throw new AppError_1.default(400, 'Module id is required')
  }
  const module = await module_model_1.Module.findById(id)
  if (!module) {
    throw new AppError_1.default(404, 'Module not found')
  }
  return module
}
const getAllModulesService = async () => {
  return await module_model_1.Module.find()
}
const getModuleByCourseService = async courseId => {
  if (!courseId) {
    throw new AppError_1.default(400, 'Course id is required')
  }
  return await module_model_1.Module.find({ course: courseId })
}
const updateModuleService = async (id, updateData) => {
  if (!id) {
    throw new AppError_1.default(400, 'Module id is required')
  }
  const module = await module_model_1.Module.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
  if (!module) {
    throw new AppError_1.default(404, 'Module not found')
  }
  return module
}
const deleteModuleService = async id => {
  if (!id) {
    throw new AppError_1.default(400, 'Module ID is required')
  }
  const session = await (0, mongoose_1.startSession)()
  try {
    return await session.withTransaction(async () => {
      const module = await module_model_1.Module.findById(id)
        .populate({
          path: 'lectures',
          select: '_id',
        })
        .session(session)
      if (!module) {
        throw new AppError_1.default(404, 'Module not found')
      }
      const lectureIds = module.lectures.map(lecture => lecture._id)
      if (lectureIds.length > 0) {
        await lecture_model_1.Lecture.deleteMany({
          _id: { $in: lectureIds },
        }).session(session)
      }
      await module_model_1.Module.findByIdAndDelete(id).session(session)
    })
  } finally {
    session.endSession()
  }
}
exports.default = {
  createModuleService,
  getModuleService,
  getAllModulesService,
  getModuleByCourseService,
  updateModuleService,
  deleteModuleService,
}
