import { startSession } from 'mongoose'
import AppError from '../error/AppError'
import { Course } from '../models/course.model'
import { Module } from '../models/module.model'
import { Lecture } from '../models/lecture.model'
import { CourseDocument, ModuleDocument } from '../types/TypePopulate'
import { ICourse } from '../types/Controller.type'

const createCourseService = async ({
  title,
  description,
  thumbnail,
  price,
}: ICourse) => {
  return await Course.create({ title, description, thumbnail, price })
}

const getCourseService = async (id: string) => {
  if (!id) throw new AppError(400, 'Course id is required')
  return await Course.findById(id)
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
}

const getAllCoursesService = async () => {
  return await Course.find()
}

const updateCourseService = async (
  id: string,
  updateData: Partial<ICourse>,
) => {
  if (!id) throw new AppError(400, 'Course id is required')
  return await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
}

const deleteCourseService = async (id: string) => {
  if (!id) throw new AppError(400, 'Course id is required')

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

      if (!courseData) throw new AppError(404, 'Course not found')

      for (const module of courseData.modules) {
        if (module.lectures?.length > 0) {
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
  } finally {
    session.endSession()
  }
}

export default {
  createCourseService,
  getCourseService,
  getAllCoursesService,
  updateCourseService,
  deleteCourseService,
}
