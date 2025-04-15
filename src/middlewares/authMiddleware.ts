import envConfig from '../config/envConfig'
import AppError from '../error/AppError'
import handleCatchAsync from '../utils/HandleCatchAsync'
import jwt, { JwtPayload } from 'jsonwebtoken'
import quicker from '../utils/quicker'
import { User } from '../models/user.model'

type UserRole = 'ADMIN' | 'USER'

const isAuthenticated = handleCatchAsync(async (req, res, next) => {
  const accessToken = req.cookies.accessToken

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        envConfig.ACCESS_TOKEN.SECRET!,
      ) as JwtPayload

      req.user = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }
      return next()
    } catch {
      throw new AppError(401, 'Unauthorized - Invalid access token')
    }
  }

  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    throw new AppError(401, 'Unauthorized - No valid tokens provided')
  }

  try {
    const decrypted = jwt.verify(
      refreshToken,
      envConfig.REFRESH_TOKEN.SECRET!,
    ) as { id: string }

    const user = await User.findById(decrypted.id)

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    const newAccessToken = quicker.generateAccessToken({
      _id: user.id,
      email: user.email,
      role: user.role,
    })

    const cookieOptions = {
      sameSite: 'strict' as const,
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }

    res.cookie('accessToken', newAccessToken, cookieOptions)
    req.user = {
      _id: user.id as string,
      email: user.email!,
      role: user.role!,
    }

    return next()
  } catch {
    throw new AppError(401, 'Unauthorized - Invalid refresh token')
  }
})

const roleChecker = (requiredRoles: UserRole[]) => {
  return handleCatchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized - User not authenticated')
    }

    if (!requiredRoles.includes(req.user.role)) {
      throw new AppError(403, 'Forbidden - Insufficient permissions')
    }

    next()
  })
}

export default { isAuthenticated, roleChecker }
