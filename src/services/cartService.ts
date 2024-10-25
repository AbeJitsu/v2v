import mongoose, { FilterQuery } from 'mongoose';
import Cart, { ICart } from '../models/cartModel';
import Product from '../models/productModel';
import { logger } from '../middleware/logger';

// Generalized error handler
const handleServiceError = (message: string, error: any) => {
  logger.error(message, error);
  throw new Error(message);
};

// Fetch or create cart
const getOrCreateCart = async (query: FilterQuery<ICart>): Promise<ICart> => {
  let cart = await Cart.findOne(query).populate('items.product');
  if (!cart) {
    cart = new Cart({
      user: query.user,
      sessionToken: query.sessionToken,
      items: [],
    });
  }
  return cart;
};

// Save and fetch updated cart
const saveAndFetchCart = async (
  cart: ICart,
  query: FilterQuery<ICart>
): Promise<ICart> => {
  await cart.save();
  return await Cart.findOne(query).populate('items.product');
};

// Modify items in cart
const modifyCartItems = (
  cart: ICart,
  productId: string,
  operation: { type: 'add' | 'update' | 'remove'; quantity?: number }
) => {
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (operation.type === 'add' && operation.quantity) {
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += operation.quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity: operation.quantity,
      });
    }
  } else if (
    operation.type === 'update' &&
    operation.quantity &&
    itemIndex > -1
  ) {
    cart.items[itemIndex].quantity = operation.quantity;
  } else if (operation.type === 'remove' && itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
  }
};

// Cart functions
export const getCart = async (
  query: FilterQuery<ICart>
): Promise<ICart | null> => {
  try {
    return await Cart.findOne(query).populate('items.product');
  } catch (error) {
    handleServiceError('Failed to fetch cart', error);
  }
};

export const addItemToCart = async (
  query: FilterQuery<ICart>,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  try {
    const cart = await getOrCreateCart(query);
    modifyCartItems(cart, productId, { type: 'add', quantity });
    return await saveAndFetchCart(cart, query);
  } catch (error) {
    handleServiceError('Failed to add item to cart', error);
  }
};

export const updateItemQuantity = async (
  query: FilterQuery<ICart>,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  try {
    const cart = await getOrCreateCart(query);
    modifyCartItems(cart, productId, { type: 'update', quantity });
    return await saveAndFetchCart(cart, query);
  } catch (error) {
    handleServiceError('Failed to update item quantity', error);
  }
};

export const removeItemFromCart = async (
  query: FilterQuery<ICart>,
  productId: string
): Promise<ICart | null> => {
  try {
    const cart = await getOrCreateCart(query);
    modifyCartItems(cart, productId, { type: 'remove' });
    return await saveAndFetchCart(cart, query);
  } catch (error) {
    handleServiceError('Failed to remove item from cart', error);
  }
};

export const syncCart = async (
  query: FilterQuery<ICart>,
  cartItems: any[]
): Promise<ICart | null> => {
  try {
    const cart = await getOrCreateCart(query);
    cart.items = cartItems.map((item) => ({
      product: new mongoose.Types.ObjectId(item.product),
      quantity: item.quantity,
    }));
    return await saveAndFetchCart(cart, query);
  } catch (error) {
    handleServiceError('Failed to sync cart', error);
  }
};

export const mergeCart = async (
  userId: string,
  localCartItems: any[]
): Promise<ICart | null> => {
  try {
    const userCart = await getOrCreateCart({ user: userId });
    localCartItems.forEach((localItem) => {
      const itemIndex = userCart.items.findIndex(
        (item) => item.product.toString() === localItem.product._id
      );
      if (itemIndex > -1) {
        userCart.items[itemIndex].quantity += localItem.quantity;
      } else {
        userCart.items.push({
          product: new mongoose.Types.ObjectId(localItem.product._id),
          quantity: localItem.quantity,
        });
      }
    });
    return await saveAndFetchCart(userCart, { user: userId });
  } catch (error) {
    handleServiceError('Failed to merge cart', error);
  }
};

export const convertGuestCartToUserCart = async (
  sessionToken: string,
  userId: string
): Promise<ICart | null> => {
  try {
    const guestCart = await Cart.findOne({ sessionToken }).populate(
      'items.product'
    );
    if (!guestCart) return null;

    guestCart.user = userId;
    guestCart.sessionToken = null;

    const userCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $addToSet: { items: { $each: guestCart.items } } },
      { new: true, upsert: true }
    ).populate('items.product');

    await guestCart.deleteOne();
    return userCart;
  } catch (error) {
    handleServiceError('Failed to convert guest cart to user cart', error);
  }
};
