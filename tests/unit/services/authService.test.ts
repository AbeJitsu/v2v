// tests/unit/authService.test.ts
import {
  generateToken,
  verifyToken,
  verifyPassword,
  hashPassword,
} from '../../src/services/authService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('AuthService Unit Tests', () => {
  const mockUser = { _id: 'user123', role: 'user' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should generate a valid token', () => {
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');
    const token = generateToken(mockUser);
    expect(token).toBe('mockToken');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id, role: mockUser.role },
      expect.any(String),
      { expiresIn: '30d' }
    );
  });

  test('should verify a token', async () => {
    const decoded = { id: 'user123' };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) =>
      callback(null, decoded)
    );
    const result = await verifyToken('mockToken');
    expect(result).toEqual(decoded);
  });

  test('should hash a password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    const result = await hashPassword('myPassword');
    expect(result).toBe('hashedPassword');
  });

  test('should verify password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await verifyPassword('myPassword', 'hashedPassword');
    expect(result).toBe(true);
  });
});
