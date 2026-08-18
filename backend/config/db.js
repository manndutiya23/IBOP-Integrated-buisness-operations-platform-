import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not set. Provide it through deployment environment variables or a local .env file."
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;