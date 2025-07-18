import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-backend';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};

export default connectDB; 