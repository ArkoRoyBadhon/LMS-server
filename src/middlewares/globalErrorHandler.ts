import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { THttpError } from '../types/types'
import AppError from '../error/AppError'
import handleZodError from '../error/zodError'

const globalErrorHandler = (
  error: THttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let message = error.message || 'Something went wrong!'
  let statusCode = 500
  let errorMessages = [{ path: '', message }]

  if (error instanceof AppError) {
    statusCode = error?.statusCode || 400
    message = error.message
    errorMessages = [{ path: '', message }]
  } else if (error instanceof ZodError) {
    const simpleErr = handleZodError(error)
    statusCode = simpleErr?.statusCode
    message = simpleErr?.message
    errorMessages = simpleErr?.errorSources
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
  })
}

export default globalErrorHandler
