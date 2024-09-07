import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Types } from 'mongoose'
import { Token } from '../model/Token'

interface ITokenInfo {
  req: Request
  res: Response
  userID: Types.ObjectId
}

export const createTokens = async ({ userID, req, res }: ITokenInfo) => {
  const accessToken = jwt.sign({ userID }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_LIFETIME,
  })

  const oneDay = 1000 * 60 * 60 * 24
  let refreshToken = ''
  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = { refreshToken, ip, userAgent, user: userID }

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    domain:
      process.env.NODE_ENV === 'production'
        ? process.env.PROD_URL
        : 'localhost',
    sameSite: process.env.NODE_ENV === 'production' && 'none',
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay * 30),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    domain:
      process.env.NODE_ENV === 'production'
        ? process.env.PROD_URL
        : 'localhost',
    sameSite: process.env.NODE_ENV === 'production' && 'none',
  })

  console.log('accessToken: ', accessToken)
  console.log('refreshToken: ', refreshToken)

  // add or update refreshToken in DB
  // await Token.findOneAndUpdate({ user: userID }, userToken, { upsert: true })

  return { msg: '🥌', accessToken, userToken }
}
