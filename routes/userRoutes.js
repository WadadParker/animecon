// routes/userRoutes.js

import { Router } from 'express';
const userRouter = Router();
import { checkPaymentStatus, updatePaymentStatus, getUserDetails, scratchAnimeCard } from '../controllers/userController.js';
import { verifyToken } from '../middleware/jwtMiddleware.js';

// Apply JWT middleware to all routes in this router
userRouter.use(verifyToken);

// 2. Check whether user has paid or not
userRouter.get('/payment-status', checkPaymentStatus);

// 3. Update user value to paid
userRouter.patch('/payment-status', updatePaymentStatus);

// 4. Get user's details
userRouter.get('/me', getUserDetails);

// 5. Scratch the anime card
userRouter.post('/scratch-anime', scratchAnimeCard);

export default userRouter;
