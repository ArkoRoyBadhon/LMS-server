import { Request } from 'express'

export interface JwtUser {
  _id: string
  email: string
  role: 'ADMIN' | 'USER'
}

export interface userRequest extends Request {
  user?: JwtUser
  cookies: { [key: string]: string }
}
