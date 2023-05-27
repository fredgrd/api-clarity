import mongoose, { MongooseError } from 'mongoose';
import { log } from '../utils/logger';

export const connectDB = async (): Promise<{
  success: boolean;
}> => {
  const cluster = process.env.MONGODB_CLUSTER_URL;
  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASS;

  const uri = `mongodb+srv://${user}:${pass}@${cluster}/?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, { dbName: 'clarityDB' });
    return { success: true };
  } catch (error) {
    const mongooseError = error as MongooseError;
    log(
      'database',
      'connectDB',
      `Error connecting to DB: ${mongooseError.message}`
    );
    return { success: false };
  }
};
