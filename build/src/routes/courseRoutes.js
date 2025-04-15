'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const course_controller_1 = __importDefault(
  require('../controllers/course.controller'),
)
const authMiddleware_1 = __importDefault(
  require('../middlewares/authMiddleware'),
)
const zodvalidator_1 = require('../middlewares/zodvalidator')
const course_zod_1 = require('../zodvalidation/course.zod')
const router = (0, express_1.Router)()
router.post(
  '/create',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  (0, zodvalidator_1.validSchema)(course_zod_1.courseValidationSchema),
  course_controller_1.default.createCourse,
)
router.get('/all', course_controller_1.default.getAllCourses)
router.get('/single/:id', course_controller_1.default.getCourse)
router.patch(
  '/update/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  course_controller_1.default.updateCourse,
)
router.delete(
  '/delete/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  course_controller_1.default.deleteCourse,
)
exports.default = router
