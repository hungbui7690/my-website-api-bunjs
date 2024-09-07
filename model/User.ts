import { Schema, type InferSchemaType, model, Types } from 'mongoose'

interface IUser {
  _id: Types.ObjectId
  username: string
  password: string
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export type SchemaUser = InferSchemaType<typeof userSchema>
export const User = model('user', userSchema)
