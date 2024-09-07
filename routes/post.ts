import express from 'express'
const router = express.Router()
import { createPost, getAllPosts, updatePost } from '../controller/post'
import { uploadProductImage } from '../controller/uploadImage'
import { authenticateUser } from '../middleware/authentication'

router.post('/uploadImage', uploadProductImage)
router.post('/', authenticateUser, createPost)
router.get('/', getAllPosts)
router.get('/:id', getAllPosts)
router.patch('/:id', authenticateUser, updatePost)

export default router
