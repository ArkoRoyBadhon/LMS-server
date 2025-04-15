'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const enrollment_controller_1 = __importDefault(
  require('../controllers/enrollment.controller'),
)
const authMiddleware_1 = __importDefault(
  require('../middlewares/authMiddleware'),
)
const zodvalidator_1 = require('../middlewares/zodvalidator')
const enrollment_zod_1 = require('../zodvalidation/enrollment.zod')
const router = (0, express_1.Router)()
router.post(
  '/create',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['USER']),
  (0, zodvalidator_1.validSchema)(enrollment_zod_1.enrollmentValidationSchema),
  enrollment_controller_1.default.createEnrollment,
)
router.get('/all', enrollment_controller_1.default.getAllEnrollments)
router.get('/single/:id', enrollment_controller_1.default.getEnrollmentById)
router.get(
  '/all-by-user/:id',
  authMiddleware_1.default.isAuthenticated,
  enrollment_controller_1.default.getEnrollmentByUserId,
)
router.get(
  '/single-for-user/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['USER']),
  enrollment_controller_1.default.getEnrollmentByIdForUser,
)
router.post(
  '/next-video/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['USER']),
  enrollment_controller_1.default.nextLecture,
)
router.get(
  '/all-by-user-personal',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['USER']),
  enrollment_controller_1.default.getEnrollmentByUser,
)
router.patch(
  '/update/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  enrollment_controller_1.default.updateEnrollment,
)
exports.default = router
