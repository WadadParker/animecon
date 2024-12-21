// controllers/adminController.js

const prisma = require('../prismaClient');

// 6. Create Polls
exports.createPoll = async (req, res) => {
  try {
    const { question } = req.body;
    const createdById = req.user.id; // Assuming the admin is the creator

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const poll = await prisma.poll.create({
      data: {
        question: question,
        createdById: createdById,
      },
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Create Poll Options
exports.createPollOption = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionText } = req.body;

    if (!optionText) {
      return res.status(400).json({ message: 'Option text is required' });
    }

    // Check if the poll exists
    const poll = await prisma.poll.findUnique({
      where: { id: parseInt(pollId) },
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const pollOption = await prisma.pollOption.create({
      data: {
        optionText: optionText,
        pollId: parseInt(pollId),
      },
    });

    res.status(201).json(pollOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 10. Get all Polls (Admin)
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        answers: true,
      },
    });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
