'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const module_controller_1 = __importDefault(
  require('../controllers/module.controller'),
)
const authMiddleware_1 = __importDefault(
  require('../middlewares/authMiddleware'),
)
const zodvalidator_1 = require('../middlewares/zodvalidator')
const module_zod_1 = require('../zodvalidation/module.zod')
const router = (0, express_1.Router)()
router.post(
  '/create',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  (0, zodvalidator_1.validSchema)(module_zod_1.moduleValidationSchema),
  module_controller_1.default.createModule,
)
router.get('/all', module_controller_1.default.getAllModules)
router.get('/single/:id', module_controller_1.default.getModule)
router.get('/all-by-course/:id', module_controller_1.default.getModuleByCourse)
router.patch(
  '/update/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  module_controller_1.default.updateModule,
)
router.delete(
  '/delete/:id',
  authMiddleware_1.default.isAuthenticated,
  authMiddleware_1.default.roleChecker(['ADMIN']),
  module_controller_1.default.deleteModule,
)
exports.default = router
