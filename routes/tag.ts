import express from 'express'
const router = express.Router()
import {
  createTag,
  getAllTags,
  getSingleTag,
  updateTag,
  deleteTag,
} from '../controller/tag'
import { uploadProductImage } from '../controller/uploadImage'
import { authenticateUser } from '../middleware/authentication'

router.post('/uploadImage', uploadProductImage)
router.post('/', authenticateUser, createTag)
router.get('/', getAllTags)
router.get('/:id', getSingleTag)
// router.patch('/:id', authenticateUser, updateTag)
// router.delete('/:id', authenticateUser, deleteTag)

export default router
