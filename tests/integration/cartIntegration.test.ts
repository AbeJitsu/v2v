import { app } from '../../src/server';
import request from 'supertest';
import { User } from '../../src/models/userModel';
import { Cart } from '../../src/models/cartModel';
import { Request, Response, NextFunction } from 'express';

// Mock necessary parts
jest.mock('../../src/models/userModel');
jest.mock('../../src/models/cartModel');

// Mock the auth middleware to bypass authentication
jest.mock('../../src/middleware/authMiddleware', () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    (req as any).user_id = 'mockUserId'; // Casting to 'any' to avoid TypeScript error
    next();
  },
}));

describe('Cart Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a cart for an authenticated user', async () => {
    // Set up mocks for user and cart creation
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'mockUserId',
      name: 'Test User',
    });
    (Cart.create as jest.Mock).mockResolvedValue({
      user: 'mockUserId',
      items: [],
    });

    const response = await request(app)
      .post('/api/cart/add')
      .send({ productId: '123', quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cart');
  });
});
