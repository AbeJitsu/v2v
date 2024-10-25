import { Request, Response } from 'express';
import {
  updateAddress,
  getAddress,
} from '../../src/controllers/userController';

// Fully mock the User model
jest.mock('../../src/models/userModel', () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
  },
}));

let req: any;
let res: any;

beforeEach(() => {
  req = {
    user: {
      _id: 'user123',
    },
    body: {
      billingAddress: '123 Main St',
      shippingAddress: '456 Market St',
    },
  };

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(), // Mock the send function to handle res.send()
  };
});

describe('UserController Unit Tests', () => {
  test('should update user address successfully', async () => {
    const { User } = require('../../src/models/userModel');
    User.findByIdAndUpdate.mockResolvedValue({ _id: 'user123' });

    await updateAddress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should return 404 if user not found during address update', async () => {
    const { User } = require('../../src/models/userModel');
    User.findByIdAndUpdate.mockResolvedValue(null);

    await updateAddress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should retrieve user address successfully', async () => {
    const { User } = require('../../src/models/userModel');
    User.findById.mockResolvedValue({
      billingAddress: '123 Main St',
      shippingAddress: '456 Market St',
    });

    await getAddress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
