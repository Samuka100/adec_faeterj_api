import express, { type ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';


export const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));


// Erros de validação do Mongoose viram 400
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};
app.use(errorHandler);