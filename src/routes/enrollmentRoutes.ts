import { Router } from 'express'
import enrollmentController from '../controllers/enrollment.controller'
import checker from '../middlewares/authMiddleware'
import { validSchema } from '../middlewares/zodvalidator'
import { enrollmentValidationSchema } from '../zodvalidation/enrollment.zod'

const router = Router()

router.post(
  '/create',
  checker.isAuthenticated,
  checker.roleChecker(['USER']),
  validSchema(enrollmentValidationSchema),
  enrollmentController.createEnrollment,
)
router.get('/all', enrollmentController.getAllEnrollments)
router.get('/single/:id', enrollmentController.getEnrollmentById)

router.get(
  '/all-by-user/:id',
  checker.isAuthenticated,
  enrollmentController.getEnrollmentByUserId,
)

router.get(
  '/single-for-user/:id',
  checker.isAuthenticated,
  checker.roleChecker(['USER']),
  enrollmentController.getEnrollmentByIdForUser,
)

router.post(
  '/next-video/:id',
  checker.isAuthenticated,
  checker.roleChecker(['USER']),
  enrollmentController.nextLecture,
)

router.get(
  '/all-by-user-personal',
  checker.isAuthenticated,
  checker.roleChecker(['USER']),
  enrollmentController.getEnrollmentByUser,
)
router.patch(
  '/update/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  enrollmentController.updateEnrollment,
)

export default router
