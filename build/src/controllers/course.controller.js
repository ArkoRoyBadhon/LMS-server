'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const HandleCatchAsync_1 = __importDefault(require('../utils/HandleCatchAsync'))
const SendResponse_1 = __importDefault(require('../utils/SendResponse'))
const course_service_1 = __importDefault(require('../services/course.service'))
const createCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const course = await course_service_1.default.createCourseService(req.body)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 201,
    message: 'Course created successfully',
    data: course,
  })
})
const getCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const course = await course_service_1.default.getCourseService(req.params.id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Course fetched successfully',
    data: course,
  })
})
const getAllCourses = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const courses = await course_service_1.default.getAllCoursesService()
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Courses fetched successfully',
    data: courses,
  })
})
const updateCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const course = await course_service_1.default.updateCourseService(
    req.params.id,
    req.body,
  )
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Course updated successfully',
    data: course,
  })
})
const deleteCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
  await course_service_1.default.deleteCourseService(req.params.id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Course deleted successfully',
    data: null,
  })
})
exports.default = {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
}
