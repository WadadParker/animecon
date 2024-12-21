// routes/pollRoutes.js

import { Router } from 'express';
const pollRouter = Router();
import { answerPoll, checkPollAnswered } from '../controllers/pollController.js';
import { verifyToken } from '../middleware/jwtMiddleware.js';

// Apply JWT middleware
pollRouter.use(verifyToken);

// 8. Answer a Poll
pollRouter.post('/:pollId/answer', answerPoll);

// 9. Check if Poll is answered by User
pollRouter.get('/:pollId/answer-status', checkPollAnswered);

export default pollRouter;
