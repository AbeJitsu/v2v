import { Request, Response, NextFunction } from 'express';
import { placeholderController } from '../controllers';

// Assuming `logger` is attached to the request object
export const placeholderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logger.info('Placeholder middleware reached');
  next(); // Pass control to the next middleware/controller
};

// Route that uses both middleware and controller
export const middlewareControllerRoute = [
  placeholderMiddleware,
  placeholderController,
];
