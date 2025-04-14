export type THttpResponse = {
  success: boolean
  statusCode: number
  request: {
    ip?: string | null
    method: string
    url: string
  }
  message: string
  data: unknown
}

export type THttpError = {
  success: boolean
  statusCode: number
  request: {
    ip?: string | null
    method: string
    url: string
  }
  message: string
  data: unknown
  errorMessages?: {
    path: string
    message: string
  }[]
  trace?: object | null
}
