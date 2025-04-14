import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import os from 'os'
import envConfig from '../config/envConfig'
export default {
  getSystemHealth: () => {
    return {
      cpuUsage: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
    }
  },
  getApplicationHealth: () => {
    return {
      environment: envConfig.ENV,
      uptime: `${process.uptime().toFixed(2)} Second`,
      memoryUsage: {
        heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      },
    }
  },
  hashPassword: async (password: string) => {
    const salt = await bcrypt.hash(password, 10)
    return salt
  },
  generateAccessToken: (payload: object) => {
    const { SECRET = '' } = envConfig.ACCESS_TOKEN
    const token = jwt.sign(payload, SECRET, { expiresIn: '1d' })
    return token
  },
  generateRefreshToken: (id: string) => {
    try {
      const { SECRET = '' } = envConfig.REFRESH_TOKEN
      const token = jwt.sign({ id: id }, SECRET, { expiresIn: '7d' })
      return token
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error('An unknown error occurred.')
    }
  },

  verifyAccessToken: (token: string) => {
    try {
      const { SECRET = '' } = envConfig.ACCESS_TOKEN
      const payload = jwt.verify(token, SECRET)
      return payload
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error('An unknown error occurred.')
    }
  },

  getDomainFromUrl: (url: string) => {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  },

  generateEmailVerificationToken: (userId: string) => {
    const { SECRET = '' } = envConfig.EMAIL_VERIFICATION_TOKEN
    const token = jwt.sign({ id: userId }, SECRET, {
      expiresIn: '10m',
    })
    return token
  },
}
