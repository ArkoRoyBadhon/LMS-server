'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const SendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    error: data.error,
  })
}
exports.default = SendResponse
