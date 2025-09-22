import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDb = async () => {
  try {
    const dbUri = process.env.DB_URI;
    await mongoose.connect(dbUri);

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process with failure
  }
};
