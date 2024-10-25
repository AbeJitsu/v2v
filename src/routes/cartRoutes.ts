import express from 'express';
import * as cartController from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';
import { ensureCartExists } from '../middleware/cartMiddleware';

const router = express.Router();

// Apply authentication middleware globally
router.use(authMiddleware);

// Define individual routes
router.get('/', ensureCartExists, cartController.getCart);
router.post('/add', ensureCartExists, cartController.addItemToCart);
router.put(
  '/items/:productId',
  ensureCartExists,
  cartController.updateItemQuantity
);
router.delete(
  '/items/:productId',
  ensureCartExists,
  cartController.removeItemFromCart
);
router.post('/sync', cartController.syncCart);
router.post('/merge', cartController.mergeCart);

export default router;
