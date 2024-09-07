import { Schema, type InferSchemaType, model } from 'mongoose'

interface IPost {
  title: string
  description: string
  github: string
  featured?: boolean
  url?: string
  tags: string[]
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
      type: [],
      required: true,
    },
  },
  { timestamps: true }
)

export type SchemaPost = InferSchemaType<typeof postSchema>
export const Post = model('post', postSchema)
