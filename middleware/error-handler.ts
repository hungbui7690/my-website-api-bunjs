import { StatusCodes } from 'http-status-codes'
import { type Request, type Response } from 'express'

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: any
) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
    stack: err.stack,
    name: err.name || 'Custom Error',
  }
  console.log(customError)

  return res.status(customError.statusCode).json({
    msg: customError.msg,
    name: customError.name,
    stack: customError.stack,
    statusCode: customError.statusCode,
  })
}

export default errorHandlerMiddleware
