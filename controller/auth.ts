import { type Request, type Response } from 'express'
import { User, type SchemaUser } from '../model/User'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { BadRequestError, UnauthorizedError } from '../errors'
import { createTokens } from '../utils/createTokens'
import { Token } from '../model/Token'

const register = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password)
    throw new BadRequestError('Please provide username and password')

  const isUserExists = await User.findOne({ username })
  if (isUserExists) {
    throw new BadRequestError('username already exists')
  }

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_LIFETIME,
  })

  const user = await User.create({
    username,
    password: hashedPassword,
  })
  const userID = user._id

  // generate accessToken & refreshToken + attach to cookies
  const { accessToken, userToken } = await createTokens({ userID, req, res })

  res
    .status(StatusCodes.OK)
    .json({ username, userID, password: hashedPassword, accessToken })
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (username !== 'admin')
    throw new UnauthorizedError(
      'Sorry, this is personal page. Just admin can login!!'
    )

  if (!username || !password) {
    throw new BadRequestError('Please provide username and password')
  }

  const user = await User.findOne({ username })
  if (!user) {
    throw new UnauthorizedError('username does not exist')
  }

  const checkPassword = await bcrypt.compareSync(password, user.password)
  if (!checkPassword) {
    throw new UnauthorizedError('Your password is not correct')
  }
  const userID = user._id

  // generate accessToken & refreshToken + attach to cookies
  const { accessToken, userToken } = await createTokens({ userID, req, res })

  res.status(StatusCodes.OK).json({ username, userID, accessToken })
}

const generateNewToken = async (req: Request, res: Response) => {
  const { clientUserID, clientUsername, clientRefreshToken } = req.body

  if (clientUsername !== 'admin')
    throw new UnauthorizedError('just admin can refresh new accessToken!!')

  const user = await User.findById({ clientUserID })
  if (!user) {
    throw new UnauthorizedError('user does not exist')
  }

  const userID = user._id
  const username = user.username

  const dbToken = await Token.findOne({ user: clientUserID })
  if (!dbToken || dbToken !== clientRefreshToken)
    throw new UnauthorizedError('refreshToken is invalid!!')

  const { accessToken, userToken } = await createTokens({ userID, req, res })

  res.status(StatusCodes.OK).json({ username, accessToken })
}

const logout = async (req: Request, res: Response) => {
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    domain: 'localhost',
    sameSite: process.env.NODE_ENV === 'production' && 'none',
  })

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    domain: 'localhost',
    sameSite: process.env.NODE_ENV === 'production' && 'none',
  })

  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

export { register, login, logout, generateNewToken }
