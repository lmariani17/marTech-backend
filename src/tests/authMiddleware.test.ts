import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  it('should respond with 401 if no token is provided', () => {
    authMiddleware(req as Request, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond with 403 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalidtoken' };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(new Error('Invalid token'), null));

    authMiddleware(req as Request, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    req.headers = { authorization: 'Bearer validtoken' };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(null, { id: 'userId' }));

    authMiddleware(req as Request, res as Response, next);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
