import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'
import moduleService from '../services/module.service'

const createModule = handleCatchAsync(async (req, res) => {
  const module = await moduleService.createModuleService(req.body)

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Module created successfully',
    data: module,
  })
})

const getModule = handleCatchAsync(async (req, res) => {
  const module = await moduleService.getModuleService(req.params.id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Module fetched successfully',
    data: module,
  })
})

const getAllModules = handleCatchAsync(async (_req, res) => {
  const modules = await moduleService.getAllModulesService()

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Modules fetched successfully',
    data: modules,
  })
})

const getModuleByCourse = handleCatchAsync(async (req, res) => {
  const modules = await moduleService.getModuleByCourseService(req.params.id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Modules fetched successfully',
    data: modules,
  })
})

const updateModule = handleCatchAsync(async (req, res) => {
  const module = await moduleService.updateModuleService(
    req.params.id,
    req.body,
  )

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Module updated successfully',
    data: module,
  })
})

const deleteModule = handleCatchAsync(async (req, res) => {
  await moduleService.deleteModuleService(req.params.id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Module deleted successfully',
    data: null,
  })
})

export default {
  createModule,
  getModule,
  getAllModules,
  getModuleByCourse,
  updateModule,
  deleteModule,
}
