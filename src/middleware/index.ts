import { Request, Response, NextFunction } from 'express';
import { placeholderController } from '../controllers';

// Placeholder export to verify the middleware index file is connected.
export const placeholderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Placeholder middleware reached');
  next(); // Pass control to the next middleware/controller
};

// Route that uses both middleware and controller
export const middlewareControllerRoute = [placeholderMiddleware, placeholderController];
