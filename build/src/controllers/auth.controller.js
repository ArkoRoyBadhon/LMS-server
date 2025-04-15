'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const HandleCatchAsync_1 = __importDefault(require('../utils/HandleCatchAsync'))
const SendResponse_1 = __importDefault(require('../utils/SendResponse'))
const auth_service_1 = __importDefault(require('../services/auth.service'))
const register = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const body = req.body
  const { newUser, accessToken, refreshToken } =
    await auth_service_1.default.registerUser(body)
  res.cookie('accessToken', accessToken, {
    sameSite: 'none',
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: true,
  })
  res.cookie('refreshToken', refreshToken, {
    sameSite: 'none',
    maxAge: 1000 * 24 * 60 * 60 * 30,
    httpOnly: true,
    secure: true,
  })
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 201,
    message: 'User created successfully',
    data: {
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
      },
    },
  })
})
const login = (0, HandleCatchAsync_1.default)(async (req, res) => {
  const { email, password } = req.body
  const { userData, accessToken, refreshToken } =
    await auth_service_1.default.loginUser(email, password)
  res.cookie('accessToken', accessToken, {
    sameSite: 'none',
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: true,
  })
  res.cookie('refreshToken', refreshToken, {
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  })
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Login successfully',
    data: userData,
  })
})
const logout = (0, HandleCatchAsync_1.default)(async (req, res) => {
  res.clearCookie('accessToken', {
    path: '/',
    sameSite: 'none',
    secure: true,
  })
  res.clearCookie('refreshToken', {
    path: '/',
    sameSite: 'none',
    secure: true,
  })
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'Logout successfully',
    data: null,
  })
})
const getUser = (0, HandleCatchAsync_1.default)(async (req, res) => {
  if (!req.user) {
    throw new Error('User not found')
  }
  const user = await auth_service_1.default.fetchUser(req.user._id)
  ;(0, SendResponse_1.default)(res, {
    success: true,
    statusCode: 200,
    message: 'User fetched successfully',
    data: user,
  })
})
exports.default = {
  register,
  login,
  logout,
  getUser,
}
