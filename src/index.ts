import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { isProduction, logger } from './config/logger.js';

try {
  await connectDatabase();
} catch (err) {
  logger.fatal({ err }, 'Falha ao conectar no MongoDB');
  process.exit(1);
}

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  logger.info(isProduction ? 'HTTP server listening' : `HTTP server listening on http://localhost:${port}`);
});
