import { Types } from 'mongoose'
import AppError from '../error/AppError'
import { JwtUser } from '../helpers/extender'
import { Enrollment } from '../models/enrollment.model'
import { ICourse, ILecture } from '../types/Controller.type'
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
  const enrollment = await Enrollment.findById(id).populate({
    path: 'course',
    select: 'title description position isPublished',
    populate: {
      path: 'modules',
      select: 'title video_url pdf_urls position isFreePreview isPublished',
      options: { sort: { position: 1 } },
      populate: {
        path: 'lectures',
        select: 'title video_url pdf_urls position isFreePreview isPublished',
        options: { sort: { position: 1 } },
      },
    },
  })

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

  const ee = await Enrollment.findById(id).populate<{ course: ICourse }>({
    path: 'course',
    select: 'title description position isPublished',
    populate: {
      path: 'modules',
      match: { isPublished: true },
      select: 'title video_url pdf_urls position isFreePreview isPublished',
      options: { sort: { position: 1 } },
      populate: {
        path: 'lectures',
        match: {
          isPublished: true,
        },
        select: 'title video_url pdf_urls position isFreePreview isPublished',
        options: { sort: { position: 1 } },
      },
    },
  })

  if (ee && ee.accessibleVideos.length === 0) {
    await Enrollment.findByIdAndUpdate(
      id,
      {
        $push: {
          accessibleVideos:
            ee.course?.modules[0]?.lectures[ee.accessibleVideos.length]?._id,
        },
        nextVideoToUnlock:
          ee.course?.modules[0]?.lectures[ee.accessibleVideos.length + 1]?._id,
      },
      { new: true },
    )
  }

  const enrollment = await Enrollment.findById(id).populate({
    path: 'course',
    select: 'title description position isPublished',
    populate: {
      path: 'modules',
      select: 'title video_url pdf_urls position isFreePreview isPublished',
      options: { sort: { position: 1 } },
      populate: {
        path: 'lectures',
        match: {
          isPublished: true,
          ...(search
            ? { title: { $regex: search as string, $options: 'i' } }
            : {}),
        },
        select: 'title video_url pdf_urls position isFreePreview isPublished',
        options: { sort: { position: 1 } },
      },
    },
  })

  if (!enrollment || enrollment.user.toString() !== _id) {
    throw new AppError(404, 'Enrollment not found')
  }

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

  const enrollment = await Enrollment.findById(id).populate<{
    course: ICourse
  }>({
    path: 'course',
    select: 'title description position isPublished',
    populate: {
      path: 'modules',
      match: { isPublished: true },
      select: 'title video_url pdf_urls position isFreePreview isPublished',
      options: { sort: { position: 1 } },
      populate: {
        path: 'lectures',
        match: { isPublished: true },
        select: 'title video_url pdf_urls position isFreePreview isPublished',
        options: { sort: { position: 1 } },
      },
    },
  })

  if (!enrollment) {
    throw new AppError(404, 'Enrollment not found')
  }

  if (enrollment.isCompleted) {
    return SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'You have completed the course',
      data: null,
    })
  }

  // Get all published lectures in proper order
  const allPublishedLectures: ILecture[] = []
  if (enrollment.course && !(enrollment.course instanceof Types.ObjectId)) {
    enrollment.course.modules.forEach(module => {
      module.lectures.forEach(lecture => {
        allPublishedLectures.push(lecture)
      })
    })
  }

  // Find current position
  const currentIndex = enrollment.nextVideoToUnlock
    ? allPublishedLectures.findIndex(l =>
        l._id.equals(
          enrollment?.nextVideoToUnlock as unknown as Types.ObjectId,
        ),
      )
    : -1

  // Determine next lecture to unlock
  if (currentIndex >= 0 && currentIndex < allPublishedLectures.length - 1) {
    // Unlock next lecture
    await Enrollment.findByIdAndUpdate(
      id,
      {
        $push: { accessibleVideos: allPublishedLectures[currentIndex]._id },
        nextVideoToUnlock: allPublishedLectures[currentIndex + 1]._id,
      },
      { new: true },
    )
  } else if (
    currentIndex >= 0 &&
    currentIndex === allPublishedLectures.length - 1
  ) {
    // Final lecture - mark course as completed
    await Enrollment.findByIdAndUpdate(
      id,
      {
        $push: { accessibleVideos: allPublishedLectures[currentIndex]._id },
        nextVideoToUnlock: null,
        isCompleted: true,
      },
      { new: true },
    )
  } else if (currentIndex === -1 && allPublishedLectures.length > 0) {
    // First lecture
    await Enrollment.findByIdAndUpdate(
      id,
      {
        $push: { accessibleVideos: allPublishedLectures[0]._id },
        nextVideoToUnlock:
          allPublishedLectures.length > 1 ? allPublishedLectures[1]._id : null,
        ...(allPublishedLectures.length === 1 ? { isCompleted: true } : {}),
      },
      { new: true },
    )
  }

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Next Video unlocked successfully',
    data: null,
  })
})

const getEnrollmentByUser = handleCatchAsync(async (req, res) => {
  const { _id } = req.user as JwtUser
  if (!_id) {
    throw new AppError(400, 'User id is required')
  }

  const user = await Enrollment.find({ user: _id })
  if (!user || user.length === 0) {
    throw new AppError(404, 'Enrollment not found')
  }

  const enrollment = await Enrollment.find({ user: _id, status: 'active' })
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Enrollment fetched successfully',
    data: enrollment,
  })
})

const getEnrollmentByUserId = handleCatchAsync(async (req, res) => {
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
  getEnrollmentByIdForUser,
  nextLecture,
  getEnrollmentByUser,
  getEnrollmentByUserId,
  updateEnrollment,
}
