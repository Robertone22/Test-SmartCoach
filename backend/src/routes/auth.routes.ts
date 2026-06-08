import { Router } from 'express';
import { demoLogin, register } from '../controllers/auth.controller';

export const authRouter = Router();

/**
 * POST /api/auth/demo-login
 * Authenticates a user with email + password.
 * Returns a simple user object (demo auth — no JWT for simplicity).
 */
authRouter.post('/demo-login', demoLogin);

/**
 * POST /api/auth/register
 * Creates a new user account with email + password.
 */
authRouter.post('/register', register);

