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

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionToken: { type: String },
    items: [CartItemSchema],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

const Cart = mongoose.model<ICart>('Cart', CartSchema);
export default Cart;
