// tests/integration/authIntegration.test.ts

import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import authRoutes from '../../src/routes/authRoutes';
import {
  register,
  login,
  logout,
  getUserProfile,
  changeUserRole,
} from '../../src/controllers/authController';
import {
  authMiddleware,
  roleMiddleware,
} from '../../src/middleware/authMiddleware';
import { UserRole } from '../../src/models/userModel';

// Extend the Request interface to include user_id
interface CustomRequest extends Request {
  user_id?: string;
}

// Initialize the express app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Mock the authController with all necessary functions
jest.mock('../../src/controllers/authController', () => ({
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  getUserProfile: jest.fn(),
  changeUserRole: jest.fn(),
}));

// Mock the authMiddleware and roleMiddleware
jest.mock('../../src/middleware/authMiddleware', () => ({
  authMiddleware: jest.fn(
    (req: CustomRequest, res: Response, next: NextFunction) => {
      req.user_id = 'user123'; // Simulate authenticated user
      next();
    }
  ),
  roleMiddleware: jest.fn((roles: UserRole[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
      if (roles.includes(UserRole.ADMIN)) {
        req.user_id = 'admin123'; // Simulate admin user
        next();
      } else {
        return res.status(403).send({ message: 'Access denied' });
      }
    };
  }),
}));

describe('Auth Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should register a new user', async () => {
    (register as jest.Mock).mockImplementation((req, res) =>
      res.status(201).send({ message: 'User registered successfully' })
    );

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'testuser@test.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(register).toHaveBeenCalled();
  });

  it('should login a user with valid credentials', async () => {
    (login as jest.Mock).mockImplementation((req, res) =>
      res
        .status(200)
        .send({ message: 'Login successful', token: 'dummy-token' })
    );

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@test.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBe('dummy-token');
    expect(login).toHaveBeenCalled();
  });

  it('should allow a user to logout', async () => {
    (logout as jest.Mock).mockImplementation((req, res) =>
      res.status(200).send({ message: 'Logged out successfully' })
    );

    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
    expect(logout).toHaveBeenCalled();
  });

  it('should fetch the user profile when authenticated', async () => {
    (getUserProfile as jest.Mock).mockImplementation((req, res) =>
      res.status(200).send({
        email: 'testuser@test.com',
        preferredFirstName: 'Test',
        role: 'user',
      })
    );

    const response = await request(app).get('/auth/user');

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('testuser@test.com');
    expect(response.body.role).toBe('user');
    expect(getUserProfile).toHaveBeenCalled();
  });

  it('should allow an admin to change user role', async () => {
    (changeUserRole as jest.Mock).mockImplementation((req, res) =>
      res.status(200).send({ message: 'User role updated successfully' })
    );

    const response = await request(app)
      .post('/auth/change-role')
      .send({ userId: 'user123', newRole: UserRole.ADMIN });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User role updated successfully');
    expect(changeUserRole).toHaveBeenCalled();
  });
});
