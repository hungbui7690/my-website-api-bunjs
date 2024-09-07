import { type JwtPayload } from 'jsonwebtoken'
import { type Request } from 'express'
import { type Query } from 'express-serve-static-core'

export interface Payload extends JwtPayload {
  username: string
  userID: string
}

export interface UserRequest extends Request {
  user: {
    userID: string
    username: string
    accessToken: string
  }
}

export interface ICustomRequestQuery extends Query {
  tags: string
}
