import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'
import lectureService from '../services/lecture.service'

const createLecture = handleCatchAsync(async (req, res) => {
  const lectureData = req.body
  const lecture = await lectureService.createLectureService(lectureData)

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Lecture created successfully',
    data: lecture,
  })
})

const getLecture = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  const lecture = await lectureService.getLectureService(id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture fetched successfully',
    data: lecture,
  })
})

const getAllLectures = handleCatchAsync(async (_req, res) => {
  const lectures = await lectureService.getAllLecturesService()

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lectures fetched successfully',
    data: lectures,
  })
})

const getLecturesByModule = handleCatchAsync(async (req, res) => {
  const moduleId = req.params.id
  const lectures = await lectureService.getLecturesByModuleService(moduleId)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lectures fetched successfully',
    data: lectures,
  })
})

const updateLecture = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  const updateData = req.body
  const lecture = await lectureService.updateLectureService(id, updateData)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture updated successfully',
    data: lecture,
  })
})

const deleteLecture = handleCatchAsync(async (req, res) => {
  const id = req.params.id
  const lecture = await lectureService.deleteLectureService(id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Lecture deleted successfully',
    data: lecture,
  })
})

export default {
  createLecture,
  getLecture,
  getAllLectures,
  getLecturesByModule,
  updateLecture,
  deleteLecture,
}
