import { app } from './app'
import envConfig from './config/envConfig'
import mongoose from 'mongoose'

const appServer = app.listen(envConfig.PORT)

;(async () => {
  try {
    // await mongoose.connect(envConfig.DATABASE_URL as string)
    await mongoose.connect(envConfig.DATABASE_URL as string)
    console.log('Database connected successfully')
    console.log('database connnected on port: ', envConfig.PORT)
  } catch (err) {
    console.log('database connnection failed', err)
    appServer.close(error => {
      if (error) {
        console.log('error', error)
      }
      process.exit(1)
    })
  }
})()
