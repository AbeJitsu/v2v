import { Request, Response, NextFunction } from 'express';

// Mocked authMiddleware function
const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.session && req.session.user_id) {
    return next(); // Call next if user_id exists
  }
  res.status(401).json({ message: 'User not authenticated' }); // Respond with 401 if no user_id
};

let req: { session?: { user_id?: string } }; // Define req with an optional session
let res: Partial<Response>; // Partial type for response
let next: jest.Mock; // Mock for next function

beforeEach(() => {
  // Reset mocks before each test
  req = { session: { user_id: 'user123' } }; // Simulate a valid session
  res = {
    status: jest.fn().mockReturnThis(), // Allow chaining on response
    json: jest.fn(), // Mock the json method
  };
  next = jest.fn(); // Mock the next function
});

describe('AuthMiddleware Unit Tests', () => {
  test('should call next when session is valid', () => {
    authMiddleware(req as Request, res as Response, next); // Call middleware
    expect(next).toHaveBeenCalled(); // Expect next to be called
  });

  test('should return 401 if session is invalid', () => {
    req.session = undefined; // Simulate an invalid session
    authMiddleware(req as Request, res as Response, next); // Call middleware
    expect(res.status).toHaveBeenCalledWith(401); // Expect status 401
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not authenticated',
    }); // Check response message
  });
});
