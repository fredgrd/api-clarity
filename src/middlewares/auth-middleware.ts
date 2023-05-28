import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthToken, verifyToken } from '../utils/token';

export interface AuthenticatedRequest extends Request {
  token: AuthToken;
}

const WHITE_LIST = [
  { path: 'auth/signin', method: 'POST' },
  { path: 'auth/signup', method: 'POST' },
];

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const unrestrictedRoute = WHITE_LIST.findIndex(
    (route) => req.path === route.path && req.method === route.method
  );
  if (unrestrictedRoute !== -1) {
    next();
    return;
  }

  // authToken is the name of the authentication cookie with JWT
  const { authToken } = req.cookies;

  if (!authToken) {
    res.status(401).send('MissingAuth');
    return;
  }

  const token = verifyToken(authToken);

  if (!token) {
    res.status(401).send('MissingAuth');
    return;
  }

  req.token = token;

  next();
};

export default authMiddleware;
