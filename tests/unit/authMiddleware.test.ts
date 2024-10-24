import { authMiddleware } from '../../src/middleware/authMiddleware'; // Corrected import
import { Request, Response, NextFunction } from 'express';
import { User } from '../../src/models/userModel';
import session from 'express-session';

// Mock the User model's findById method
jest.mock('../../src/models/userModel', () => ({
  User: {
    findById: jest.fn(),
  },
}));

// Extend express-session to include user_id
declare module 'express-session' {
  interface SessionData {
    user_id?: string;
  }
}

let req: Partial<Request>;
let res: Partial<Response>;
let next: jest.Mock;

beforeEach(() => {
  req = {
    session: {
      user_id: 'user123',
      id: 'sessionId', // Add id property
      cookie: { originalMaxAge: 60000 }, // Add cookie property
      regenerate: jest.fn(),
      destroy: jest.fn(),
      reload: jest.fn(),
      resetMaxAge: jest.fn(),
      save: jest.fn(),
      touch: jest.fn(),
    } as session.Session & Partial<session.SessionData>, // Ensure session includes user_id
  };

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  next = jest.fn();

  // Mock User.findById to return a user
  (User.findById as jest.Mock).mockResolvedValue({
    _id: 'user123',
    email: 'test@example.com',
  });
});

describe('AuthMiddleware Unit Tests', () => {
  test('should call next when session is valid', async () => {
    await authMiddleware(req as Request, res as Response, next); // Simplified import
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(next).toHaveBeenCalled();
  });

  test('should return 401 if session is invalid', async () => {
    req.session = undefined; // Simulate an invalid session
    await authMiddleware(req as Request, res as Response, next); // Simplified import
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not authenticated',
    });
  });
});
