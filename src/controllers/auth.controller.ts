// import AppError from '../error/AppError'
// import bcrypt from 'bcrypt'
// import handleCatchAsync from '../utils/HandleCatchAsync'
// import SendResponse from '../utils/SendResponse'
// import quicker from '../utils/quicker'
// import { IUser } from '../types/ModelType'
// import envConfig from '../config/envConfig'


// const login = handleCatchAsync(async (req, res) => {
//   const body = req.body

//   const user: IUser | null = await prisma.user.findUnique({
//     where: {
//       email: body.email,
//     },
//   })

//   if (!user) {
//     throw new AppError(404, 'User not found')
//   }

//   const isMatch = bcrypt.compareSync(body.password, user.password!)

//   if (!isMatch) {
//     throw new AppError(403, 'Unauthorized. Password is incorrect')
//   }

//   const accessToken = quicker.generateAccessToken({
//     id: user.id,
//     email: user.email,
//     role: user.role,
//   })
//   const refreshToken = quicker.generateRefreshToken(user?.id!.toString())

//   res.cookie('accessToken', accessToken, {
//     sameSite: 'strict',
//     maxAge: 1000 * 24 * 60 * 60 * 30,
//     httpOnly: true,
//     secure: true,
//   })
//   res.cookie('refreshToken', refreshToken, {
//     sameSite: 'strict',
//     maxAge: 1000 * 24 * 60 * 60 * 30,
//     httpOnly: true,
//     secure: true,
//   })

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password, ...rest } = user

//   SendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Login successfully',
//     data: rest,
//   })
// })

// const logout = handleCatchAsync(async (req, res) => {
//   res.clearCookie('accessToken', {
//     path: '/',
//     sameSite: 'strict',
//     secure: envConfig.NODE_ENV === 'production' ? true : false,
//   })
//   res.clearCookie('refreshToken', {
//     path: '/',
//     sameSite: 'strict',
//     secure: envConfig.NODE_ENV === 'production' ? true : false,
//   })

//   SendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Logout successfully',
//     data: null,
//   })
// })

// const refreshToken = handleCatchAsync(async (req, res) => {
//   const { cookies } = req

//   const { refreshToken } = cookies as {
//     refreshToken: string | undefined
//     accessToken: string | undefined
//   }

//   if (!refreshToken) {
//     throw new AppError(40, 'No refresh token provided')
//   }

//   const accessToken = quicker.generateAccessToken({
//     id: '',
//     email: '',
//     role: '',
//   })

//   res.cookie('accessToken', accessToken, {
//     path: '/api/v1',
//     sameSite: 'strict',
//     maxAge: 1000 * 3600,
//     httpOnly: true,
//     // secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
//   })

//   SendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Token refreshed',
//     data: { accessToken },
//   })
// })

export default {

}
