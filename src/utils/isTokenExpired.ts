import jwt from 'jsonwebtoken'
const isTokenExpired = (token: string) => {
  if (!token) {
    return true
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken: any = jwt.decode(token)
  const currentTime = Date.now() / 1000
  return decodedToken.exp < currentTime
}

export default isTokenExpired
