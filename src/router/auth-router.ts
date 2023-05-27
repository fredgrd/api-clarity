import { Router } from 'express';
import { signin } from '../controllers/auth-controller';

const router = Router();

router.post('/signin', signin);

// router.post('/signup', signup);

// router.post('/signout', signout);

export { router as authRouter };
