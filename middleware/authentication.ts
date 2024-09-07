import { type Request, type Response, type NextFunction } from 'express'
import { UnauthenticatedError, UnauthorizedError } from '../errors'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { createTokens } from '../utils/createTokens'

interface Payload extends JwtPayload {
  username: string
}

interface UserRequest extends Request {
  user?: any
  username: string
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. get back token from cookies
  const accessToken = req.signedCookies.accessToken
  const refreshToken = req.signedCookies.refreshToken
  console.log(req.signedCookies)

  // 2. verify the token with our secret
  const { userID } = jwt.verify(
    accessToken,
    process.env.JWT_SECRET || 'secret'
  ) as Payload
  ;(req as UserRequest).user = { userID }

  // 3.
  if (!accessToken && !refreshToken) {
    throw new UnauthenticatedError('Authentication Invalid')
  }

  // 4. generate new accessToken if accessToken is expired
  if (!accessToken && refreshToken) {
    const userID = req.body?.userID
    await createTokens({ userID, req, res })
  }

  next()
}
