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
