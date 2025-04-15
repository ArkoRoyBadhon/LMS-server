'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const envConfig_1 = __importDefault(require('../config/envConfig'))
const AppError_1 = __importDefault(require('../error/AppError'))
const HandleCatchAsync_1 = __importDefault(require('../utils/HandleCatchAsync'))
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'))
const quicker_1 = __importDefault(require('../utils/quicker'))
const user_model_1 = require('../models/user.model')
const isAuthenticated = (0, HandleCatchAsync_1.default)(
  async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    if (accessToken) {
      try {
        const decoded = jsonwebtoken_1.default.verify(
          accessToken,
          envConfig_1.default.ACCESS_TOKEN.SECRET,
        )
        req.user = {
          _id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        }
        return next()
      } catch {
        throw new AppError_1.default(401, 'Unauthorized - Invalid access token')
      }
    }
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      throw new AppError_1.default(
        401,
        'Unauthorized - No valid tokens provided',
      )
    }
    try {
      const decrypted = jsonwebtoken_1.default.verify(
        refreshToken,
        envConfig_1.default.REFRESH_TOKEN.SECRET,
      )
      const user = await user_model_1.User.findById(decrypted.id)
      if (!user) {
        throw new AppError_1.default(404, 'User not found')
      }
      const newAccessToken = quicker_1.default.generateAccessToken({
        _id: user.id,
        email: user.email,
        role: user.role,
      })
      const cookieOptions = {
        sameSite: 'strict',
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      }
      res.cookie('accessToken', newAccessToken, cookieOptions)
      req.user = {
        _id: user.id,
        email: user.email,
        role: user.role,
      }
      return next()
    } catch {
      throw new AppError_1.default(401, 'Unauthorized - Invalid refresh token')
    }
  },
)
const roleChecker = requiredRoles => {
  return (0, HandleCatchAsync_1.default)(async (req, res, next) => {
    if (!req.user) {
      throw new AppError_1.default(401, 'Unauthorized - User not authenticated')
    }
    if (!requiredRoles.includes(req.user.role)) {
      throw new AppError_1.default(403, 'Forbidden - Insufficient permissions')
    }
    next()
  })
}
exports.default = { isAuthenticated, roleChecker }
