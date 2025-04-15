'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const mongoose_1 = require('mongoose')
const enrollment_model_1 = require('../models/enrollment.model')
const AppError_1 = __importDefault(require('../error/AppError'))
const createEnrollmentService = async (userId, courseId, status) => {
  const isEnrolled = await enrollment_model_1.Enrollment.findOne({
    user: userId,
    course: courseId,
  })
  if (isEnrolled) {
    throw new AppError_1.default(409, 'You are already enrolled in this course')
  }
  const enrollment = await enrollment_model_1.Enrollment.create({
    user: userId,
    course: courseId,
    status,
  })
  return enrollment
}
const getAllEnrollmentsService = async () => {
  const enrollments = await enrollment_model_1.Enrollment.find()
  return enrollments
}
const getEnrollmentByIdService = async id => {
  const enrollment = await enrollment_model_1.Enrollment.findById(id).populate({
    path: 'course',
    select: 'title description isPublished',
    populate: {
      path: 'modules',
      select: 'title video_url pdf_urls isFreePreview isPublished',
      options: { sort: { module_number: 1 } },
      populate: {
        path: 'lectures',
        select: 'title video_url pdf_urls isFreePreview isPublished',
        options: { sort: { module_number: 1 } },
      },
    },
  })
  return enrollment
}
const getEnrollmentByIdForUserService = async (id, userId, search) => {
  const ee = await enrollment_model_1.Enrollment.findById(id).populate({
    path: 'course',
    select: 'title description isPublished',
    populate: {
      path: 'modules',
      match: { isPublished: true },
      select: 'title video_url pdf_urls isFreePreview isPublished',
      options: { sort: { module_number: 1 } },
      populate: {
        path: 'lectures',
        match: {
          isPublished: true,
        },
        select: 'title video_url pdf_urls isFreePreview isPublished',
        options: { sort: { module_number: 1 } },
      },
    },
  })
  if (ee && ee.accessibleVideos.length === 0) {
    await enrollment_model_1.Enrollment.findByIdAndUpdate(
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
  const enrollment = await enrollment_model_1.Enrollment.findById(id).populate({
    path: 'course',
    select: 'title description isPublished',
    populate: {
      path: 'modules',
      match: { isPublished: true },
      select: 'title video_url pdf_urls isFreePreview isPublished',
      options: { sort: { module_number: 1 } },
      populate: {
        path: 'lectures',
        match: {
          isPublished: true,
          ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
        },
        select: 'title video_url pdf_urls isFreePreview isPublished',
        options: { sort: { module_number: 1 } },
      },
    },
  })
  if (!enrollment || enrollment.user.toString() !== userId) {
    throw new AppError_1.default(404, 'Enrollment not found')
  }
  return enrollment
}
const nextLectureService = async id => {
  const enrollment = await enrollment_model_1.Enrollment.findById(id).populate({
    path: 'course',
    select: 'title description isPublished',
    populate: {
      path: 'modules',
      match: { isPublished: true },
      select: 'title video_url pdf_urls isFreePreview isPublished',
      options: { sort: { module_number: 1 } },
      populate: {
        path: 'lectures',
        match: { isPublished: true },
        select: 'title video_url pdf_urls isFreePreview isPublished',
        options: { sort: { module_number: 1 } },
      },
    },
  })
  if (!enrollment) {
    throw new AppError_1.default(404, 'Enrollment not found')
  }
  if (enrollment.isCompleted) {
    return null
  }
  const allPublishedLectures = []
  if (
    enrollment.course &&
    !(enrollment.course instanceof mongoose_1.Types.ObjectId)
  ) {
    enrollment.course.modules.forEach(module => {
      module.lectures.forEach(lecture => {
        allPublishedLectures.push(lecture)
      })
    })
  }
  const currentIndex = enrollment.nextVideoToUnlock
    ? allPublishedLectures.findIndex(l =>
        l._id.equals(enrollment?.nextVideoToUnlock),
      )
    : -1
  if (currentIndex >= 0 && currentIndex < allPublishedLectures.length - 1) {
    await enrollment_model_1.Enrollment.findByIdAndUpdate(
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
    await enrollment_model_1.Enrollment.findByIdAndUpdate(
      id,
      {
        $push: { accessibleVideos: allPublishedLectures[currentIndex]._id },
        nextVideoToUnlock: null,
        isCompleted: true,
      },
      { new: true },
    )
  } else if (currentIndex === -1 && allPublishedLectures.length > 0) {
    await enrollment_model_1.Enrollment.findByIdAndUpdate(
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
  return null
}
const getEnrollmentByUserService = async userId => {
  const user = await enrollment_model_1.Enrollment.find({ user: userId })
  if (!user || user.length === 0) {
    throw new AppError_1.default(404, 'Enrollment not found')
  }
  const enrollment = await enrollment_model_1.Enrollment.find({
    user: userId,
    status: 'active',
  }).populate({
    path: 'course',
    select: 'title description thumbnail price isPublished',
  })
  return enrollment
}
const updateEnrollmentService = async (id, status) => {
  const enrollment = await enrollment_model_1.Enrollment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  )
  return enrollment
}
exports.default = {
  createEnrollmentService,
  getAllEnrollmentsService,
  getEnrollmentByIdService,
  getEnrollmentByIdForUserService,
  nextLectureService,
  getEnrollmentByUserService,
  updateEnrollmentService,
}
