import * as dotenv from 'dotenv';
import { createHttpServer } from './http-server';

dotenv.config();

// On connections

// HttpServer
const httpServer = createHttpServer();

(async () => {
  // const { success, error } = await connectDB();

  // if (!success) return;

  const PORT = process.env.PORT_HTTP || 3001;
  httpServer.listen(PORT, () => {
    console.log(`⚡️ Server started on http://localhost:${PORT}`);
  });
})();
