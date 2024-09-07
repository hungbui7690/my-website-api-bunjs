import { StatusCodes } from 'http-status-codes'

class CustomAPIError extends Error {
  statusCode: StatusCodes
  constructor(message: string) {
    let err = {}
    super(message)
    this.stack = new Error().stack
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default CustomAPIError
