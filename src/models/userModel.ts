// Content from jw1:
// server/src/api/models/userModel.js

const mongoose = require('mongoose');
// const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  apartment: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
});

const userSchema = new mongoose.Schema({
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
  role: { type: String, enum: ['user', 'admin', 'vip'], default: 'user' },
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare candidate password with hashed password
/* userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}; */

const User = mongoose.model('User', userSchema);
module.exports = User;


// Content from jw2:
//Users/abiezerreyes/Projects/JewelryWebsite2/server/src/api/models/userModel.js

// Importing necessary libraries
const mongoose = require('mongoose');
// const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  apartment: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
});

const userSchema = new mongoose.Schema({
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
  role: { type: String, enum: ['user', 'admin', 'vip'], default: 'user' },
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare candidate password with hashed password
/* userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}; */

const User = mongoose.model('User', userSchema);
module.exports = User;


// Content from ec24:
// server/src/models/userModel.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

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

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  preferredFirstName: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  role: UserRole;
}

interface IUserModel extends Model<IUser> {
  // You can add any static methods here if needed
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

// Pre-save hook to hash the password
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare candidate password with hashed password
/* userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
}; */

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export { User, IUserModel };


// Content from ec3:


0a1,2
> <<<<<<< ./packages/server/src/models/userModel.ts
> =======
102a105
> >>>>>>> ./packages/server/src/models/modules/userModel.js
177a181,182
> <<<<<<< ./packages/server/src/models/userModel.ts
> =======
182a188
> >>>>>>> ./packages/server/src/models/modules/userModel.js
