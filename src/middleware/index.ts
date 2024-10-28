import { Request, Response, NextFunction } from 'express';

// Placeholder export to verify the middleware index file is connected.
export const placeholderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Placeholder middleware reached');
  res.status(200).json({ status: 'OK with middleware' }); // Modify response here
  next();
};
