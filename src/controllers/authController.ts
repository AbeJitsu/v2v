import { Request, Response } from 'express';
import { Session } from 'express-session';
// import { logger } from '../middleware/logger'; // Placeholder
// import * as authService from '../services/authService'; // Placeholder, service to be added later
// import * as userService from '../services/userService'; // Placeholder, service to be added later
// import * as cartService from '../services/cartService'; // Placeholder, service to be added later
// import { IUser, UserRole } from '../models/userModel'; // Placeholder, model to be added later
import { handleError, handleSuccess } from '../utils/responseUtils';
import { UTIL_PATHS } from '../constants/PathConstants'; // Import paths from PathConstants
import { validateInput } from '../utils/validationUtils';

// Define types for request body
interface AuthRequestBody {
  email: string;
  password: string;
  preferredFirstName?: string;
}

// Define interface for an authenticated request
interface AuthenticatedRequest extends Request {
  session: Session & { user_id?: string };
  sessionID: string;
  user_id?: string;
}

// Placeholder function for handling errors
const handleAuthError = (res: Response, error: any, message: string) => {
  // logger.error(message, { error }); // Commented out logger
  handleError(res, error, message); // Placeholder for error handling utility
};

// Register a new user (refactored)
export const register = async (req: Request, res: Response) => {
  const { email, password, preferredFirstName } =
    req.body as Partial<AuthRequestBody>;
  const validation = validateInput({ email, password });
  if (!validation.valid) {
    return handleAuthError(
      res,
      new Error(validation.error!),
      validation.error!
    );
  }

  try {
    // const existingUser = await userService.getUserByEmail(email!); // Placeholder
    if (false) {
      // Replace with actual condition once userService is added
      return handleAuthError(
        res,
        new Error('User already exists'),
        'User already exists'
      );
    }

    // const hashedPassword = await authService.hashPassword(password!); // Placeholder
    // const newUser = await userService.createUser({ email: email!, password: hashedPassword, preferredFirstName }); // Placeholder
    // logger.info('User registered successfully'); // Commented out logger
    handleSuccess(res, 'User registered successfully. Please log in.', {}, 201); // Placeholder
  } catch (error) {
    handleAuthError(res, error, 'An error occurred during registration');
  }
};

// Login functionality (refactored)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as Partial<AuthRequestBody>;
  const validation = validateInput({ email, password });
  if (!validation.valid) {
    return handleAuthError(
      res,
      new Error(validation.error!),
      validation.error!
    );
  }

  try {
    // const user = await userService.getUserByEmail(email!); // Placeholder
    if (false) {
      // Replace with actual logic
      return handleAuthError(
        res,
        new Error('Invalid credentials'),
        'Invalid email and/or password'
      );
    }

    // Token and session logic to be added later
    // logger.info(`User logged in successfully`); // Commented out logger
    handleSuccess(res, 'Login successful', {}); // Placeholder
  } catch (error) {
    handleAuthError(res, error, 'An internal error occurred during login');
  }
};

// Logout functionality
export const logout = async (req: AuthenticatedRequest, res: Response) => {
  // logger.debug('Logging out user with session ID:', { session: req.session }); // Commented out logger
  if (!req.session) {
    return handleError(
      res,
      new Error('No session found'),
      'No session found',
      400
    );
  }

  req.session.destroy((err: Error | null) => {
    if (err) {
      return handleAuthError(res, err, 'Failed to log out, please try again');
    }
    res.clearCookie('connect.sid');
    // logger.info(`User logged out successfully`); // Commented out logger
    handleSuccess(res, 'Logged out successfully');
  });
};

// Fetch user profile
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user_id) {
    return handleError(
      res,
      new Error('User not authenticated'),
      'User not authenticated',
      401
    );
  }

  try {
    // const user: IUser | null = await userService.getUserById(req.user_id); // Placeholder
    if (false) {
      // Replace with actual logic
      return handleError(
        res,
        new Error('User not found'),
        'User not found',
        404
      );
    }

    // logger.info(`User profile fetched successfully`); // Commented out logger
    handleSuccess(res, 'User profile fetched successfully', {
      preferredFirstName: 'User First Name', // Placeholder
      email: 'user@example.com', // Placeholder
      role: 'UserRole', // Placeholder
    });
  } catch (error) {
    handleAuthError(
      res,
      error,
      'An internal error occurred during fetching user profile'
    );
  }
};

// Change user role
// export const changeUserRole = async (req: AuthenticatedRequest, res: Response) => {
//   const { userId, role } = req.body;
//   if (!Object.values(UserRole).includes(role)) {
//     return handleError(res, new Error('Invalid role'), 'Invalid role', 400);
//   }

//   try {
//     // const user: IUser | null = await userService.getUserById(userId); // Placeholder
//     if (false) {
//       // Replace with actual logic
//       return handleError(
//         res,
//         new Error('User not found'),
//         'User not found',
//         404
//       );
//     }

//     // Logic for updating user role to be added later
//     // logger.info(`User role updated successfully`); // Commented out logger
//     handleSuccess(res, 'User role updated successfully');
//   } catch (error) {
//     handleAuthError(res, error, 'Error updating user role');
//   }
// };





// src/controllers/authController.ts

import { validateInput } from '../utils/validationUtils';

// Example usage:
const validation = validateInput(email, password);  // Call with individual arguments
if (!validation.valid) {
  throw new Error(validation.error!);
}


Fix in authController.ts

Ensure you’re passing email and password separately and handling the return value correctly.

This will match the updated validateInput function. You can now re-run the tests after these changes.