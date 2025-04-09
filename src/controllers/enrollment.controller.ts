import AppError from '../error/AppError'
import { JwtUser } from '../helpers/extender'
import { Enrollment } from '../models/enrollment.model'
import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'

const createEnrollment = handleCatchAsync(async (req, res) => {
  const { course, status } = req.body
  const { _id } = req.user as JwtUser

  const enrollment = await Enrollment.create({
    user: _id,
    course,
    status,
  })

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Enrollment created successfully',
    data: enrollment,
  })
})

const getAllEnrollments = handleCatchAsync(async (req, res) => {
  const enrollments = await Enrollment.find()
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
  const enrollment = await Enrollment.findById(id)
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment fetched successfully',
    data: enrollment,
  })
})

const getEnrollmentByUser = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  if (!id) {
    throw new AppError(400, 'User id is required')
  }

  const user = await Enrollment.find({ user: id })
  if (!user || user.length === 0) {
    throw new AppError(404, 'Enrollment not found')
  }

  const enrollment = await Enrollment.find({ user: id })
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
  const enrollment = await Enrollment.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
      runValidators: true,
    },
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
  getEnrollmentByUser,
  updateEnrollment,
}
