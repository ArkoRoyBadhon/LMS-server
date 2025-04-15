import bcrypt from 'bcrypt'
import AppError from '../error/AppError'
import quicker from '../utils/quicker'
import { User } from '../models/user.model'

const registerUser = async (body: {
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
}) => {
  const existingUser = await User.findOne({ email: body.email })
  if (existingUser) {
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

  return { newUser, accessToken, refreshToken }
}

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(404, 'User not found')
  }

  const isMatch = await bcrypt.compare(password, user.password!)
  if (!isMatch) {
    throw new AppError(403, 'Unauthorized. Password is incorrect')
  }

  const accessToken = quicker.generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  })
  const refreshToken = quicker.generateRefreshToken(user?._id!.toString())

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userData } = user.toObject()

  return { userData, accessToken, refreshToken }
}

const fetchUser = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  return user
}

export default {
  registerUser,
  loginUser,
  fetchUser,
}
