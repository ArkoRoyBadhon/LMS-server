import { Router } from 'express'
import lectureController from '../controllers/lecture.controller'
import checker from '../middlewares/authMiddleware'
const router = Router()

router.post(
  '/create',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  lectureController.createLecture,
)
router.get('/all', lectureController.getAllLectures)
router.get('/single/:id', lectureController.getLecture)
router.get('/all-by-module/:id', lectureController.getLecturesByModule)
router.patch(
  '/update/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  lectureController.updateLecture,
)
router.delete(
  '/delete/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  lectureController.deleteLecture,
)

export default router
