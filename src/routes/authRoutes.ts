import { Router } from 'express'
import authController from '../controllers/auth.controller'
import checker from '../middlewares/authMiddleware'
const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', checker.isAuthenticated, authController.logout)

export default router
