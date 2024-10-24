// src/controllers/authController.ts

import { Request, Response } from 'express';
import { Session } from 'express-session';
import { handleError, handleSuccess } from '../utils/responseUtils';
import { validateInput } from '../utils/validationUtils';
import { UserRole } from '../models/userModel';

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

// Helper function for handling errors
const handleAuthError = (res: Response, error: any, message: string) => {
  handleError(res, error, message);
};

// Register a new user
const register = async (req: Request, res: Response) => {
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
    // Placeholder logic: Replace with actual user existence check
    if (false) {
      return handleAuthError(
        res,
        new Error('User already exists'),
        'User already exists'
      );
    }

    // Simulate successful registration
    handleSuccess(res, 'User registered successfully. Please log in.', {}, 201);
  } catch (error) {
    handleAuthError(res, error, 'An error occurred during registration');
  }
};

// Login functionality
const login = async (req: Request, res: Response) => {
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
    // Simulate successful login
    handleSuccess(res, 'Login successful', {});
  } catch (error) {
    handleAuthError(res, error, 'An internal error occurred during login');
  }
};

// Logout functionality
const logout = async (req: AuthenticatedRequest, res: Response) => {
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
    handleSuccess(res, 'Logged out successfully');
  });
};

// Fetch user profile
const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user_id) {
    return handleError(
      res,
      new Error('User not authenticated'),
      'User not authenticated',
      401
    );
  }

  try {
    // Simulate fetching user profile
    handleSuccess(res, 'User profile fetched successfully', {
      preferredFirstName: 'User First Name', // Placeholder
      email: 'user@example.com', // Placeholder
      role: 'user', // Placeholder
    });
  } catch (error) {
    handleAuthError(
      res,
      error,
      'An internal error occurred while fetching user profile'
    );
  }
};

// Change user role
const changeUserRole = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { userId, newRole } = req.body;

  if (!Object.values(UserRole).includes(newRole)) {
    res.status(400).json({ message: 'Invalid role' });
    return;
  }

  try {
    // Simulate user role change logic
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// Export all controller functions collectively
export { register, login, logout, getUserProfile, changeUserRole };
