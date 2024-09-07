import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'

const NotFoundMiddleware = (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json('Route does not exist')
}

export default NotFoundMiddleware
