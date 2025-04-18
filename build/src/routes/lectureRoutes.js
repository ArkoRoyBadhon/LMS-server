'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const lecture_controller_1 = __importDefault(
  require('../controllers/lecture.controller'),
)
const authMiddleware_1 = __importDefault(
  require('../middlewares/authMiddleware'),
)
const router = (0, express_1.Router)()
const multer_1 = __importDefault(require('multer'))
const zodvalidator_1 = require('../middlewares/zodvalidator')
const lecture_zod_1 = require('../zodvalidation/lecture.zod')
const upload = (0, multer_1.default)({ dest: 'uploads/' })
router.post(
  '/create',
  upload.array('pdfs', 10),
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  (0, zodvalidator_1.validSchema)(lecture_zod_1.lectureValidationSchema),
  lecture_controller_1.default.createLecture,
)
router.get('/all', lecture_controller_1.default.getAllLectures)
router.get('/single/:id', lecture_controller_1.default.getLecture)
router.get(
  '/all-by-module/:id',
  lecture_controller_1.default.getLecturesByModule,
)
router.patch(
  '/update/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  lecture_controller_1.default.updateLecture,
)
router.delete(
  '/delete/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  lecture_controller_1.default.deleteLecture,
)
exports.default = router
