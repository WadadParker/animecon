// routes/authRoutes.js

import { Router } from 'express';
import { authenticate } from 'passport';
const authRouter = Router();
import { getAuthenticatedUser } from '../controllers/authController.js';

// 1. Register User via GoogleAuth
authRouter.get('/google',
  authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/google/callback',
  authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, send JWT
    res.json({ token: req.user.token }); // Send the JWT to the client
  }
);

// Optional: Logout route (Not applicable in JWT-based auth, can be handled client-side)
authRouter.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Example: Get authenticated user info
authRouter.get('/me', getAuthenticatedUser);

export default authRouter;
