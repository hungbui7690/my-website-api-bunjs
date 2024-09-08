import mongoose, { Schema, type InferSchemaType, model } from 'mongoose'
import { type SchemaTag, type ITag } from './Tag'

interface IPost {
  title: string
  description: string
  github: string
  featured?: boolean
  url?: string
  tags: (typeof mongoose.Schema.ObjectId)[]
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    github: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    tags: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Tag',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

export type SchemaPost = InferSchemaType<typeof postSchema>
export const Post = model('post', postSchema)
