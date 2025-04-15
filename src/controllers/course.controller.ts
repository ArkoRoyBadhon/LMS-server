import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'
import courseService from '../services/course.service'

const createCourse = handleCatchAsync(async (req, res) => {
  const course = await courseService.createCourseService(req.body)
  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Course created successfully',
    data: course,
  })
})

const getCourse = handleCatchAsync(async (req, res) => {
  const course = await courseService.getCourseService(req.params.id)
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Course fetched successfully',
    data: course,
  })
})

const getAllCourses = handleCatchAsync(async (req, res) => {
  const courses = await courseService.getAllCoursesService()
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Courses fetched successfully',
    data: courses,
  })
})

const updateCourse = handleCatchAsync(async (req, res) => {
  const course = await courseService.updateCourseService(
    req.params.id,
    req.body,
  )
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Course updated successfully',
    data: course,
  })
})

const deleteCourse = handleCatchAsync(async (req, res) => {
  await courseService.deleteCourseService(req.params.id)
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Course deleted successfully',
    data: null,
  })
})

export default {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
}
