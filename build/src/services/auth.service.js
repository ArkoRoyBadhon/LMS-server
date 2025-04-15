'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const bcrypt_1 = __importDefault(require('bcrypt'))
const AppError_1 = __importDefault(require('../error/AppError'))
const quicker_1 = __importDefault(require('../utils/quicker'))
const user_model_1 = require('../models/user.model')
const registerUser = async body => {
  const existingUser = await user_model_1.User.findOne({ email: body.email })
  if (existingUser) {
    throw new AppError_1.default(409, 'User already exists')
  }
  const salt = await bcrypt_1.default.genSalt(10)
  const hash = await bcrypt_1.default.hash(body.password, salt)
  const newUser = await user_model_1.User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: hash,
    role: body.role,
  })
  const accessToken = quicker_1.default.generateAccessToken({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  })
  const refreshToken = quicker_1.default.generateRefreshToken(
    newUser?._id.toString(),
  )
  return { newUser, accessToken, refreshToken }
}
const loginUser = async (email, password) => {
  const user = await user_model_1.User.findOne({ email })
  if (!user) {
    throw new AppError_1.default(404, 'User not found')
  }
  const isMatch = await bcrypt_1.default.compare(password, user.password)
  if (!isMatch) {
    throw new AppError_1.default(403, 'Unauthorized. Password is incorrect')
  }
  const accessToken = quicker_1.default.generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  })
  const refreshToken = quicker_1.default.generateRefreshToken(
    user?._id.toString(),
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userData } = user.toObject()
  return { userData, accessToken, refreshToken }
}
const fetchUser = async userId => {
  const user = await user_model_1.User.findById(userId)
  if (!user) {
    throw new AppError_1.default(404, 'User not found')
  }
  return user
}
exports.default = {
  registerUser,
  loginUser,
  fetchUser,
}
