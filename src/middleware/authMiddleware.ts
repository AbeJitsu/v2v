import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import session from 'express-session';

// The auth middleware to check if the user is authenticated
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if session exists and user_id is available
    if (req.session && req.session.user_id) {
      // Fetch the user from the database using the session's user_id
      const user = await User.findById(req.session.user_id);

      if (user) {
        // User exists, allow the request to proceed
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

// The role middleware to check if the user has the required role
export const roleMiddleware = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assuming `req.session.user_id` stores the authenticated user's ID
      if (req.session && req.session.user_id) {
        const user = await User.findById(req.session.user_id);

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
