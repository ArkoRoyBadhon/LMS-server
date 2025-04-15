import { Types } from 'mongoose'
import { Enrollment } from '../models/enrollment.model'
import { ICourse, ILecture } from '../types/Controller.type'
import AppError from '../error/AppError'

const createEnrollmentService = async (
  userId: string,
  courseId: string,
  status: string,
) => {
  const isEnrolled = await Enrollment.findOne({
    user: userId,
    course: courseId,
  })

  if (isEnrolled) {
    throw new AppError(409, 'You are already enrolled in this course')
  }

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    status,
  })

  return enrollment
}

const getAllEnrollmentsService = async () => {
  const enrollments = await Enrollment.find()
  return enrollments
}

const getEnrollmentByIdService = async (id: string) => {
  const enrollment = await Enrollment.findById(id).populate({
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

const getEnrollmentByIdForUserService = async (
  id: string,
  userId: string,
  search: string | undefined,
) => {
  const ee = await Enrollment.findById(id).populate<{ course: ICourse }>({
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
    throw new AppError(404, 'Enrollment not found')
  }

  return enrollment
}

const nextLectureService = async (id: string) => {
  const enrollment = await Enrollment.findById(id).populate<{
    course: ICourse
  }>({
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
    throw new AppError(404, 'Enrollment not found')
  }

  if (enrollment.isCompleted) {
    return null
  }

  const allPublishedLectures: ILecture[] = []
  if (enrollment.course && !(enrollment.course instanceof Types.ObjectId)) {
    enrollment.course.modules.forEach(module => {
      module.lectures.forEach(lecture => {
        allPublishedLectures.push(lecture)
      })
    })
  }

  const currentIndex = enrollment.nextVideoToUnlock
    ? allPublishedLectures.findIndex(l =>
        l._id.equals(
          enrollment?.nextVideoToUnlock as unknown as Types.ObjectId,
        ),
      )
    : -1

  if (currentIndex >= 0 && currentIndex < allPublishedLectures.length - 1) {
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

  return null
}

const getEnrollmentByUserService = async (userId: string) => {
  const user = await Enrollment.find({ user: userId })
  if (!user || user.length === 0) {
    throw new AppError(404, 'Enrollment not found')
  }

  const enrollment = await Enrollment.find({
    user: userId,
    status: 'active',
  }).populate({
    path: 'course',
    select: 'title description thumbnail price isPublished',
  })

  return enrollment
}

const updateEnrollmentService = async (id: string, status: string) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  )

  return enrollment
}

export default {
  createEnrollmentService,
  getAllEnrollmentsService,
  getEnrollmentByIdService,
  getEnrollmentByIdForUserService,
  nextLectureService,
  getEnrollmentByUserService,
  updateEnrollmentService,
}
