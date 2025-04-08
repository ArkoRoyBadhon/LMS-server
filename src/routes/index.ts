import { Router } from 'express'
import authRoutes from './authRoutes'
import courseRoutes from './courseRoutes'
import moduleRoutes from './moduleRoutes'
import lectureRoutes from './lectureRoutes'

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
  {
    path: '/module',
    route: moduleRoutes,
  },
  {
    path: '/lecture',
    route: lectureRoutes,
  },
]

modulePath.forEach(({ path, route }) => router.use(path, route))
export default router
