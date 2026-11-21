import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';

const connectString = process.env.CONNECTSTRING;
if (!connectString) {
  throw new Error('CONNECTSTRING não definida');
}

await mongoose.connect(connectString, { dbName: process.env.DB_NAME });
console.log(`MongoDB conectado (banco: ${process.env.DB_NAME})`);

const port = process.env.PORT ?? 8080;
app.listen(port, () => console.log(`SERVER RUN ON: http://localhost:${port}`));
