import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} from '../../../src/services/userService';
import { User, IUser, UserRole } from '../../../src/models/userModel'; // Ensure UserRole is imported
import { handleDbOperation } from '../../../src/utils/dbUtils';
import { Types } from 'mongoose'; // Import Types for ObjectId

jest.mock('../../../src/models/userModel');
jest.mock('../../../src/utils/dbUtils');

describe('UserService Unit Tests', () => {
  const mockUser: IUser = {
    _id: new Types.ObjectId(), // Use ObjectId
    email: 'test@example.com',
    password: 'password123',
    preferredFirstName: 'John',
    billingAddress: {
      street: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zip: '12345',
    },
    shippingAddress: {
      street: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zip: '12345',
    },
    role: UserRole.USER, // Use the enum value directly
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      (handleDbOperation as jest.Mock).mockResolvedValue(mockUser);

      const userData: IUser = { ...mockUser }; // Ensure userData is a proper IUser
      const result = await createUser(userData);

      expect(handleDbOperation).toHaveBeenCalledWith(
        expect.any(Function),
        'User created successfully'
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      (handleDbOperation as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserById(mockUser._id.toString());

      expect(handleDbOperation).toHaveBeenCalledWith(
        expect.any(Function),
        'User fetched successfully by ID'
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      (handleDbOperation as jest.Mock).mockRejectedValue(
        new Error('User not found')
      );

      await expect(getUserById('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updatedUser = { ...mockUser, preferredFirstName: 'UpdatedName' };
      (handleDbOperation as jest.Mock).mockResolvedValue(updatedUser);

      const result = await updateUser(mockUser._id.toString(), {
        preferredFirstName: 'UpdatedName',
      });

      expect(result).not.toBeNull();
      expect(result?.preferredFirstName).toEqual('UpdatedName');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      (handleDbOperation as jest.Mock).mockResolvedValue(mockUser);

      const result = await deleteUser(mockUser._id.toString());

      expect(handleDbOperation).toHaveBeenCalledWith(
        expect.any(Function),
        'User deleted successfully'
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      (handleDbOperation as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserByEmail('test@example.com');

      expect(handleDbOperation).toHaveBeenCalledWith(
        expect.any(Function),
        'User fetched successfully by email: test@example.com'
      );
      expect(result).toEqual(mockUser);
    });
  });
});
