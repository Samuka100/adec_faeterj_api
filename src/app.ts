import 'reflect-metadata';
import express, { type ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { httpLogger } from './config/logger.js';
import authRoute from './routes/auth.route.js';

export const app = express();
app.use(httpLogger);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use('/auth', authRoute);

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: err.message });
    return;
  }

  req.log.error({ err }, 'Unhandled error');
  res.status(500).json({ message: 'Internal server error' });
};
app.use(errorHandler);
