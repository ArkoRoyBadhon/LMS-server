'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const authRoutes_1 = __importDefault(require('./authRoutes'))
const courseRoutes_1 = __importDefault(require('./courseRoutes'))
const moduleRoutes_1 = __importDefault(require('./moduleRoutes'))
const lectureRoutes_1 = __importDefault(require('./lectureRoutes'))
const enrollmentRoutes_1 = __importDefault(require('./enrollmentRoutes'))
const fileupload_route_1 = __importDefault(require('./fileupload.route'))
const router = (0, express_1.Router)()
const modulePath = [
  {
    path: '/auth',
    route: authRoutes_1.default,
  },
  {
    path: '/course',
    route: courseRoutes_1.default,
  },
  {
    path: '/module',
    route: moduleRoutes_1.default,
  },
  {
    path: '/lecture',
    route: lectureRoutes_1.default,
  },
  {
    path: '/enrollment',
    route: enrollmentRoutes_1.default,
  },
  {
    path: '/file',
    route: fileupload_route_1.default,
  },
]
modulePath.forEach(({ path, route }) => router.use(path, route))
exports.default = router
