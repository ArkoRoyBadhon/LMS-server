import { Document, model, Schema } from 'mongoose'

interface IUser extends Document {
  first_name?: string | null
  last_name?: string | null
  email: string | null
  password?: string | null
  role?: 'ADMIN' | 'USER'
}

const UserSchema = new Schema<IUser>({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'USER'],
  },
})

export const User = model<IUser>('User', UserSchema)
