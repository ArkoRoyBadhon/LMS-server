'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const AppError_1 = __importDefault(require('../error/AppError'))
const SendResponse_1 = __importDefault(require('../utils/SendResponse'))
const HandleCatchAsync_1 = __importDefault(require('../utils/HandleCatchAsync'))
const enrollment_service_1 = __importDefault(
  require('../services/enrollment.service'),
)
const createEnrollment = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const { course, status } = req.body
  if (!req.user) {
    throw new AppError_1.default(400, 'User Not Found')
  }
  const { _id } = req.user
  const enrollment = await enrollment_service_1.default.createEnrollmentService(
    _id,
    course,
    status,
  )
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 201,
    message: 'Enrollment created successfully',
    data: enrollment,
  })
})
const getAllEnrollments = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const enrollments =
    await enrollment_service_1.default.getAllEnrollmentsService()
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollments fetched successfully',
    data: enrollments,
  })
})
const getEnrollmentById = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError_1.default(400, 'Enrollment id is required')
  }
  const enrollment =
    await enrollment_service_1.default.getEnrollmentByIdService(id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment fetched successfully',
    data: enrollment,
  })
})
const getEnrollmentByIdForUser = (0, HandleCatchAsync_1.default)(
  async (req, res) => {
    const id = req.params.id
    const { _id } = req.user
    const { search } = req.query
    if (!id) {
      throw new AppError_1.default(400, 'Enrollment id is required')
    }
    const enrollment =
      await enrollment_service_1.default.getEnrollmentByIdForUserService(
        id,
        _id,
        search,
      )
    ;(0, SendResponse_1.default)(res, {
      success: true,
      statusCode: 200,
      message: 'Enrollment fetched successfully',
      data: enrollment,
    })
  },
)
const nextLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError_1.default(400, 'Enrollment id is required')
  }
  await enrollment_service_1.default.nextLectureService(id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Next Video unlocked successfully',
    data: null,
  })
})
const getEnrollmentByUser = (0, HandleCatchAsync_1.default)(
  async (req, res) => {
    const { _id } = req.user
    const enrollment =
      await enrollment_service_1.default.getEnrollmentByUserService(_id)
    ;(0, SendResponse_1.default)(res, {
      success: true,
      statusCode: 200,
      message: 'Enrollment fetched successfully',
      data: enrollment,
    })
  },
)
const updateEnrollment = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError_1.default(400, 'Enrollment id is required')
  }
  const enrollment = await enrollment_service_1.default.updateEnrollmentService(
    id,
    req.body.status,
  )
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment updated successfully',
    data: enrollment,
  })
})
exports.default = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  getEnrollmentByIdForUser,
  nextLecture,
  getEnrollmentByUser,
  updateEnrollment,
}
