import { Request, Response, NextFunction } from 'express'

const handleCatchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

export default handleCatchAsync
