import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem extends Document {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user?: Types.ObjectId;
  sessionToken?: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// CartItem schema definition
const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

// Cart schema definition
const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionToken: { type: String, default: null },
    items: { type: [CartItemSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema); // Named export
export default Cart; // Optional default export for compatibility
