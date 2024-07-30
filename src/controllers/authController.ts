import { Request, Response } from 'express';
import { generateToken } from '../middleware/generateToken';

class AuthController {
  public async login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    if (username === process.env.TEST_USER && password === process.env.TEST_PASSWORD) {
      const token = generateToken({ id: process.env.TEST_ID!, username: process.env.TEST_USER! });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }
}

export const authController = new AuthController();
