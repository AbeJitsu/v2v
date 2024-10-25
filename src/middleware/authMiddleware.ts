// src/middleware/authMiddleware.ts

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
) => {
  try {
    // Check if session exists and user_id is available
    if (req.session && req.session.user_id) {
      // Fetch the user from the database using the session's user_id
      const user = await User.findById(req.session.user_id);

      if (user) {
        // Assign user_id to the request object for downstream use
        req.user_id = user._id.toString();
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
};

// Middleware to authorize based on user roles
export const roleMiddleware = (requiredRoles: UserRole[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Ensure user_id is available on the request object
      if (req.user_id) {
        const user = await User.findById(req.user_id);

        if (user && requiredRoles.includes(user.role)) {
          // User has the required role, allow the request to proceed
          return next();
        }
      }

      // If user does not have the required role, return 403 Forbidden
      res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
    } catch (error) {
      console.error('Error in roleMiddleware:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
