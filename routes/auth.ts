import express from 'express'
const router = express.Router()
import { login, register, generateNewToken, logout } from '../controller/auth'

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', generateNewToken)
router.post('/logout', logout)

export default router
