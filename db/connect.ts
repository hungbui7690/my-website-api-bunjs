// mongodb+srv://hungbui7690:<db_password>@cluster0.7lyv96o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

import mongoose from 'mongoose'

export default function connectDB() {
  const mongoURI =
    process.env.MONGO_URI ?? 'mongodb://localhost:27017/MyWebsite-API-BunJS'

  try {
    mongoose.connect(mongoURI)
  } catch (error) {
    const castedError = error as Error
    console.error(castedError.message)
    process.exit(1)
  }

  mongoose.connection.once('open', (_) => {
    console.log(`Database connected`)
  })

  mongoose.connection.on('error', (err) => {
    console.error(`Database connection error: ${err}`)
  })
}
