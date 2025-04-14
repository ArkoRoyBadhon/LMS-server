import { Router } from 'express'
import authController from '../controllers/auth.controller'
import checker from '../middlewares/authMiddleware'
const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.logout)
router.get('/get-user', checker.isAuthenticated, authController.getUser)
export default router
