// auth.js

import { use, serializeUser, deserializeUser } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { user as _user } from './prismaClient';
import { sign, verify } from 'jsonwebtoken';
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// Configure Google Strategy
use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract necessary profile information
      const { id, displayName, emails } = profile;
      const email = emails[0].value;

      // Find or create user in the database
      let user = await _user.findUnique({
        where: { googleId: id },
      });

      if (!user) {
        user = await _user.create({
          data: {
            name: displayName,
            email: email,
            googleId: id,
          },
        });
      }

      // Generate JWT
      const token = sign(
        { userId: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      return done(null, { token });
    } catch (error) {
      return done(error, null);
    }
  }
));

// No need for serializeUser and deserializeUser in JWT-based auth
serializeUser((user, done) => {
  done(null, user.token);
});

deserializeUser(async (token, done) => {
  try {
    const decoded = verify(token, JWT_SECRET);
    const user = await _user.findUnique({ where: { id: decoded.userId } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
