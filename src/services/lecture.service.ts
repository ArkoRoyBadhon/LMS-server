import { startSession } from 'mongoose'
import AppError from '../error/AppError'
import { Lecture } from '../models/lecture.model'
import { Module } from '../models/module.model'
import { ILecture } from '../types/Controller.type'

const createLectureService = async (lectureData: ILecture) => {
  const {
    title,
    module: moduleId,
    video_url,
    pdf_urls,
    isFreePreview,
    isPublished,
  } = lectureData

  const session = await startSession()
  try {
    return await session.withTransaction(async () => {
      const moduleExists = await Module.findById(moduleId).session(session)
      if (!moduleExists) {
        throw new AppError(404, 'Module not found')
      }

      const [lecture] = await Lecture.create(
        [
          {
            title,
            module: moduleId,
            video_url,
            pdf_urls,
            isFreePreview,
            isPublished,
          },
        ],
        { session },
      )

      await Module.findByIdAndUpdate(
        moduleId,
        { $push: { lectures: lecture._id } },
        { session },
      )

      return lecture
    })
  } catch {
    throw new AppError(500, 'An error occurred while creating the lecture')
  } finally {
    session.endSession()
  }
}

const getLectureService = async (id: string) => {
  const lecture = await Lecture.findById(id)
  if (!lecture) {
    throw new AppError(404, 'Lecture not found')
  }
  return lecture
}

const getAllLecturesService = async () => {
  return await Lecture.find()
}

const getLecturesByModuleService = async (moduleId: string) => {
  const moduleExists = await Module.findById(moduleId)
  if (!moduleExists) {
    throw new AppError(404, 'Module not found')
  }
  return await Lecture.find({ module: moduleId })
}

const updateLectureService = async (
  id: string,
  updateData: Partial<ILecture>,
) => {
  const lecture = await Lecture.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
  if (!lecture) {
    throw new AppError(404, 'Lecture not found')
  }
  return lecture
}

const deleteLectureService = async (id: string) => {
  const lecture = await Lecture.findByIdAndDelete(id)
  if (!lecture) {
    throw new AppError(404, 'Lecture not found')
  }
  return lecture
}

export default {
  createLectureService,
  getLectureService,
  getAllLecturesService,
  getLecturesByModuleService,
  updateLectureService,
  deleteLectureService,
}
