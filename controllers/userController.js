// controllers/userController.js

const prisma = require('../prismaClient');

// 2. Check whether user has paid or not
exports.checkPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const payment = await prisma.payment.findFirst({
      where: {
        userId: userId,
        status: 'VERIFIED',
      },
    });
    res.json({ hasPaid: payment ? true : false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Update user value to paid
exports.updatePaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, paymentMethod, screenshotUrl } = req.body;

    // Validate input
    const validStatuses = ['PENDING', 'VERIFIED', 'FAILED'];
    const validPaymentMethods = ['PHONEPE_UPI', 'PAYMENT_SCREENSHOT'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const paymentData = {
      status: status || 'PENDING',
      paymentMethod: paymentMethod || 'PAYMENT_SCREENSHOT',
      screenshotUrl: screenshotUrl || null,
      userId: userId,
    };

    const updatedPayment = await prisma.payment.create({
      data: paymentData,
    });

    if (updatedPayment.status === 'VERIFIED') {
      await prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get user's details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Scratch the anime card
exports.scratchAnimeCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { animeIds } = req.body; // Expecting an array of anime IDs

    if (!Array.isArray(animeIds) || animeIds.length === 0) {
      return res.status(400).json({ message: 'animeIds must be a non-empty array' });
    }

    // Validate animeIds
    const validAnimes = await prisma.anime.findMany({
      where: { id: { in: animeIds } },
      select: { id: true },
    });

    const validAnimeIds = validAnimes.map(anime => anime.id);
    const invalidAnimeIds = animeIds.filter(id => !validAnimeIds.includes(id));

    if (invalidAnimeIds.length > 0) {
      return res.status(400).json({ message: `Invalid anime IDs: ${invalidAnimeIds.join(', ')}` });
    }

    // Create entries in UserAnime
    const userAnimes = await prisma.userAnime.createMany({
      data: animeIds.map((animeId) => ({
        userId: userId,
        animeId: animeId,
      })),
      skipDuplicates: true, // Prevent duplicate entries
    });

    res.json({ message: 'Animes marked as watched', count: userAnimes.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
