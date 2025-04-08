import { Router } from 'express'
import authRoutes from './authRoutes'

const router = Router()
const modulePath = [
  {
    path: '/auth',
    route: authRoutes,
  },
]

modulePath.forEach(({ path, route }) => router.use(path, route))
export default router
