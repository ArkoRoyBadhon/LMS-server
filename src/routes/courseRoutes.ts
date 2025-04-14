import { Router } from 'express'
import courseController from '../controllers/course.controller'
import checker from '../middlewares/authMiddleware'
import { validSchema } from '../middlewares/zodvalidator'
import { courseValidationSchema } from '../zodvalidation/course.zod'
const router = Router()

router.post(
  '/create',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  validSchema(courseValidationSchema),
  courseController.createCourse,
)
router.get('/all', courseController.getAllCourses)
router.get('/single/:id', courseController.getCourse)
router.patch(
  '/update/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  courseController.updateCourse,
)
router.delete(
  '/delete/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  courseController.deleteCourse,
)

export default router
