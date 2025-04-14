import { startSession, Types } from 'mongoose'
import AppError from '../error/AppError'
import { Course } from '../models/course.model'
import { Module } from '../models/module.model'
import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'
import { Lecture } from '../models/lecture.model'

const createModule = handleCatchAsync(async (req, res) => {
  const { title, course, isPublished } = req.body

  console.log('course', req.body)

  const session = await startSession()
  session.startTransaction()

  try {
    const courseExists = await Course.findById(course).session(session)
    if (!courseExists) {
      throw new AppError(404, 'Course not found')
    }

    const module = await Module.create(
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
      { $push: { modules: module[0]._id } },
      { session },
    )

    await session.commitTransaction()
    session.endSession()

    SendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Module created successfully',
      data: module[0],
    })
  } catch (error) {
    console.error(error)
    await session.abortTransaction()
    session.endSession()
    throw new AppError(500, 'An error occurred while creating the module')
  } finally {
    if (session.inTransaction()) {
      await session.abortTransaction()
    }
    session.endSession()
  }
})

const getModule = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Module id is required')
  }
  const module = await Module.findById(id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Module fetched successfully',
    data: module,
  })
})

const getAllModules = handleCatchAsync(async (req, res) => {
  const module = await Module.find()
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Modules fetched successfully',
    data: module,
  })
})

const getModuleByCourse = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Course id is required')
  }
  const module = await Module.find({ course: id })
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Modules fetched successfully',
    data: module,
  })
})

const updateModule = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Module id is required')
  }
  const module = await Module.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Module updated successfully',
    data: module,
  })
})

const deleteModule = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Module ID is required')
  }

  const session = await startSession()
  try {
    await session.withTransaction(async () => {
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

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Module deleted successfully',
      data: null,
    })
  } catch {
    throw new AppError(500, 'An error occurred while deleting the module')
  } finally {
    session.endSession()
  }
})

export default {
  createModule,
  getModule,
  getAllModules,
  getModuleByCourse,
  updateModule,
  deleteModule,
}
