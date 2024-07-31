import { Request, Response } from 'express';
import { generateToken } from '../middleware/generateToken';

/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: The authentication API
 */

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login to get an authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: testpassword
 *     responses:
 *       '200':
 *         description: Authentication token received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       '401':
 *         description: Invalid credentials
 *     security:
 *       - bearerAuth: []
 */
export class AuthController {
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
