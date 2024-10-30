import { Router } from 'express';
import { API_PATHS } from '../constants/PathConstants'; // Import path constants

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
router.get(API_PATHS.HEALTH_CHECK, middlewareControllerRoute); // Use constant for the health check path

// Integrated session routes under the /sessions path
router.use('/sessions', sessionRoutes);

// Use each set of routes with /api prefix
// router.use(API_PATHS.USER, userRoutes);
// router.use(API_PATHS.PRODUCT, productRoutes);
// Further API routes can be updated similarly using API_PATHS constants

export default router;
