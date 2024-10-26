import { Request, Response, NextFunction } from 'express';
import Cart, { ICart } from '../models/cartModel';

// Extend Express Request and Session types
declare global {
  namespace Express {
    interface Request {
      cart?: ICart;
      user_id?: string;
      sessionID: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user_id?: string;
  }
}

export const ensureCartExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.session.user_id || req.user_id;
    const sessionToken = req.sessionID;
    const cartCriteria = userId ? { user: userId } : { sessionToken };

    // Try to find or create a cart based on criteria
    let cart =
      (await Cart.findOne(cartCriteria)) ||
      new Cart({
        user: userId || undefined, // Ensure this is either a string or undefined
        sessionToken: userId ? undefined : sessionToken, // Change null to undefined
      });

    if (cart.isNew) {
      await cart.save(); // Save only if new
    }

    req.cart = cart;
    next();
  } catch (error: unknown) {
    console.error('Error ensuring cart exists:', error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: 'Failed to ensure cart', error: error.message });
    } else {
      res
        .status(500)
        .json({
          message: 'Failed to ensure cart',
          error: 'Unknown error occurred',
        });
    }
  }
};
