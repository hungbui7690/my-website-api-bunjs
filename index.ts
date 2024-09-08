// Documentation: https://documenter.getpostman.com/view/13813451/2sAXjNYrTA

// @ts-ignore
import { xss } from 'express-xss-sanitizer'
import express from 'express'
import 'express-async-errors'
import path from 'path'
import morgan from 'morgan'
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
    origin: [
      'http://localhost:5173',
      'https://hungbui.com',
      'https://hungbui.netlify.app/',
    ],
    credentials: true,
  })
)
app.use(fileUpload({ useTempFiles: true }))
app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public', 'images')))
app.use(morgan('tiny'))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.set('trust proxy', 1)
app.use(limiter)
app.use(xss(xssOptions))

app.use('/api/v1/tag', tagRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/auth', authRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000
const start = async () => {
  await connectDB()

  app.listen(PORT, async () => {
    console.log('The magic happens on port 5000!')
  })
}
start()
