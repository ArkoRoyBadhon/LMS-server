import AppError from '../error/AppError'
import { Course } from '../models/course.model'
import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'

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
  const course = await Course.findByIdAndDelete(id)
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Course deleted successfully',
    data: course,
  })
})

export default {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
}
