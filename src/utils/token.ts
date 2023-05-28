import jwt from 'jsonwebtoken';
import { log } from './logger';

export interface AuthToken {
  userId: string;
  email: string;
}

export const signToken = (
  userId: string,
  email: string
): string | undefined => {
  const secret = process.env.JWT_USER_SECRET;

  if (!secret) {
    log('utils/token', 'signToken', 'NoSecret');
    return;
  }

  const token = jwt.sign({ id: userId, email: email }, secret, {
    expiresIn: '7d',
  });

  return token;
};

export const verifyToken = (token: string): AuthToken | undefined => {
  const secret = process.env.JWT_USER_SECRET;

  if (!secret) {
    log('utils/token', 'verifyToken', 'NoSecret');
    return;
  }

  return jwt.verify(token, secret) as AuthToken;
};
