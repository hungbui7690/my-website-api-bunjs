import mongoose, { Schema, type InferSchemaType, model, Types } from 'mongoose'

interface IToken {
  refreshToken: string
  ip?: string
  userAgent: string
  isValid?: boolean
  user: Types.ObjectId
}

const tokenSchema = new Schema<IToken>(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export type SchemaToken = InferSchemaType<typeof tokenSchema>
export const Token = model('token', tokenSchema)
