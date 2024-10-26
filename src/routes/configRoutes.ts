// src/routes/configRoutes.ts

import { Application } from 'express';
import authRoutes from './authRoutes';
import cartRoutes from './cartRoutes';
import productRoutes from './productRoutes';
import paymentRoutes from './paymentRoutes';
import searchRoutes from './searchRoutes';
import testPageRoutes from './testPageRoutes';
import userRoutes from './userRoutes';

const configureRoutes = (app: Application): void => {
  // Setup routes prefixed with /api
  app.use('/api/auth', authRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/test-page', testPageRoutes);
  app.use('/api/user', userRoutes);
};

export default configureRoutes;
