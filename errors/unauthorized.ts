import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-api'

class UnauthorizedError extends CustomAPIError {
  statusCode: StatusCodes
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
    this.name = 'Unauthorized Error'
  }
}

export default UnauthorizedError
