import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Types } from 'mongoose'
import { Token } from '../model/Token'

interface ITokenInfo {
  req: Request
  res: Response
  userID: Types.ObjectId
  username: string
}

export const createTokens = async ({
  userID,
  username,
  req,
  res,
}: ITokenInfo) => {
  const accessToken = jwt.sign(
    { userID, username },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )

  // add or update refreshToken in DB
  await Token.findOneAndUpdate(
    { user: userID },
    { accessToken },
    {
      upsert: true,
    }
  )

  return { accessToken }
}
