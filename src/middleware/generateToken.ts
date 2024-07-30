import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export const generateToken = (user: { id: string, username: string }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};
