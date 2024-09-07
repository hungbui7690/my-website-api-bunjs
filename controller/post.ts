import { type Request, type Response } from 'express'
import { Post, type SchemaPost } from '../model/Post'
import { BadRequestError } from '../errors'
import { StatusCodes } from 'http-status-codes'
import { type UserRequest, type ICustomRequestQuery } from '../types'

export const createPost = async (req: Request, res: Response) => {
  const { accessToken } = (req as UserRequest).user

  const { title, description, github, featured, url, tags, image } = req.body
  if (!title || !description || !github || !tags)
    throw new BadRequestError('Please provide all information.')

  const post = new Post<SchemaPost>({
    title,
    description,
    github,
    featured: featured || false,
    url: url || github,
    tags,
    image: image || 'images/default-image.png',
  })
  await post.save()

  res.status(StatusCodes.CREATED).json({ post, accessToken })
}

export const getAllPosts = async (req: Request, res: Response) => {
  const { tags } = req.query as ICustomRequestQuery // #

  const queryObject: any = {} // #
  let tagsList
  let result

  if (tags) {
    // Method 1
    // result = await Post.find().all('tags', tagsList || [])

    tagsList = tags.split(',')
    queryObject.tags = { $all: tagsList }
  }

  // Method 2
  result = Post.find(queryObject).sort('createdAt _id')

  // Pagination
  // Example: we have 23 products & want to have 7 items each page
  // -> 23/7 = 3.28 -> roundUp = 4
  // -> 4 page: 7 7 7 2
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  result = result.skip(skip).limit(limit)

  const posts = await result

  res.status(StatusCodes.OK).json(posts)
}

export const updatePost = async (req: Request, res: Response) => {
  const { accessToken } = (req as UserRequest).user
  const { id } = req.params
  const post = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!post) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Project wasn't found" })
  }
  res.status(StatusCodes.OK).json({ post, accessToken })
}

export const getSinglePost = async (req: Request, res: Response) => {
  const { accessToken } = (req as UserRequest).user
  const { id } = req.params
  const post = await Post.findById(id)
  if (!post) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: `No project with ID ${id}` })
  }
  res.status(StatusCodes.OK).json({ post, accessToken })
}

export const deletePost = async (req: Request, res: Response) => {
  const { accessToken } = (req as UserRequest).user
  const { id } = req.params
  const post = await Post.findByIdAndDelete(id)
  if (!post) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: `No project with ID ${id}` })
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `Post with ID ${id} was deleted`, accessToken })
}
