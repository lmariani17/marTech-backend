import jwt from 'jsonwebtoken';
import { generateToken } from '../middleware/generateToken';

// Mock the JWT sign function
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

describe('generateToken', () => {
  it('should generate a token with the correct payload and secret', () => {
    const user = { id: '123', username: 'testuser' };
    const token = 'mockedToken';

    (jwt.sign as jest.Mock).mockReturnValue(token);

    const result = generateToken(user);

    expect(jwt.sign).toHaveBeenCalledWith(user, JWT_SECRET, { expiresIn: '1h' });
    expect(result).toBe(token);
  });
});
