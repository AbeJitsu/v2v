const mongoose = require('mongoose');
const moment = require('moment-timezone');

const productSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    bodyHtml: { type: String, trim: true },
    vendor: { type: String, trim: true },
    type: {
      type: String,
      enum: ['zi', 'fashion-fix', 'everyday'],
      default: 'everyday',
    },
    variantSKU: { type: String, trim: true },
    variantPrice: { type: Number, min: 0 },
    imageSrc: [{ type: String, trim: true }],
    imagePosition: [{ type: Number, min: 0 }],
    quantity: { type: Number, default: 1, min: 0 },
    status: {
      type: String,
      enum: ['available', 'in cart', 'purchased'],
      default: 'available',
    },
    colors: [{ type: String, trim: true }],
    materials: [{ type: String, trim: true }],
    looks: [{ type: String, trim: true }],
    styles: [{ type: String, trim: true }],
    reservationDeadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.variantPrice === 25) {
    this.type = 'zi';
  } else if (
    this.variantPrice === 20 ||
    (this.bodyHtml && this.bodyHtml.toLowerCase().includes('fashion-fix'))
  ) {
    this.type = 'fashion-fix';
  } else {
    this.type = 'everyday';
  }
  next();
});

productSchema.methods.reserve = function () {
  return new Promise((resolve, reject) => {
    if (this.quantity > 0 && this.status === 'available') {
      this.status = 'in cart';
      this.reservationDeadline = moment()
        .tz('America/New_York')
        .add(4, 'days')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate();
      this.save()
        .then((product) => resolve(product))
        .catch((err) => reject(err));
    } else {
      reject(new Error('Product is not available for reservation'));
    }
  });
};

productSchema.methods.releaseReservation = function () {
  return new Promise((resolve, reject) => {
    if (this.status === 'in cart') {
      this.status = 'available';
      this.reservationDeadline = null;
      this.save()
        .then((product) => resolve(product))
        .catch((err) => reject(err));
    } else {
      reject(new Error('Product is not currently reserved'));
    }
  });
};

productSchema.statics.findByType = function (type) {
  return this.find({ type });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
// Content from jw1:
// server/src/api/models/productModel.js

const mongoose = require('mongoose');
const moment = require('moment-timezone');

const productSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  bodyHtml: String,
  vendor: String,
  type: {
    type: String,
    enum: ['zi', 'fashion-fix', 'everyday'],
    default: 'everyday',
  },
  variantSKU: String,
  variantPrice: Number,
  imageSrc: [String],
  imagePosition: [Number],
  quantity: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['available', 'in cart', 'purchased'],
    default: 'available',
  },
  colors: [{ type: String }],
  materials: [{ type: String }],
  looks: [{ type: String }],
  styles: [{ type: String }],
  reservationDeadline: {
    type: Date,
    default: () =>
      moment()
        .tz('America/New_York')
        .add(4, 'days')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(), // Default to next Wednesday at noon
  },
});

productSchema.pre('save', function (next) {
  if (this.variantPrice == 25) {
    this.type = 'zi';
  } else if (
    this.variantPrice == 20 ||
    this.bodyHtml.toLowerCase().includes('fashion-fix')
  ) {
    this.type = 'fashion-fix';
  } else {
    this.type = 'everyday';
  }
  next();
});

productSchema.methods.reserve = function () {
  if (this.quantity > 0 && this.status == 'available') {
    this.status = 'in cart';
    this.reservationDeadline = moment()
      .tz('America/New_York')
      .add(4, 'days')
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate(); // Adjust based on the cart clearance logic
    return this.save();
  }
};

productSchema.methods.releaseReservation = function () {
  if (this.status === 'in cart') {
    this.status = 'available';
    this.reservationDeadline = null;
    return this.save();
  }
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


// Content from jw2:
// /Users/abiezerreyes/Projects/JewelryWebsite2/server/src/api/models/ProductModel.js

const mongoose = require('mongoose');
const moment = require('moment-timezone');

const productSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  bodyHtml: String,
  vendor: String,
  type: {
    type: String,
    enum: ['zi', 'fashion-fix', 'everyday'],
    default: 'everyday',
  },
  variantSKU: String,
  variantPrice: Number,
  imageSrc: [String],
  imagePosition: [Number],
  quantity: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['available', 'in cart', 'purchased'],
    default: 'available',
  },
  colors: [{ type: String }],
  materials: [{ type: String }],
  looks: [{ type: String }],
  styles: [{ type: String }],
  reservationDeadline: {
    type: Date,
    default: () =>
      moment()
        .tz('America/New_York')
        .add(4, 'days')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(), // Default to next Wednesday at noon
  },
});

productSchema.pre('save', function (next) {
  if (this.variantPrice == 25) {
    this.type = 'zi';
  } else if (
    this.variantPrice == 20 ||
    this.bodyHtml.toLowerCase().includes('fashion-fix')
  ) {
    this.type = 'fashion-fix';
  } else {
    this.type = 'everyday';
  }
  next();
});

productSchema.methods.reserve = function () {
  if (this.quantity > 0 && this.status == 'available') {
    this.status = 'in cart';
    this.reservationDeadline = moment()
      .tz('America/New_York')
      .add(4, 'days')
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate(); // Adjust based on the cart clearance logic
    return this.save();
  }
};

