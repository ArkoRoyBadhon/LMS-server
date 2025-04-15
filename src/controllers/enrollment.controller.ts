import AppError from '../error/AppError'
import { JwtUser } from '../helpers/extender'
import SendResponse from '../utils/SendResponse'
import handleCatchAsync from '../utils/HandleCatchAsync'
import enrollmentService from '../services/enrollment.service'

const createEnrollment = handleCatchAsync(async (req, res) => {
  const { course, status } = req.body
  if (!req.user) {
    throw new AppError(400, 'User Not Found')
  }
  const { _id } = req.user

  const enrollment = await enrollmentService.createEnrollmentService(
    _id,
    course,
    status,
  )

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Enrollment created successfully',
    data: enrollment,
  })
})

const getAllEnrollments = handleCatchAsync(async (req, res) => {
  const enrollments = await enrollmentService.getAllEnrollmentsService()

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollments fetched successfully',
    data: enrollments,
  })
})

const getEnrollmentById = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Enrollment id is required')
  }

  const enrollment = await enrollmentService.getEnrollmentByIdService(id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment fetched successfully',
    data: enrollment,
  })
})

const getEnrollmentByIdForUser = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  const { _id } = req.user as JwtUser
  const { search } = req.query

  if (!id) {
    throw new AppError(400, 'Enrollment id is required')
  }

  const enrollment = await enrollmentService.getEnrollmentByIdForUserService(
    id,
    _id,
    search as string,
  )

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment fetched successfully',
    data: enrollment,
  })
})

const nextLecture = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Enrollment id is required')
  }

  await enrollmentService.nextLectureService(id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Next Video unlocked successfully',
    data: null,
  })
})

const getEnrollmentByUser = handleCatchAsync(async (req, res) => {
  const { _id } = req.user as JwtUser
  const enrollment = await enrollmentService.getEnrollmentByUserService(_id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment fetched successfully',
    data: enrollment,
  })
})

const updateEnrollment = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'Enrollment id is required')
  }

  const enrollment = await enrollmentService.updateEnrollmentService(
    id,
    req.body.status,
  )

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment updated successfully',
    data: enrollment,
  })
})

export default {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  getEnrollmentByIdForUser,
  nextLecture,
  getEnrollmentByUser,
  updateEnrollment,
}
