import express, { Request, Response } from 'express';
import * as cartController from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';
import { ensureCartExists } from '../middleware/cartMiddleware';
import session from 'express-session';

const router = express.Router();

// Extend Request interface to include user_id
interface AuthenticatedRequest extends Request {
  session: session.Session & { user_id?: string };
  user_id?: string;
}

// Apply authentication middleware globally
router.use(authMiddleware);

// Define individual routes
router.get(
  '/',
  ensureCartExists,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user_id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const cart = await cartController.getCart({
      user: req.user_id,
      sessionToken: req.sessionID,
    });
    res.json(cart);
  }
);

router.post(
  '/add',
  ensureCartExists,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { productId, quantity } = req.body;
    if (!req.user_id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const updatedCart = await cartController.addItemToCart(
      { user: req.user_id, sessionToken: req.sessionID },
      productId,
      quantity
    );
    res.json(updatedCart);
  }
);

router.put(
  '/items/:productId',
  ensureCartExists,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!req.user_id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const updatedCart = await cartController.updateItemQuantity(
      { user: req.user_id, sessionToken: req.sessionID },
      productId,
      quantity
    );
    res.json(updatedCart);
  }
);

router.delete(
  '/items/:productId',
  ensureCartExists,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { productId } = req.params;
    if (!req.user_id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const updatedCart = await cartController.removeItemFromCart(
      { user: req.user_id, sessionToken: req.sessionID },
      productId
    );
    res.json(updatedCart);
  }
);

router.post(
  '/sync',
  ensureCartExists,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { cartItems } = req.body;
    if (!req.user_id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const updatedCart = await cartController.syncCart(
      { user: req.user_id, sessionToken: req.sessionID },
      cartItems
    );
    res.json(updatedCart);
  }
);

router.post(
  '/merge',
  ensureCartExists,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { localCartItems } = req.body;
    if (!req.user_id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const updatedCart = await cartController.mergeCart(
      req.user_id,
      localCartItems
    );
    res.json(updatedCart);
  }
);

export default router;
