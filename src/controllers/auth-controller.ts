import { Request, Response } from 'express';
import { log } from '../utils/logger';
import { User } from '../database/models/user';
import { ErrorMessage } from './error-message';

interface SigninRequest extends Request {
  body: {
    email?: string;
    password?: string;
    token?: string;
  };
}

export const signin = async (req: SigninRequest, res: Response) => {
  const { email, password, token } = req.body;

  log('auth-controller', 'signin', req.body);

  if (token) {
    // TODO:
    // Retrieve user wit token
    // Disable token for future signups? At this point or later in the process?
  } else if (email && password) {
    const user = await User.findWithCredentials(email, password);

    if (user) {
      // RETURN THE USER

      // TODO: Sign token

      // TODO: Set cookie

      // TODO: Return user
      // User might need to be sanitize

      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        fullname: user.fullName,
        gender: user.gender,
      });
    } else {
      log('auth-controller', 'signin', ErrorMessage.Internal);
      res.status(400).send(ErrorMessage.Internal);
    }
  } else {
    log('auth-controller', 'signin', ErrorMessage.MissingCredentials);
    res.status(400).send(ErrorMessage.MissingCredentials);
  }
};

interface SignupRequest extends Request {
  body: {
    email?: string;
    password?: string;
  };
}

export const signup = async (req: SignupRequest, res: Response) => {
  const { email, password } = req.body;

  log('auth-controller', 'signup', req.body);

  if (!email || !password) {
    log('auth-controller', 'signup', ErrorMessage.MissingCredentials);
    res.status(400).send(ErrorMessage.MissingCredentials);
    return;
  }

  const user = await User.createWithCredentials(email, password);

  if (user) {
    // RETURN THE USER

    // TODO: Sign token

    // TODO: Set cookie

    // TODO: Return user
    // User might need to be sanitized

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      fullname: user.fullName,
      gender: user.gender,
    });
  } else {
    log('auth-controller', 'signup', ErrorMessage.Internal);
    res.status(500).send(ErrorMessage.Internal);
    return;
  }
};
