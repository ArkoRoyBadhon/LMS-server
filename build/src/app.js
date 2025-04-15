'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.app = void 0
const cookie_parser_1 = __importDefault(require('cookie-parser'))
const cors_1 = __importDefault(require('cors'))
const express_1 = __importDefault(require('express'))
const path_1 = __importDefault(require('path'))
const globalErrorHandler_1 = __importDefault(
  require('./middlewares/globalErrorHandler'),
)
const index_1 = __importDefault(require('./routes/index'))
const httpError_1 = __importDefault(require('./error/httpError'))
const SendResponse_1 = __importDefault(require('./utils/SendResponse'))
exports.app = (0, express_1.default)()
// middlewares
exports.app.use((0, cookie_parser_1.default)())
exports.app.use(
  (0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://lmsarko.vercel.app',
      ]
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)
exports.app.use(express_1.default.json({ limit: '100mb' }))
exports.app.use(
  express_1.default.urlencoded({ limit: '100mb', extended: true }),
)
exports.app.use(
  express_1.default.static(path_1.default.join(__dirname, '../', 'public')),
)
exports.app.use('/api/v1', index_1.default)
exports.app.get('/', (_, res) => {
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'welcome',
    data: null,
  })
})
// 404 handler
exports.app.all('*', (req, res, next) => {
  try {
    ;(0, SendResponse_1.default)(res, {
      success: false,
      statusCode: 404,
      message: 'Not Found',
      data: null,
    })
  } catch (error) {
    ;(0, httpError_1.default)(next, error, req, 404)
  }
})
// global error handler
exports.app.use(globalErrorHandler_1.default)
exports.default = exports.app
