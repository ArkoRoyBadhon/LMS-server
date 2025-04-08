/* eslint-disable @typescript-eslint/no-namespace */
import envConfig from '../config/envConfig'
import AppError from '../error/AppError'
import handleCatchAsync from '../utils/HandleCatchAsync'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'
import quicker from '../utils/quicker'

type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'

interface JwtPayload {
  id: string
  email: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

const isAuthenticated = handleCatchAsync(async (req, res, next) => {
  // 1. Check access token first
  const accessToken = req.cookies.accessToken

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        envConfig.ACCESS_TOKEN.SECRET!,
      ) as JwtPayload
      req.user = decoded
      return next()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Access token is invalid/expired - proceed to refresh logic
    }
  }

  // 2. Refresh token logic
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    throw new AppError(401, 'Unauthorized - No valid tokens provided')
  }

  try {
    const decrypted = jwt.verify(
      refreshToken,
      envConfig.REFRESH_TOKEN.SECRET!,
    ) as { id: string }

    const user = await prisma.user.findUnique({
      where: { id: decrypted.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    // Generate new tokens
    const newAccessToken = quicker.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // Set cookies
    const cookieOptions = {
      sameSite: 'strict' as const,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge:
        process.env.NODE_ENV === 'development'
          ? 1000 * 60 * 60 // 1 hour for dev
          : 1000 * 60 * 15, // 15 minutes for production
    }

    res.cookie('accessToken', newAccessToken, cookieOptions)
    req.user = user

    return next()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
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
