import { startSession } from 'mongoose'
import AppError from '../error/AppError'
import { Course } from '../models/course.model'
import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'
import { Module } from '../models/module.model'
import { Lecture } from '../models/lecture.model'
import { CourseDocument, ModuleDocument } from '../types/TypePopulate'

const createCourse = handleCatchAsync(async (req, res) => {
  const { title, description, thumbnail, price } = req.body

  const course = await Course.create({
    title,
    description,
    thumbnail,
    price,
  })

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Course created successfully',
    data: course,
  })
})

const getCourse = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Course id is required')
  }
  const course = await Course.findById(id)
    .select('title description thumbnail price')
    .lean()
    .populate({
      path: 'modules',
      select: 'title description position isPublished',
      populate: {
        path: 'lectures',
        select: 'title video_url pdf_urls position isFreePreview isPublished',
        options: { sort: { position: 1 } },
      },
    })

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Course fetched successfully',
    data: course,
  })
})

const getAllCourses = handleCatchAsync(async (req, res) => {
  const courses = await Course.find()
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Courses fetched successfully',
    data: courses,
  })
})

const updateCourse = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Course id is required')
  }
  const course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Course updated successfully',
    data: course,
  })
})

const deleteCourse = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Course id is required')
  }

  const session = await startSession()
  try {
    await session.withTransaction(async () => {
      const courseData = (await Course.findById(id)
        .populate<{
          modules: ModuleDocument[]
        }>({
          path: 'modules',
          select: '_id',
          populate: {
            path: 'lectures',
            select: '_id',
          },
        })
        .session(session)) as CourseDocument | null

      if (!courseData) {
        throw new AppError(404, 'Course not found')
      }

      for (const module of courseData.modules) {
        if (module.lectures && module.lectures.length > 0) {
          const lectureIds = module.lectures.map(lecture => lecture._id)
          await Lecture.deleteMany({ _id: { $in: lectureIds } }).session(
            session,
          )
        }
      }

      const moduleIds = courseData.modules.map(module => module._id)
      if (moduleIds.length > 0) {
        await Module.deleteMany({ _id: { $in: moduleIds } }).session(session)
      }

      await Course.findByIdAndDelete(id).session(session)
    })

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Course deleted successfully',
      data: null,
    })
  } catch {
    throw new AppError(500, 'An error occurred while deleting the course')
  } finally {
    session.endSession()
  }
})
export default {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
}
