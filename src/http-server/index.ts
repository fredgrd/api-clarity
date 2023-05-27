import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from '../router';
// import authMiddleware from '../middlewares/auth-middleware';

export const createHttpServer = (): Express => {
  const app: Express = express();

  app.use(cors({ origin: ['http://localhost:3000', 'http://10.10.22.212:3000'], credentials: true }));

  app.use(cookieParser());

  app.use(express.json());

  // Middleware
  // app.use(authMiddleware);

  // Routes
  // app.use('/room', router.room);

  app.use('/auth', router.auth);

  // app.use('/user', router.user);

  // app.use('/summary', router.summary);

  return app;
};
