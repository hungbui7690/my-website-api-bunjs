import { type Request, type Response, type NextFunction } from 'express'
import { UnauthenticatedError, UnauthorizedError } from '../errors'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { createTokens } from '../utils/createTokens'
import { User } from '../model/User'
import { type Payload, type UserRequest } from '../types'

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new UnauthenticatedError('No accessToken is provided')
  const clientAccessToken = authHeader.split(' ')[1]
  // console.log('Bearer Token: ', clientAccessToken)

  const {
    userID,
    username,
    exp: accessTokenExp,
    accessToken,
  } = jwt.verify(
    clientAccessToken,
    process.env.JWT_SECRET || 'secret'
  ) as Payload

  if (Date.now() >= (accessTokenExp as number) * 1000) {
    throw new UnauthenticatedError('accessToken is expired')
  }

  const user = await User.findOne({ username })
  if (!user) {
    throw new UnauthorizedError('username does not exist')
  }

  const { accessToken: newAccessToken } = await createTokens({
    userID: user._id,
    username,
    req,
    res,
  })

  ;(req as UserRequest).user = {
    userID,
    username,
    accessToken: newAccessToken,
  }
  next()
}
