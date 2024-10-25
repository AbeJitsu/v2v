// src/models/userModel.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface IAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  VIP = 'vip',
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  preferredFirstName: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  role: UserRole;
}

const addressSchema = new Schema<IAddress>({
  street: { type: String, required: true, trim: true },
  apartment: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
});

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: { type: String, required: true, minlength: 8 },
  preferredFirstName: { type: String, required: true, maxlength: 20 },
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
});

// Removed the password hashing hook and bcrypt code

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// Only export the User model here
export { User };
