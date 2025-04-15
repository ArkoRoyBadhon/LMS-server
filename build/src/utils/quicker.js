'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const bcrypt_1 = __importDefault(require('bcrypt'))
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'))
const os_1 = __importDefault(require('os'))
const envConfig_1 = __importDefault(require('../config/envConfig'))
exports.default = {
  getSystemHealth: () => {
    return {
      cpuUsage: os_1.default.loadavg(),
      totalMemory: `${(os_1.default.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os_1.default.freemem() / 1024 / 1024).toFixed(2)} MB`,
    }
  },
  getApplicationHealth: () => {
    return {
      environment: envConfig_1.default.ENV,
      uptime: `${process.uptime().toFixed(2)} Second`,
      memoryUsage: {
        heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      },
    }
  },
  hashPassword: async password => {
    const salt = await bcrypt_1.default.hash(password, 10)
    return salt
  },
  generateAccessToken: payload => {
    const { SECRET = '' } = envConfig_1.default.ACCESS_TOKEN
    const token = jsonwebtoken_1.default.sign(payload, SECRET, {
      expiresIn: '1d',
    })
    return token
  },
  generateRefreshToken: id => {
    try {
      const { SECRET = '' } = envConfig_1.default.REFRESH_TOKEN
      const token = jsonwebtoken_1.default.sign({ id: id }, SECRET, {
        expiresIn: '7d',
      })
      return token
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error('An unknown error occurred.')
    }
  },
  verifyAccessToken: token => {
    try {
      const { SECRET = '' } = envConfig_1.default.ACCESS_TOKEN
      const payload = jsonwebtoken_1.default.verify(token, SECRET)
      return payload
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error('An unknown error occurred.')
    }
  },
  getDomainFromUrl: url => {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  },
  generateEmailVerificationToken: userId => {
    const { SECRET = '' } = envConfig_1.default.EMAIL_VERIFICATION_TOKEN
    const token = jsonwebtoken_1.default.sign({ id: userId }, SECRET, {
      expiresIn: '10m',
    })
    return token
  },
}
