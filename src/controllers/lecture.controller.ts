import { startSession } from 'mongoose'
import AppError from '../error/AppError'
import { Lecture } from '../models/lecture.model'
import { Module } from '../models/module.model'
import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'

const createLecture = handleCatchAsync(async (req, res) => {
  const {
    title,
    module: moduleId,
    video_url,
    pdf_urls,
    position,
    isFreePreview,
    isPublished,
  } = req.body

  const session = await startSession()

  try {
    await session.withTransaction(async () => {
      const moduleExists = await Module.findById(moduleId).session(session)
      if (!moduleExists) {
        throw new AppError(404, 'Module not found')
      }

      const [lecture] = await Lecture.create(
        [
          {
            title,
            module: moduleId,
            video_url,
            pdf_urls,
            position,
            isFreePreview,
            isPublished,
          },
        ],
        { session },
      )

      await Module.findByIdAndUpdate(
        moduleId,
        { $push: { lectures: lecture._id } },
        { session },
      )

      SendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Lecture created successfully',
        data: lecture,
      })
    })
  } catch {
    throw new AppError(500, 'An error occurred while creating the lecture')
  } finally {
    session.endSession()
  }
})

const getLecture = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Lecture id is required')
  }
  const lecture = await Lecture.findById(id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture fetched successfully',
    data: lecture,
  })
})

const getAllLectures = handleCatchAsync(async (req, res) => {
  const lecture = await Lecture.find()
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lectures fetched successfully',
    data: lecture,
  })
})

const getLecturesByModule = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Module id is required')
  }
  const isexists = await Module.findById(id)
  if (!isexists) {
    throw new AppError(404, 'Module not found')
  }
  const lecture = await Lecture.find({ module: id })
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lectures fetched successfully',
    data: lecture,
  })
})

const updateLecture = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Lecture id is required')
  }
  const lecture = await Lecture.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture updated successfully',
    data: lecture,
  })
})

const deleteLecture = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Lecture id is required')
  }
  const lecture = await Lecture.findByIdAndDelete(id)
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture deleted successfully',
    data: lecture,
  })
})

export default {
  createLecture,
  getLecture,
  getAllLectures,
  getLecturesByModule,
  updateLecture,
  deleteLecture,
}
