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
  cartItems?: Partial<ICartItem>[];
}

// Fetch and populate a cart
const fetchCart = async (query: CartQuery): Promise<ICart | null> => {
  try {
    return await Cart.findOne(query as FilterQuery<ICart>).populate(
      'items.product'
    );
  } catch (error) {
    logger.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart');
  }
};

// Ensure a cart exists or create a new one
const getOrCreateCart = async (query: CartQuery): Promise<ICart> => {
  let cart = await fetchCart(query);
  if (!cart) {
    cart = new Cart({
      user: query.user,
      sessionToken: query.sessionToken,
      items: [],
    });
  }
  return cart;
};

// Save and re-fetch a cart
const saveAndFetchCart = async (
  cart: ICart,
  query: CartQuery
): Promise<ICart | null> => {
  await cart.save();
  return await fetchCart(query);
};

// Handle cart item operations
const handleCartItemOperation = async (
  query: CartQuery,
  productId: string | null,
  operation: CartOperation
): Promise<ICart | null> => {
  let cart = await getOrCreateCart(query);
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  switch (operation.type) {
    case 'add':
      if (itemIndex !== -1 && operation.quantity) {
        cart.items[itemIndex].quantity += operation.quantity;
      } else if (productId && operation.quantity) {
        cart.items.push({
          _id: new mongoose.Types.ObjectId(),
          product: new mongoose.Types.ObjectId(productId),
          quantity: operation.quantity,
        } as ICartItem);
      }
      break;
    case 'update':
      if (itemIndex !== -1 && operation.quantity) {
        cart.items[itemIndex].quantity = operation.quantity;
      }
      break;
    case 'remove':
      if (itemIndex !== -1) {
        cart.items.splice(itemIndex, 1);
      }
      break;
    case 'sync':
      if (operation.cartItems) {
        cart.items = operation.cartItems.map((item) => ({
          ...item,
          _id: new mongoose.Types.ObjectId(),
          product: new mongoose.Types.ObjectId(String(item.product)),
        })) as ICartItem[];
      }
      break;
  }

  return await saveAndFetchCart(cart, query);
};

// Exported cart service functions
export const getCart = (query: CartQuery): Promise<ICart | null> =>
  fetchCart(query);

export const addItemToCart = (query: CartQuery, productId: string, quantity: number) =>
  handleCartItemOperation(query, productId, { type: 'add', quantity });

export const updateItemQuantity = (
  query: CartQuery,
  productId: string,
  quantity: number
) => handleCartItemOperation(query, productId, { type: 'update', quantity });

export const removeItemFromCart = (query: CartQuery, productId: string) =>
  handleCartItemOperation(query, productId, { type: 'remove' });

export const syncCart = (query: CartQuery, cartItems: Partial<ICartItem>[]) =>
  handleCartItemOperation(query, null, { type: 'sync', cartItems });

export const mergeCart = async (
  userId: string,
  localCartItems: any[]
): Promise<ICart | null> => {
  try {
    let userCart = await getOrCreateCart({ user: userId });

    for (const localItem of localCartItems) {
      const itemIndex = userCart.items.findIndex(
        (item) => item.product.toString() === localItem.product._id
      );
      if (itemIndex !== -1) {
        userCart.items[itemIndex].quantity += localItem.quantity;
      } else {
        userCart.items.push({
          _id: new mongoose.Types.ObjectId(),
          product: new mongoose.Types.ObjectId(localItem.product._id),
          quantity: localItem.quantity,
        } as ICartItem);
      }
    }

    return await saveAndFetchCart(userCart, { user: userId });
  } catch (error) {
    logger.error('Failed to merge cart:', error);
    throw new Error('Failed to merge cart');
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
      { user: new mongoose.Types.ObjectId(userId) },
      { $addToSet: { items: { $each: guestCart.items } } },
      { new: true, upsert: true }
    ).populate('items.product');

    await guestCart.deleteOne();
    return userCart;
  } catch (error) {
    logger.error('Failed to convert guest cart to user cart:', error);
    throw new Error('Failed to convert guest cart to user cart');
  }
};
