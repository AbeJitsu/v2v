import mongoose, { FilterQuery } from 'mongoose';
import Cart, { ICart, ICartItem } from '../models/cartModel';
import { logger } from '../middleware/logger';

interface CartQuery {
  user?: string | mongoose.Types.ObjectId;
  sessionToken?: string;
  [key: string]: any;
}

interface CartOperation {
  type: 'add' | 'update' | 'remove' | 'sync';
  quantity?: number;
  cartItems?: any[];
}

// Error handling utility
const handleError = (error: any, message: string) => {
  logger.error(message, error);
  throw new Error(message);
};

// Fetch and populate cart items
const fetchCart = async (query: CartQuery): Promise<ICart | null> => {
  try {
    return await Cart.findOne(query as FilterQuery<ICart>).populate(
      'items.product'
    );
  } catch (error) {
    handleError(error, 'Error fetching cart');
    return null; // Explicitly return null in the catch block
  }
};

// Utility for fetching and saving cart
const fetchOrSaveCart = async (
  cart: ICart,
  query: CartQuery
): Promise<ICart | null> => {
  await cart.save();
  return fetchCart(query);
};

// Utility for item handling
const modifyCartItems = (
  cart: ICart,
  productId: string | null,
  operation: CartOperation
) => {
  const itemIndex = productId
    ? cart.items.findIndex((item) => item.product.toString() === productId)
    : -1;

  if (operation.type === 'add' && operation.quantity) {
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += operation.quantity;
    } else if (productId) {
      cart.items.push({
        _id: new mongoose.Types.ObjectId(), // Ensure _id is included
        product: new mongoose.Types.ObjectId(productId),
        quantity: operation.quantity,
      } as ICartItem);
    }
  } else if (
    operation.type === 'update' &&
    operation.quantity &&
    itemIndex !== -1
  ) {
    cart.items[itemIndex].quantity = operation.quantity;
  } else if (operation.type === 'remove' && itemIndex !== -1) {
    cart.items.splice(itemIndex, 1);
  } else if (operation.type === 'sync' && operation.cartItems) {
    cart.items = operation.cartItems.map((item) => ({
      _id: new mongoose.Types.ObjectId(), // Add _id for type consistency
      product: new mongoose.Types.ObjectId(item.product),
      quantity: item.quantity,
    })) as ICartItem[];
  }
};

// Consolidated function to handle cart operations
const handleCartItemOperation = async (
  query: CartQuery,
  productId: string | null,
  operation: CartOperation
): Promise<ICart | null> => {
  let cart = await fetchCart(query);
  if (!cart) {
    cart = new Cart({
      user: query.user,
      sessionToken: query.sessionToken,
      items: [],
    });
  }

  modifyCartItems(cart, productId, operation);
  return fetchOrSaveCart(cart, query);
};

// Public methods for cart operations
export const getCart = (query: CartQuery): Promise<ICart | null> =>
  fetchCart(query);

export const addItemToCart = (
  query: CartQuery,
  productId: string,
  quantity: number
) => handleCartItemOperation(query, productId, { type: 'add', quantity });

export const updateItemQuantity = (
  query: CartQuery,
  productId: string,
  quantity: number
) => handleCartItemOperation(query, productId, { type: 'update', quantity });

export const removeItemFromCart = (query: CartQuery, productId: string) =>
  handleCartItemOperation(query, productId, { type: 'remove' });

export const syncCart = (query: CartQuery, cartItems: any[]) =>
  handleCartItemOperation(query, null, { type: 'sync', cartItems });

// Merge carts and handle conversion
export const mergeCart = async (
  userId: string,
  localCartItems: any[]
): Promise<ICart | null> => {
  try {
    const userCart =
      (await fetchCart({ user: userId })) ??
      new Cart({ user: userId, items: [] });

    localCartItems.forEach((localItem) => {
      const itemIndex = userCart.items.findIndex(
        (item) => item.product.toString() === localItem.product._id
      );
      if (itemIndex !== -1) {
        userCart.items[itemIndex].quantity += localItem.quantity;
      } else {
        userCart.items.push({
          _id: new mongoose.Types.ObjectId(), // Adding _id here for consistency
          product: new mongoose.Types.ObjectId(localItem.product._id),
          quantity: localItem.quantity,
        } as ICartItem);
      }
    });
    return fetchOrSaveCart(userCart, { user: userId });
  } catch (error) {
    handleError(error, 'Failed to merge cart');
    return null; // Explicit return to avoid TypeScript errors
  }
};

export const convertGuestCartToUserCart = async (
  sessionToken: string,
  userId: string
): Promise<ICart | null> => {
  try {
    const guestCart = await fetchCart({ sessionToken });
    if (!guestCart) return null;

    guestCart.user = new mongoose.Types.ObjectId(userId);
    guestCart.sessionToken = undefined;

    await guestCart.save();

    const userCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $addToSet: { items: { $each: guestCart.items } } },
      { new: true, upsert: true }
    ).populate('items.product');

    await guestCart.deleteOne();
    return userCart;
  } catch (error) {
    handleError(error, 'Failed to convert guest cart to user cart');
    return null; // Explicit return to avoid TypeScript errors
  }
};
