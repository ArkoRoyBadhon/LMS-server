import AppError from '../error/AppError'
import bcrypt from 'bcrypt'
import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'
import quicker from '../utils/quicker'
import envConfig from '../config/envConfig'
import { User } from '../models/user.model'

const register = handleCatchAsync(async (req, res) => {
  const body = req.body

  const user = await User.findOne({ email: body.email })

  if (user) {
    throw new AppError(409, 'User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(body.password, salt)

  const newUser = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: hash,
    role: body.role,
  })

  const accessToken = quicker.generateAccessToken({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  })
  const refreshToken = quicker.generateRefreshToken(newUser?._id!.toString())

  res.cookie('accessToken', accessToken, {
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: true,
  })

  res.cookie('refreshToken', refreshToken, {
    sameSite: 'strict',
    maxAge: 1000 * 24 * 60 * 60 * 30,
    httpOnly: true,
    secure: true,
  })

  SendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User created successfully',
    data: {
      user: {
        id: newUser?._id,
        first_name: newUser?.first_name,
        last_name: newUser?.last_name,
        email: newUser?.email,
        role: newUser?.role,
      },
    },
  })
})

const login = handleCatchAsync(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError(400, 'Email & Password is required')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError(404, 'User not found')
  }

  const isMatch = bcrypt.compareSync(password, user.password!)

  if (!isMatch) {
    throw new AppError(403, 'Unauthorized. Password is incorrect')
  }

  const accessToken = quicker.generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  })
  const refreshToken = quicker.generateRefreshToken(user?._id!.toString())

  res.cookie('accessToken', accessToken, {
    sameSite: 'strict',
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: true,
  })

  res.cookie('refreshToken', refreshToken, {
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  })

  const userObject = user.toObject()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: newPass, ...rest } = userObject

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login successfully',
    data: rest,
  })
})

const logout = handleCatchAsync(async (req, res) => {
  res.clearCookie('accessToken', {
    path: '/',
    sameSite: 'strict',
    secure: envConfig.NODE_ENV === 'production' ? true : false,
  })
  res.clearCookie('refreshToken', {
    path: '/',
    sameSite: 'strict',
    secure: envConfig.NODE_ENV === 'production' ? true : false,
  })

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logout successfully',
    data: null,
  })
})

const getUser = handleCatchAsync(async (req, res) => {
  const user = req.user

  if (!user) {
    throw new AppError(404, 'User not found')
  }

  const userdata = await User.findById(user._id)
  if (!userdata) {
    throw new AppError(404, 'User not found')
  }

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User fetched successfully',
    data: userdata,
  })
})

export default {
  register,
  login,
  logout,
  getUser,
}
