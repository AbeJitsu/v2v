import mongoose from 'mongoose';

// Mocked Data
const mockUserId = new mongoose.Types.ObjectId();
const mockProductId = new mongoose.Types.ObjectId();
const mockCart = {
  user: mockUserId,
  items: [{ product: mockProductId, quantity: 1 }],
};

// Mocked Functions
const getCart = async ({ user }: { user: mongoose.Types.ObjectId }) => {
  return user.equals(mockUserId) ? mockCart : null;
};

const addItemToCart = async (
  { user }: { user: mongoose.Types.ObjectId },
  productId: string,
  quantity: number
) => {
  if (user.equals(mockUserId)) {
    mockCart.items.push({
      product: new mongoose.Types.ObjectId(productId),
      quantity,
    });
    return mockCart;
  }
  return null;
};

const updateItemQuantity = async (
  { user }: { user: mongoose.Types.ObjectId },
  productId: string,
  quantity: number
) => {
  if (user.equals(mockUserId)) {
    const item = mockCart.items.find(
      (item) => item.product.toString() === productId
    );
    if (item) {
      item.quantity = quantity;
    }
    return mockCart;
  }
  return null;
};

const removeItemFromCart = async (
  { user }: { user: mongoose.Types.ObjectId },
  productId: string
) => {
  if (user.equals(mockUserId)) {
    mockCart.items = mockCart.items.filter(
      (item) => item.product.toString() !== productId
    );
    return mockCart;
  }
  return null;
};

// Test Suite
describe('CartController Unit Tests (Isolated)', () => {
  afterEach(() => {
    mockCart.items = [{ product: mockProductId, quantity: 1 }]; // Reset mockCart items after each test
  });

  test('should get a cart', async () => {
    const result = await getCart({ user: mockUserId });
    expect(result).toBeDefined();
    expect(result?.user.toString()).toBe(mockUserId.toString());
  });

  test('should add an item to cart', async () => {
    const result = await addItemToCart(
      { user: mockUserId },
      mockProductId.toString(),
      1
    );
    expect(result).toBeDefined();
    expect(result?.items.length).toBeGreaterThan(1);
  });

  test('should update item quantity in cart', async () => {
    const result = await updateItemQuantity(
      { user: mockUserId },
      mockProductId.toString(),
      2
    );
    expect(result).toBeDefined();
    expect(result?.items[0].quantity).toBe(2);
  });

  test('should remove an item from cart', async () => {
    const result = await removeItemFromCart(
      { user: mockUserId },
      mockProductId.toString()
    );
    expect(result).toBeDefined();
    expect(result?.items.length).toBe(0);
  });
});
