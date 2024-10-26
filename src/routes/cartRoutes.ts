import express from 'express';
import * as cartController from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';
import { ensureCartExists } from '../middleware/cartMiddleware';

const router = express.Router();

// Apply authentication middleware globally
router.use(authMiddleware);

// Define individual routes
router.get('/', ensureCartExists, async (req, res) => {
  const cart = await cartController.getCart({
    user: req.user_id,
    sessionToken: req.sessionID,
  });
  res.json(cart);
});

router.post('/add', ensureCartExists, async (req, res) => {
  const { productId, quantity } = req.body; // Expecting these in request body
  if (req.user_id) {
    const updatedCart = await cartController.addItemToCart(
      { user: req.user_id, sessionToken: req.sessionID },
      productId,
      quantity
    );
    res.json(updatedCart);
  } else {
    res.status(401).json({ error: 'User ID is required' });
  }
});

router.put('/items/:productId', ensureCartExists, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body; // Expecting quantity in request body
  if (req.user_id) {
    const updatedCart = await cartController.updateItemQuantity(
      { user: req.user_id, sessionToken: req.sessionID },
      productId,
      quantity
    );
    res.json(updatedCart);
  } else {
    res.status(401).json({ error: 'User ID is required' });
  }
});

router.delete('/items/:productId', ensureCartExists, async (req, res) => {
  const { productId } = req.params;
  if (req.user_id) {
    const updatedCart = await cartController.removeItemFromCart(
      { user: req.user_id, sessionToken: req.sessionID },
      productId
    );
    res.json(updatedCart);
  } else {
    res.status(401).json({ error: 'User ID is required' });
  }
});

router.post('/sync', async (req, res) => {
  const { cartItems } = req.body; // Expecting cartItems in request body
  if (req.user_id) {
    const updatedCart = await cartController.syncCart(
      { user: req.user_id, sessionToken: req.sessionID },
      cartItems
    );
    res.json(updatedCart);
  } else {
    res.status(401).json({ error: 'User ID is required' });
  }
});

router.post('/merge', async (req, res) => {
  const { localCartItems } = req.body; // Expecting localCartItems in request body
  if (req.user_id) {
    const updatedCart = await cartController.mergeCart(
      req.user_id,
      localCartItems
    );
    res.json(updatedCart);
  } else {
    res.status(401).json({ error: 'User ID is required' });
  }
});

// Export the router
export default router;
