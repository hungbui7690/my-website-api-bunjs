import { type Request, type Response } from 'express'
import { Tag, type SchemaTag } from '../model/Tag'
import { BadRequestError } from '../errors'
import { StatusCodes } from 'http-status-codes'

export const createTag = async (req: Request, res: Response) => {
  const { name, colors } = req.body
  if (!name || !colors)
    throw new BadRequestError('Please provide all information.')

  const tag = new Tag<SchemaTag>({
    name,
    colors,
  })
  await tag.save()

  res.status(StatusCodes.CREATED).json(tag)
}

export const getAllTags = async (req: Request, res: Response) => {
  const tags = await Tag.find({}).sort({ name: 1 }).allowDiskUse(true)
  res.status(StatusCodes.OK).json(tags)
}

export const updateTag = async (req: Request, res: Response) => {
  const { id } = req.params
  const tag = await Tag.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!tag) {
    res.status(StatusCodes.NOT_FOUND).json()
  }
  res.status(StatusCodes.OK).json(tag)
}

export const getSingleTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const tag = await Tag.findById(id)
    if (!tag) {
      res.status(404).send()
    }
    res.status(StatusCodes.OK).json(tag)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const tag = await Tag.findByIdAndDelete(id)
    if (!tag) {
      res.status(404).send("Tag wasn't found")
    }
    res.status(200).send(tag)
  } catch (error) {
    res.status(500).send(error)
  }
}
