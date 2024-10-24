<<<<<<< ./packages/server/src/middleware/auth/authMiddleware.ts
=======
// Content from jw1:
// server/src/api/middleware/auth/authMiddleware.js

const User = require('../../models/userModel');
const { logger } = require('../logger');

exports.authMiddleware = async (req, res, next) => {
  if (!req.session || !req.session.user_id) {
    logger.warn('Authentication failed: No session or user_id');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.session.user_id);
    if (!user) {
      logger.warn(`User not found for session user_id: ${req.session.user_id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    logger.debug(`User authenticated: ${user._id}`);
    next();
  } catch (error) {
    logger.error('Error in authMiddleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `Access denied for user: ${req.user ? req.user._id : 'unknown'}, required roles: ${roles}`
      );
      return res.status(403).json({ message: 'Access denied' });
    }
    logger.debug(
      `Role check passed for user: ${req.user._id}, role: ${req.user.role}`
    );
    next();
  };
};

// server/src/api/middleware/authMiddleware.js


// Content from jw2:
// server/src/api/middleware/auth/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

exports.authMiddleware = async (req, res, next) => {
  if (!req.session || !req.session.user_id) {
    console.log('authMiddleware: User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.session.user_id);
    if (!user) {
      console.log('authMiddleware: User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.user_id = user._id; // Ensure consistency
    console.log('authMiddleware: User authenticated', user._id);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log(
        'roleMiddleware: Access denied - insufficient role',
        req.user ? req.user.role : null
      );
      return res.status(403).json({ message: 'Access denied' });
    }
    console.log('Access granted - role:', req.user.role);
    next();
  };
};


// Content from ec24:
>>>>>>> ./packages/server/src/middleware/modules/authMiddleware.js
// src/middleware/auth/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { User, IUser, UserRole } from '../../models/userModel';
import { handleError } from '../../utils/responseUtils'; // Import handleError utility

// Extend the Express Request type to include user and user_id
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      user_id?: string;
    }
  }
}

// Extend the Express Session type to include user_id
declare module 'express-session' {
  interface SessionData {
    user_id?: string;
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.session || !req.session.user_id) {
    handleError(
      res,
      new Error('User not authenticated'),
      'User not authenticated',
      401
    );
    return;
  }

  try {
    const user = await User.findById(req.session.user_id).exec();
    if (!user) {
      handleError(res, new Error('User not found'), 'User not found', 401);
      return;
    }

    req.user = user;
    req.user_id = user._id.toString();
    next();
  } catch (error) {
    handleError(res, error as Error, 'Internal server error', 500);
  }
};

export const roleMiddleware = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      handleError(res, new Error('Access denied'), 'Access denied', 403);
      return;
    }
    next();
  };
};
<<<<<<< ./packages/server/src/middleware/auth/authMiddleware.ts
=======


// Content from ec3:


>>>>>>> ./packages/server/src/middleware/modules/authMiddleware.js
1,2d0
< <<<<<<< ./packages/server/src/middleware/auth/authMiddleware.ts
< =======
94d91
< >>>>>>> ./packages/server/src/middleware/modules/authMiddleware.js
157,158d153
< <<<<<<< ./packages/server/src/middleware/auth/authMiddleware.ts
< =======
164d158
< >>>>>>> ./packages/server/src/middleware/modules/authMiddleware.js
