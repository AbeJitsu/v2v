import mongoose from 'mongoose';
import * as cartService from '../../../src/services/cartService';

// Mock data
const mockUserId = new mongoose.Types.ObjectId();
const mockProductId = new mongoose.Types.ObjectId();

const mockCart = {
  _id: new mongoose.Types.ObjectId(),
  user: mockUserId,
  items: [{ product: mockProductId, quantity: 1 }],
  save: jest.fn().mockResolvedValue(this), // Adding a mock `save` method
};

// Mock Cart model with save method
jest.mock('../../../src/models/cartModel', () => ({
  findOne: jest.fn(() => Promise.resolve(mockCart)),
  default: jest.fn().mockImplementation(() => ({
    ...mockCart,
    save: jest.fn().mockResolvedValue(mockCart), // Ensuring save is mocked
  })),
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
    expect(result?.items[0].product.toString()).toBe(mockProductId.toString());
    expect(result?.items[0].quantity).toBe(1);
  });
});
