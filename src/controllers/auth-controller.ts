import { Request, Response } from 'express';
import { log } from '../utils/logger';
import { User } from '../database/models/user';
import { ErrorMessage } from './error-message';
import { signToken } from '../utils/token';
import { SigninLink } from '../database/models/signin-link';

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

  // Performs the signin with either credentials or token (signin link)
  if (token) {
    // Validate token
    const userId = await SigninLink.validateToken(token);

    if (!userId) {
      res.status(400).send(ErrorMessage.InvalidToken);
      return;
    }

    const user = await User.findWithId(userId);

    if (user) {
      // Generate authToken
      const authToken = signToken(user.id, user.email);

      if (!authToken) {
        res.status(500).send(ErrorMessage.Internal);
        return;
      }

      // Set authToken cookie
      const date = new Date();
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      res.cookie('authToken', authToken, {
        httpOnly: true,
        // secure: true,
        // domain: 'localhost:3000',
        expires: date,
      });

      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        fullname: user.fullName,
        gender: user.gender,
        onboarding_step: user.onboarding_step,
      });
    } else {
      log('auth-controller', 'signin', ErrorMessage.Internal);
      res.status(500).send(ErrorMessage.Internal);
    }
  } else if (email && password) {
    const user = await User.findWithCredentials(email, password);

    if (user) {
      // Generate authToken
      const authToken = signToken(user.id, user.email);

      if (!authToken) {
        res.status(500).send(ErrorMessage.Internal);
        return;
      }

      // Set authToken cookie
      const date = new Date();
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      res.cookie('authToken', authToken, {
        httpOnly: true,
        // secure: true,
        // domain: 'localhost:3000',
        expires: date,
      });

      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        fullname: user.fullName,
        gender: user.gender,
        onboarding_step: user.onboarding_step,
      });
    } else {
      log('auth-controller', 'signin', ErrorMessage.BadData);
      res.status(400).send(ErrorMessage.BadData);
    }
  } else {
    log('auth-controller', 'signin', ErrorMessage.BadData);
    res.status(400).send(ErrorMessage.BadData);
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
    log('auth-controller', 'signup', ErrorMessage.BadData);
    res.status(400).send(ErrorMessage.BadData);
    return;
  }

  const user = await User.createWithCredentials(email, password);

  if (user) {
    // Generate authToken
    const authToken = signToken(user.id, user.email);

    if (!authToken) {
      res.status(500).send(ErrorMessage.Internal);
      return;
    }

    // Set authToken cookie
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    res.cookie('authToken', authToken, {
      httpOnly: true,
      // secure: true,
      // domain: 'localhost:3000',
      expires: date,
    });

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      fullname: user.fullName,
      gender: user.gender,
    });
  } else {
    log('auth-controller', 'signup', ErrorMessage.BadData);
    res.status(400).send(ErrorMessage.BadData);
    return;
  }
};
