// routes/adminRoutes.js

import { Router } from 'express';
const adminRouter = Router();
import { createPoll, createPollOption, getAllPolls } from '../controllers/adminController';
import { verifyToken, ensureAdmin } from '../middleware/jwtMiddleware';

// Apply JWT and Admin middleware to all routes in this router
adminRouter.use(verifyToken, ensureAdmin);

// 6. Create Polls
adminRouter.post('/polls', createPoll);

// 7. Create Poll Options
adminRouter.post('/polls/:pollId/options', createPollOption);

// 10. Get all Polls
adminRouter.get('/polls', getAllPolls);

export default adminRouter;
