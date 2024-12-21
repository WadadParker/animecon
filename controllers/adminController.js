// controllers/adminController.js

import { poll as _poll, pollOption as _pollOption } from '../prismaClient.js';

// 6. Create Polls
 async function createPoll(req, res) {
  try {
    const { question } = req.body;
    const createdById = req.user.id; // Assuming the admin is the creator

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const poll = await _poll.create({
      data: {
        question: question,
        createdById: createdById,
      },
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 7. Create Poll Options
 async function createPollOption(req, res) {
  try {
    const { pollId } = req.params;
    const { optionText } = req.body;

    if (!optionText) {
      return res.status(400).json({ message: 'Option text is required' });
    }

    // Check if the poll exists
    const poll = await _poll.findUnique({
      where: { id: parseInt(pollId) },
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const pollOption = await _pollOption.create({
      data: {
        optionText: optionText,
        pollId: parseInt(pollId),
      },
    });

    res.status(201).json(pollOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 10. Get all Polls (Admin)
 async function getAllPolls(req, res) {
  try {
    const polls = await _poll.findMany({
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
}

module.exports = {
    createPoll,createPollOption,getAllPolls
}