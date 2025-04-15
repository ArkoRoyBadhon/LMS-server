import handleCatchAsync from '../utils/HandleCatchAsync'
import SendResponse from '../utils/SendResponse'
import authService from '../services/auth.service'

const register = handleCatchAsync(async (req, res) => {
  const body = req.body

  const { newUser, accessToken, refreshToken } =
    await authService.registerUser(body)

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

  SendResponse(res, {
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

const login = handleCatchAsync(async (req, res) => {
  const { email, password } = req.body

  const { userData, accessToken, refreshToken } = await authService.loginUser(
    email,
    password,
  )

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

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login successfully',
    data: userData,
  })
})

const logout = handleCatchAsync(async (req, res) => {
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

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logout successfully',
    data: null,
  })
})

const getUser = handleCatchAsync(async (req, res) => {
  if (!req.user) {
    throw new Error('User not found')
  }
  const user = await authService.fetchUser(req.user._id)

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User fetched successfully',
    data: user,
  })
})

export default {
  register,
  login,
  logout,
  getUser,
}
