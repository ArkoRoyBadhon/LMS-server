import { Router } from 'express'
import enrollmentController from '../controllers/enrollment.controller'
import checker from '../middlewares/authMiddleware'

const router = Router()

router.post(
  '/create',
  checker.isAuthenticated,
  checker.roleChecker(['USER']),
  enrollmentController.createEnrollment,
)
router.get('/all', enrollmentController.getAllEnrollments)
router.get('/single/:id', enrollmentController.getEnrollmentById)
router.get(
  '/all-by-user/:id',
  checker.isAuthenticated,
  enrollmentController.getEnrollmentByUser,
)
router.patch(
  '/update/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  enrollmentController.updateEnrollment,
)

export default router
