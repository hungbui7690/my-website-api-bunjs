import express from 'express'
const router = express.Router()
import { testCookies } from '../controller/testCookies'

router.post('/testCookies', testCookies)

export default router
