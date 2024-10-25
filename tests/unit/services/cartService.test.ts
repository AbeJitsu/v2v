import mongoose from 'mongoose';
import * as cartService from '../../../src/services/cartService';
import Cart, { ICart, ICartItem } from '../../../src/models/cartModel'; // Adjust path if needed

// Mock Data
const mockUserId = new mongoose.Types.ObjectId();
const mockProductId = new mongoose.Types.ObjectId();
const mockCart: ICart = {
  user: mockUserId,
  sessionToken: 'mockSessionToken',
  items: [
    {
      product: mockProductId,
      quantity: 1,
    } as ICartItem,
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock('../../src/models/cartModel', () => ({
  findOne: jest.fn().mockResolvedValue(mockCart),
  save: jest.fn().mockResolvedValue(mockCart),
}));

describe('CartService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch a cart', async () => {
    const result = await cartService.getCart({ user: mockUserId });
    expect(result).toBeDefined();
    expect(result?.user.toString()).toBe(mockUserId.toString());
    expect(result?.items.length).toBeGreaterThan(0);
  });

  test('should add an item to cart', async () => {
    const result = await cartService.addItemToCart(
      { user: mockUserId },
      mockProductId.toString(),
      1
    );
    expect(result).toBeDefined();
    expect(
      result?.items.find(
        (item: ICartItem) =>
          item.product.toString() === mockProductId.toString()
      )
    ).toBeDefined();
  });

  test('should update item quantity in cart', async () => {
    const result = await cartService.updateItemQuantity(
      { user: mockUserId },
      mockProductId.toString(),
      2
    );
    expect(result).toBeDefined();
    expect(
      result?.items.find(
        (item: ICartItem) =>
          item.product.toString() === mockProductId.toString()
      )?.quantity
    ).toBe(2);
  });

  test('should remove an item from cart', async () => {
    const result = await cartService.removeItemFromCart(
      { user: mockUserId },
      mockProductId.toString()
    );
    expect(result).toBeDefined();
    expect(
      result?.items.find(
        (item: ICartItem) =>
          item.product.toString() === mockProductId.toString()
      )
    ).toBeUndefined();
  });
});
