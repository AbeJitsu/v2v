import { Router } from 'express';

import { middlewareControllerRoute } from '../middleware';
import sessionRoutes from './sessionRoutes';
// Import placeholderController if it's used directly, else handled in middleware
// import { placeholderController } from '../controllers';

// import authRoutes from './authRoutes';
// import cartRoutes from './cartRoutes';
// import diagnosticRoutes from './diagnosticRoutes';
// import environmentRoutes from './environmentRoutes';
// import paymentRoutes from './paymentRoutes';
// import productRoutes from './productRoutes';
// import searchRoutes from './searchRoutes';
// import userRoutes from './userRoutes';

const router = Router();

// Health check endpoint for testing with middleware-controller connection
router.get('/health', middlewareControllerRoute);

// Integrated session routes under the /sessions path
router.use('/sessions', sessionRoutes);

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
