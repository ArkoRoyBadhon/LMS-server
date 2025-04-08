import { Response } from 'express'

interface IResponse {
  success: boolean
  statusCode: number
  data: null | object
  message: string
  error?: unknown
}

const SendResponse = (res: Response, data: IResponse) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    error: data.error,
  })
}

export default SendResponse
