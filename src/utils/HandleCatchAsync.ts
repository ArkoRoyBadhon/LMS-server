import { Response, NextFunction } from 'express'
import { userRequest } from '../helpers/extender'

const handleCatchAsync = (
  fn: (req: userRequest, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: userRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

export default handleCatchAsync
