'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'))
const isTokenExpired = token => {
  if (!token) {
    return true
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken = jsonwebtoken_1.default.decode(token)
  const currentTime = Date.now() / 1000
  return decodedToken.exp < currentTime
}
exports.default = isTokenExpired
