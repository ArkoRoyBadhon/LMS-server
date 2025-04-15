import { startSession, Types } from 'mongoose'
import AppError from '../error/AppError'
import { Course } from '../models/course.model'
import { Module } from '../models/module.model'
import { Lecture } from '../models/lecture.model'
import { IModule } from '../types/Controller.type'

const createModuleService = async (moduleData: {
  title: string
  course: string
  isPublished: boolean
}) => {
  const { title, course, isPublished } = moduleData

  const session = await startSession()
  try {
    return await session.withTransaction(async () => {
      const courseExists = await Course.findById(course).session(session)
      if (!courseExists) {
        throw new AppError(404, 'Course not found')
      }

      const [module] = await Module.create(
        [
          {
            title,
            course,
            isPublished,
          },
        ],
        { session },
      )

      await Course.findByIdAndUpdate(
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

const getModuleService = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Module id is required')
  }
  const module = await Module.findById(id)
  if (!module) {
    throw new AppError(404, 'Module not found')
  }
  return module
}

const getAllModulesService = async () => {
  return await Module.find()
}

const getModuleByCourseService = async (courseId: string) => {
  if (!courseId) {
    throw new AppError(400, 'Course id is required')
  }
  return await Module.find({ course: courseId })
}

const updateModuleService = async (
  id: string,
  updateData: Partial<IModule>,
) => {
  if (!id) {
    throw new AppError(400, 'Module id is required')
  }
  const module = await Module.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
  if (!module) {
    throw new AppError(404, 'Module not found')
  }
  return module
}

const deleteModuleService = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Module ID is required')
  }

  const session = await startSession()
  try {
    return await session.withTransaction(async () => {
      const module = await Module.findById(id)
        .populate<{ lectures: Types.ObjectId[] }>({
          path: 'lectures',
          select: '_id',
        })
        .session(session)

      if (!module) {
        throw new AppError(404, 'Module not found')
      }

      const lectureIds = module.lectures.map(lecture => lecture._id)
      if (lectureIds.length > 0) {
        await Lecture.deleteMany({ _id: { $in: lectureIds } }).session(session)
      }

      await Module.findByIdAndDelete(id).session(session)
    })
  } finally {
    session.endSession()
  }
}

export default {
  createModuleService,
  getModuleService,
  getAllModulesService,
  getModuleByCourseService,
  updateModuleService,
  deleteModuleService,
}
