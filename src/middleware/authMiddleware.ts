import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import session from 'express-session';

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.session && req.session.user_id) {
      // Check if session exists and user_id is available
      const user = await User.findById(req.session.user_id);
      if (user) {
        // If user is found, proceed to the next middleware
        return next();
      }
    }
    // If no user is found or session is missing, return 401 Unauthorized
    res.status(401).json({ message: 'User not authenticated' });
  } catch (error) {
    // Handle any potential errors during the user lookup
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
