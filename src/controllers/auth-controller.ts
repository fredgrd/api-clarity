import { Request, Response } from 'express';

interface SigninRequest extends Request {
  body: {
    email?: string;
    password?: string;
    token?: string;
  };
}

export const signin = async (req: SigninRequest, res: Response) => {
  const { email, password, token } = req.body;

  if (token) {
    // TODO:
    // Retrieve user with token
    // Disable token for future signups? At this point or later in the process?
  } else if (email && password) {
  } else {
    // ERROR
  }
};
