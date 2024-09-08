import { Schema, type InferSchemaType, model } from 'mongoose'

export interface ITag {
  name: string
  colors: string[]
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
)

export type SchemaTag = InferSchemaType<typeof tagSchema>
export const Tag = model('tag', tagSchema)
