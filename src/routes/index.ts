import { Router } from 'express';

import { placeholderMiddleware } from '../middleware';

// import authRoutes from './authRoutes';
// import cartRoutes from './cartRoutes';
// import diagnosticRoutes from './diagnosticRoutes';
// import environmentRoutes from './environmentRoutes';
// import paymentRoutes from './paymentRoutes';
// import productRoutes from './productRoutes';
// import searchRoutes from './searchRoutes';
// import userRoutes from './userRoutes';

const router = Router();

// Health check endpoint for testing purposes
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Use each set of routes with /api prefix
// router.use('/api/auth', authRoutes);
// router.use('/api/cart', cartRoutes);
// router.use('/api/diagnostic', diagnosticRoutes);
// router.use('/api/environment', environmentRoutes);
// router.use('/api/payment', paymentRoutes);
// router.use('/api/products', productRoutes);
// router.use('/api/search', searchRoutes);
// router.use('/api/user', userRoutes);

export default router;
