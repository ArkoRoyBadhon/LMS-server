import { Router } from 'express'
import moduleController from '../controllers/module.controller'
import checker from '../middlewares/authMiddleware'
import { validSchema } from '../middlewares/zodvalidator'
import { moduleValidationSchema } from '../zodvalidation/module.zod'
const router = Router()

router.post(
  '/create',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  validSchema(moduleValidationSchema),
  moduleController.createModule,
)
router.get('/all', moduleController.getAllModules)
router.get('/single/:id', moduleController.getModule)
router.get('/all-by-course/:id', moduleController.getModuleByCourse)
router.patch(
  '/update/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  moduleController.updateModule,
)
router.delete(
  '/delete/:id',
  checker.isAuthenticated,
  checker.roleChecker(['ADMIN']),
  moduleController.deleteModule,
)

export default router
