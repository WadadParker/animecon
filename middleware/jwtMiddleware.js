// middleware/jwtMiddleware.js

import { verify } from 'jsonwebtoken';
import { user as _user } from '../prismaClient.js';
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting 'Bearer TOKEN'

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = verify(token, JWT_SECRET);
        const user = await _user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token: user not found' });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Failed to authenticate token' });
    }
}
export function ensureAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Admins only' });
}
