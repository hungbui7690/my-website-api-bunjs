// Documentation: https://documenter.getpostman.com/view/13813451/2sAXjNYrTA

// @ts-ignore
import { xss } from 'express-xss-sanitizer'
import express from 'express'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import path from 'path'
import morgan from 'morgan'
import crypto from 'crypto'
import helmet from 'helmet'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary'
import connectDB from './db/connect'
import postRoute from './routes/post'
import authRoute from './routes/auth'
import tagRoute from './routes/tag'
import cookieRoute from './routes/testCookies'
import notFoundMiddleware from './middleware/not-found'
import errorHandlerMiddleware from './middleware/error-handler'
const app = express()

const xssOptions = {
  allowedKeys: ['name'],
  allowedAttributes: {
    input: ['value'],
  },
}
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, //access-control-allow-credentials:true
  })
)
app.use(fileUpload({ useTempFiles: true }))
app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public', 'images'))) // http://localhost:5000/static/default-image.png
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.set('trust proxy', 1)
app.use(limiter)
app.use(xss(xssOptions))

app.get('/ip', (req, res) => {
  res.json({ ip: req.ip })
})

app.get('/ping', (req, res) => {
  let testToken = ''
  const oneDay = 1000 * 60 * 60 * 24
  testToken = crypto.randomBytes(40).toString('hex')

  res.cookie('testToken', testToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })

  res.json({ msg: '🏓 Pong!!', testToken })
})

app.get('/cookies', function (req, res) {
  console.log('Cookies: ', req.cookies)
  console.log('Signed Cookies: ', req.signedCookies)

  res
    .status(200)
    .json({ cookies: req.cookies, signedCookies: req.signedCookies })
})

// routes
app.use('/api/v1/tag', tagRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/auth', authRoute)
app.use('/', cookieRoute)

// middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// start server
const PORT = process.env.PORT || 5000
const start = async () => {
  await connectDB()

  app.listen(PORT, async () => {
    console.log('The magic happens on port 5000!')
  })
}
start()
