import mongoose from 'mongoose';
import { logger } from './logger.js';

export async function connectDatabase(): Promise<void> {
  const connectString = process.env.CONNECTSTRING;
  if (!connectString) {
    throw new Error('CONNECTSTRING não definida');
  }

  await mongoose.connect(connectString);
  logger.info('database connected');
}
