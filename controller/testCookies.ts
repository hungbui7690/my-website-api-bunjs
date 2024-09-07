import crypto from 'crypto'
import { type Request, type Response } from 'express'

export const testCookies = (req: Request, res: Response) => {
  let testToken1 = ''
  const oneDay = 1000 * 60 * 60 * 24
  testToken1 = crypto.randomBytes(40).toString('hex')

  res.cookie('testToken1', testToken1, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })

  console.log('Cookies: ', req.cookies)
  console.log('Signed Cookies: ', req.signedCookies)

  res.json({ msg: '🏓 Pong!!', testToken1 })
}
