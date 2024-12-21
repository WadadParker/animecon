// controllers/pollController.js

const prisma = require('../prismaClient');

// 8. Answer a Poll
exports.answerPoll = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pollId } = req.params;
    const { pollOptionId } = req.body;

    if (!pollOptionId) {
      return res.status(400).json({ message: 'pollOptionId is required' });
    }

    // Check if the poll exists
    const poll = await prisma.poll.findUnique({
      where: { id: parseInt(pollId) },
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if the poll option belongs to the poll
    const pollOption = await prisma.pollOption.findUnique({
      where: { id: parseInt(pollOptionId) },
    });

    if (!pollOption || pollOption.pollId !== poll.id) {
      return res.status(400).json({ message: 'Invalid poll option for this poll' });
    }

    // Create PollAnswer
    const pollAnswer = await prisma.pollAnswer.create({
      data: {
        userId: userId,
        pollId: parseInt(pollId),
        pollOptionId: parseInt(pollOptionId),
      },
    });

    res.status(201).json(pollAnswer);
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed
      res.status(400).json({ message: 'You have already answered this poll' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// 9. Get if Poll is answered by User
exports.checkPollAnswered = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pollId } = req.params;

    const pollAnswer = await prisma.pollAnswer.findUnique({
      where: {
        unique_user_poll: {
          userId: userId,
          pollId: parseInt(pollId),
        },
      },
    });

    res.json({ hasAnswered: pollAnswer ? true : false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
