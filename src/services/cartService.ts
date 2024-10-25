import mongoose, { FilterQuery } from 'mongoose';
import Cart, { ICart, ICartItem } from '../models/cartModel';

interface CartQuery {
  user?: mongoose.Types.ObjectId;
}

// Fetches an existing cart
export const getCart = async (query: CartQuery): Promise<ICart | null> => {
  return await Cart.findOne(query as FilterQuery<ICart>);
};

// Adds a new item to the cart or creates the cart if it doesn't exist
export const addItemToCart = async (
  query: CartQuery,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  let cart = await getCart(query);

  if (!cart) {
    cart = new Cart({
      user: query.user,
      items: [],
    });
  }

  // Ensure item conforms to ICartItem with an _id
  cart.items.push({
    _id: new mongoose.Types.ObjectId(), // Add _id field to conform to ICartItem
    product: new mongoose.Types.ObjectId(productId),
    quantity,
  } as ICartItem);

  await cart.save();
  return cart;
};
