import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/userModel';
import session from 'express-session';

interface AuthenticatedRequest extends Request {
  session: session.Session & { user_id?: string };
  user_id?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // const userId = req.session?.user_id;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.user_id = user._id.toString();
        return next();
      }
    }
    res.status(401).json({ message: 'User not authenticated' });
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

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
          return next();
        }
      }
      res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
    } catch (error) {
      console.error('Error in roleMiddleware:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

export { authMiddleware, roleMiddleware };
