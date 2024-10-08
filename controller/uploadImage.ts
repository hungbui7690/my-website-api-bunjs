import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

interface FileRequest extends Request {
  files: any
}

export const uploadProductImage = async (req: Request, res: Response) => {
  const options = {
    use_filename: true,
    folder: 'file-upload',
  }

  // console.log((req as FileRequest).files.file)
  console.log((req as FileRequest).files)
  console.log((req as FileRequest).files?.['image-upload']?.tempFilePath)

  const result = await cloudinary.uploader.upload(
    (req as FileRequest).files?.file?.tempFilePath ||
      (req as FileRequest).files?.['image-upload']?.tempFilePath,
    options
  )

  fs.unlinkSync(
    (req as FileRequest).files?.file?.tempFilePath ||
      (req as FileRequest).files?.['image-upload']?.tempFilePath
  )

  return res.status(StatusCodes.OK).json({ image_src: result.secure_url })
}
