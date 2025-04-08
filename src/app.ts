import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import globalErrorHanlder from './middlewares/globalErrorHandler'
import router from './routes/index'
import httpError from './error/httpError'
import SendResponse from './utils/SendResponse'
export const app: Application = express()

// middlewares
app.use(cookieParser())
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:3000']

      if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

app.use(express.static(path.join(__dirname, '../', 'public')))
app.use('/api/v1', router)
app.get('/', (_: Request, res: Response) => {
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'welcome',
    data: null,
  })
})

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  try {
    SendResponse(res, {
      success: false,
      statusCode: 404,
      message: 'Not Found',
      data: null,
    })
  } catch (error) {
    httpError(next, error, req, 404)
  }
})

// global error handler
app.use(globalErrorHanlder)

export default app
