import { User, IUser } from '../models/userModel';
import { handleDbOperation } from '../utils/dbUtils';
import { Types } from 'mongoose'; // Ensure this import is present

// Create a new user
export const createUser = async (userData: IUser) => {
  // Ensure userData._id is a Types.ObjectId
  userData._id = new Types.ObjectId(); // Assign a new ObjectId if not provided
  return handleDbOperation(
    () => new User(userData).save(),
    'User created successfully'
  );
};

// Get a user by ID
export const getUserById = async (userId: string) => {
  return handleDbOperation(
    () => User.findById(userId),
    'User fetched successfully by ID'
  );
};

// Update an existing user
export const updateUser = async (
  userId: string,
  updateData: Partial<IUser>
) => {
  return handleDbOperation(
    () => User.findByIdAndUpdate(userId, updateData, { new: true }),
    'User updated successfully'
  );
};

// Delete a user by ID
export const deleteUser = async (userId: string) => {
  return handleDbOperation(
    () => User.findByIdAndDelete(userId),
    'User deleted successfully'
  );
};

// Get a user by email
export const getUserByEmail = async (email: string) => {
  const sanitizedEmail = email.trim().toLowerCase();
  return handleDbOperation(
    () => User.findOne({ email: sanitizedEmail }),
    `User fetched successfully by email: ${sanitizedEmail}`
  );
};
