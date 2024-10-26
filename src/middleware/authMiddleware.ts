import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/userModel';
import session from 'express-session';
import mongoose from 'mongoose';

// Extend the Request interface to include user_id
interface AuthenticatedRequest extends Request {
  session: session.Session & { user_id?: string };
  user_id?: string;
}

// Middleware to authenticate user
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if session exists and user_id is available
    const userId = req.session?.user_id;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.user_id = user._id.toString();
        return next();
      }
    }
    // If no user is found or session is missing, return 401 Unauthorized
    res.status(401).json({ message: 'User not authenticated' });
  } catch (error: unknown) {
    // Handle any potential errors during the user lookup
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Middleware to authorize based on user roles
export const roleMiddleware = (requiredRoles: UserRole[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user_id;
      if (userId) {
        const user = await User.findById(userId);
        if (user && requiredRoles.includes(user.role)) {
          return next(); // User has the required role, allow the request to proceed
        }
      }
      // If user does not have the required role, return 403 Forbidden
      res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
    } catch (error: unknown) {
      console.error('Error in roleMiddleware:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
