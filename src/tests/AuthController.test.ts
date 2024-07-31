import { Request, Response } from 'express';
import { generateToken } from '../middleware/generateToken';
import { AuthController } from '../controllers/AuthController';

jest.mock('../middleware/generateToken');

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });

  test('should return a token for valid credentials', async () => {
    (generateToken as jest.Mock).mockReturnValue('mockToken');

    const req = {
      body: {
        username: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD,
      },
    } as Request;

    const res = {
      json: jest.fn().mockReturnValue({ token: 'mockToken' }),
    } as unknown as Response;

    await authController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
  });

  test('should return 401 for invalid credentials', async () => {
    const req = {
      body: {
        username: 'invalidUser',
        password: 'invalidPassword',
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });
});
