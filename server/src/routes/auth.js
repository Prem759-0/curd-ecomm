import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import { registerRules, loginRules } from '../validators.js';
import { register, login, refresh, logout, me } from '../controllers/auth.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
});

router.post('/register', registerRules, validate, register);
router.post('/login', loginLimiter, loginRules, validate, login);
router.post('/refresh-token', refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
