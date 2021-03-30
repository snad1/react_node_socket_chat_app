import config from "./config";
import mongoose from "mongoose";

const db: string = config.mongoURI

const connectDB = async () => {
  try {
    await mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
    // await mongo.MongoClient.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
    console.log("MongoDB connected...")
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

export default connectDB