productSchema.methods.releaseReservation = function () {
  if (this.status === 'in cart') {
    this.status = 'available';
    this.reservationDeadline = null;
    return this.save();
  }
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


// Content from ec24:
// server/src/models/productModel.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import moment from 'moment-timezone';

export interface IProduct extends Document {
  handle: string;
  title: string;
  bodyHtml?: string;
  vendor?: string;
  type: 'zi' | 'fashion-fix' | 'everyday';
  variantSKU?: string;
  variantPrice?: number;
  imageSrc: string[];
  imagePosition: number[];
  quantity: number;
  status: 'available' | 'in cart' | 'purchased';
  colors: string[];
  materials: string[];
  looks: string[];
  styles: string[];
  reservationDeadline: Date | null;
  reserve(): Promise<IProduct>;
  releaseReservation(): Promise<IProduct>;
}

interface IProductModel extends Model<IProduct> {
  // You can add any static methods here if needed
}

const productSchema = new Schema<IProduct>({
  handle: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  bodyHtml: String,
  vendor: String,
  type: {
    type: String,
    enum: ['zi', 'fashion-fix', 'everyday'],
    default: 'everyday',
  },
  variantSKU: String,
  variantPrice: Number,
  imageSrc: [String],
  imagePosition: [Number],
  quantity: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['available', 'in cart', 'purchased'],
    default: 'available',
  },
  colors: [{ type: String }],
  materials: [{ type: String }],
  looks: [{ type: String }],
  styles: [{ type: String }],
  reservationDeadline: {
    type: Date,
    default: () =>
      moment()
        .tz('America/New_York')
        .add(4, 'days')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate(),
  },
});

productSchema.pre<IProduct>('save', function (next) {
  if (this.variantPrice === 25) {
    this.type = 'zi';
  } else if (
    this.variantPrice === 20 ||
    (this.bodyHtml && this.bodyHtml.toLowerCase().includes('fashion-fix'))
  ) {
    this.type = 'fashion-fix';
  } else {
    this.type = 'everyday';
  }
  next();
});

productSchema.methods.reserve = function (this: IProduct): Promise<IProduct> {
  if (this.quantity > 0 && this.status === 'available') {
    this.status = 'in cart';
    this.reservationDeadline = moment()
      .tz('America/New_York')
      .add(4, 'days')
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();
    return this.save();
  }
  return Promise.resolve(this);
};

productSchema.methods.releaseReservation = function (
  this: IProduct
): Promise<IProduct> {
  if (this.status === 'in cart') {
    this.status = 'available';
    this.reservationDeadline = null;
    return this.save();
  }
  return Promise.resolve(this);
};

const Product = mongoose.model<IProduct, IProductModel>(
  'Product',
  productSchema
);

export default Product;


// Content from ec3:
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const productSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    bodyHtml: { type: String, trim: true },
    vendor: { type: String, trim: true },
    type: {
      type: String,
      enum: ['zi', 'fashion-fix', 'everyday'],
      default: 'everyday',
    },
    variantSKU: { type: String, trim: true },
    variantPrice: { type: Number, min: 0 },
    imageSrc: [{ type: String, trim: true }],
    imagePosition: [{ type: Number, min: 0 }],
    quantity: { type: Number, default: 1, min: 0 },
    status: {
      type: String,
      enum: ['available', 'in cart', 'purchased'],
      default: 'available',
    },
    colors: [{ type: String, trim: true }],
    materials: [{ type: String, trim: true }],
    looks: [{ type: String, trim: true }],
    styles: [{ type: String, trim: true }],
    reservationDeadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.variantPrice === 25) {
    this.type = 'zi';
  } else if (
    this.variantPrice === 20 ||
    (this.bodyHtml && this.bodyHtml.toLowerCase().includes('fashion-fix'))
  ) {
    this.type = 'fashion-fix';
  } else {
    this.type = 'everyday';
  }
  next();
});

productSchema.methods.reserve = function () {
  return new Promise((resolve, reject) => {
    if (this.quantity > 0 && this.status === 'available') {
      this.status = 'in cart';
      this.reservationDeadline = moment()
        .tz('America/New_York')
        .add(4, 'days')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate();
      this.save()
        .then((product) => resolve(product))
        .catch((err) => reject(err));
    } else {
      reject(new Error('Product is not available for reservation'));
    }
  });
};

productSchema.methods.releaseReservation = function () {
  return new Promise((resolve, reject) => {
    if (this.status === 'in cart') {
      this.status = 'available';
      this.reservationDeadline = null;
      this.save()
        .then((product) => resolve(product))
        .catch((err) => reject(err));
    } else {
      reject(new Error('Product is not currently reserved'));
    }
  });
};

productSchema.statics.findByType = function (type) {
  return this.find({ type });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


0a1,2
> <<<<<<< ./packages/server/src/models/productModel.ts
> =======
267a270
> >>>>>>> ./packages/server/src/models/modules/productModel.js
382a386,387
> <<<<<<< ./packages/server/src/models/productModel.ts
> =======
481a487
> >>>>>>> ./packages/server/src/models/modules/productModel.js
