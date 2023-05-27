import * as dotenv from 'dotenv';
import { createHttpServer } from './http-server';
import { connectDB } from './database';
import { log } from './utils/logger';

dotenv.config();

// HttpServer
const httpServer = createHttpServer();

(async () => {
  const { success } = await connectDB();

  if (!success) return;

  const PORT = process.env.PORT_HTTP || 3001;
  httpServer.listen(PORT, () => {
    log(
      'database',
      'connectDB',
      `🚀 Connected to DB, Server started on http://localhost:${PORT}`
    );
  });
})();
