// src/tests/unit/controllers/userController.test.ts

import { Request, Response } from 'express';
import {
  updateAddress,
  getAddress,
} from '../../../src/controllers/userController';
import { IUser, UserRole } from '../../../src/models/userModel';
import { Types } from 'mongoose';

// Fully mock the User model without redefining UserRole
jest.mock('../../../src/models/userModel', () => {
  const actualModule = jest.requireActual('../../../src/models/userModel');
  return {
    __esModule: true,
    ...actualModule,
    User: {
      findByIdAndUpdate: jest.fn(),
      findById: jest.fn(),
    },
  };
});

let req: Partial<Request>;
let res: Partial<Response>;

const initializeRequestResponse = () => {
  req = {
    user: {
      _id: new Types.ObjectId('64b0c3c73f1c9a5d5b5e62b1'),
      email: 'test@example.com',
      password: 'password123',
      preferredFirstName: 'John',
      role: UserRole.USER, // Accessing directly from imported UserRole
    } as IUser,
    body: {
      billingAddress: '123 Main St',
      shippingAddress: '456 Market St',
    },
  };

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
};

beforeEach(() => {
  initializeRequestResponse();
});

describe('UserController Unit Tests', () => {
  const { User } = require('../../../src/models/userModel'); // Direct import in test scope

  test('should update user address successfully', async () => {
    User.findByIdAndUpdate.mockResolvedValue({ _id: 'user123' });
    await updateAddress(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should return 404 if user not found during address update', async () => {
    User.findByIdAndUpdate.mockResolvedValue(null);
    await updateAddress(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should retrieve user address successfully', async () => {
    User.findById.mockResolvedValue({
      billingAddress: '123 Main St',
      shippingAddress: '456 Market St',
    });
    await getAddress(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
