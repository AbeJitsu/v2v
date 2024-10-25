import mongoose from 'mongoose';
import * as cartService from '../../../src/services/cartService';
import Cart from '../../../src/models/cartModel'; // Ensure proper mock targeting

// Mock data and functions
const mockUserId = new mongoose.Types.ObjectId();
const mockProductId = new mongoose.Types.ObjectId();

const mockCart = {
  _id: new mongoose.Types.ObjectId(),
  user: mockUserId,
  sessionToken: 'testSessionToken',
  items: [{ product: mockProductId, quantity: 1 }],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mocking Cart model methods, including `populate`
jest.mock('../../../src/models/cartModel', () => ({
  findOne: jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockResolvedValue(mockCart),
  })),
  findOneAndUpdate: jest.fn(() => Promise.resolve(mockCart)),
}));

describe('CartService Core Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get a cart', async () => {
    const result = await cartService.getCart({ user: mockUserId });
    expect(result).toBeDefined();
    if (result?.user) {
      expect(result.user.toString()).toBe(mockUserId.toString());
    }
  });

  test('should add an item to cart', async () => {
    const result = await cartService.addItemToCart(
      { user: mockUserId },
      mockProductId.toString(),
      1
    );
    expect(result).toBeDefined();
    expect(result?.items.length).toBeGreaterThan(0);
  });

  test('should update item quantity in cart', async () => {
    const result = await cartService.updateItemQuantity(
      { user: mockUserId },
      mockProductId.toString(),
      2
    );
    expect(result).toBeDefined();
    expect(result?.items[0].quantity).toBe(2);
  });

  test('should remove an item from cart', async () => {
    const result = await cartService.removeItemFromCart(
      { user: mockUserId },
      mockProductId.toString()
    );
    expect(result).toBeDefined();
    expect(result?.items.length).toBe(0);
  });
});
