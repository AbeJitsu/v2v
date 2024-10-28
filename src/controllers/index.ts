 // src/controllers/index.ts

import { Request, Response } from 'express';

// Placeholder controller function for testing
export const placeholderController = (req: Request, res: Response) => {
  console.log('Placeholder controller reached');
  res.status(200).json({ status: 'OK from service' });
};