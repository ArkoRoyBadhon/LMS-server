import { Router } from 'express'
import authRoutes from './authRoutes'
import courseRoutes from './courseRoutes'

const router = Router()
const modulePath = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/course',
    route: courseRoutes,
  },
]

modulePath.forEach(({ path, route }) => router.use(path, route))
export default router
