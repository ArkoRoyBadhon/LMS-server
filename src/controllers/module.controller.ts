import { startSession } from 'mongoose'
import AppError from '../error/AppError'
import { Course } from '../models/course.model'
import { Module } from '../models/module.model'
import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'

const createModule = handleCatchAsync(async (req, res) => {
  const { title, course, position, isPublished } = req.body

  const session = await startSession()
  session.startTransaction()

  try {
    await session.withTransaction(async () => {
      const courseExists = await Course.findById(course).session(session)
      if (!courseExists) {
        throw new AppError(404, 'Course not found')
      }

      const module = await Module.create(
        [
          {
            title,
            course,
            position,
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
    })
  } catch {
    throw new AppError(500, 'An error occurred')
  } finally {
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
    throw new AppError(400, 'Module id is required')
  }
  const module = await Module.findByIdAndDelete(id)
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Module deleted successfully',
    data: module,
  })
})

export default {
  createModule,
  getModule,
  getAllModules,
  getModuleByCourse,
  updateModule,
  deleteModule,
}
