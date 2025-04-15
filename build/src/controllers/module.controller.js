'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const HandleCatchAsync_1 = __importDefault(require('../utils/HandleCatchAsync'))
const SendResponse_1 = __importDefault(require('../utils/SendResponse'))
const module_service_1 = __importDefault(require('../services/module.service'))
const createModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const module = await module_service_1.default.createModuleService(req.body)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 201,
    message: 'Module created successfully',
    data: module,
  })
})
const getModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const module = await module_service_1.default.getModuleService(req.params.id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Module fetched successfully',
    data: module,
  })
})
const getAllModules = (0, HandleCatchAsync_1.default)(async (_req, res) => {
  const modules = await module_service_1.default.getAllModulesService()
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Modules fetched successfully',
    data: modules,
  })
})
const getModuleByCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const modules = await module_service_1.default.getModuleByCourseService(
    req.params.id,
  )
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Modules fetched successfully',
    data: modules,
  })
})
const updateModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const module = await module_service_1.default.updateModuleService(
    req.params.id,
    req.body,
  )
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Module updated successfully',
    data: module,
  })
})
const deleteModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
  await module_service_1.default.deleteModuleService(req.params.id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Module deleted successfully',
    data: null,
  })
})
exports.default = {
  createModule,
  getModule,
  getAllModules,
  getModuleByCourse,
  updateModule,
  deleteModule,
}
