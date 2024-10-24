import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import authRoutes from '../../src/routes/authRoutes';
import * as authController from '../../src/controllers/authController';
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

jest.mock('../../src/controllers/authController'); // Mock the auth controller
jest.mock('../../src/middleware/authMiddleware'); // Mock the middlewares

// Mock the authMiddleware to simulate an authenticated user
(authMiddleware as jest.Mock).mockImplementation(
  (req: CustomRequest, res: Response, next: NextFunction) => {
    req.user_id = 'user123'; // Simulate authenticated user
    next();
  }
);

// Mock the roleMiddleware to simulate an admin user
(roleMiddleware as jest.Mock).mockImplementation(
  (roles: UserRole[]) =>
    (req: CustomRequest, res: Response, next: NextFunction) => {
      if (roles.includes(UserRole.ADMIN)) {
        req.user_id = 'admin123'; // Simulate admin user
        next();
      } else {
        return res.status(403).send({ message: 'Access denied' });
      }
    }
);

describe('Auth Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should register a new user', async () => {
    (authController.register as jest.Mock).mockImplementation((req, res) =>
      res.status(201).send({ message: 'User registered successfully' })
    );

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'testuser@test.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(authController.register).toHaveBeenCalled();
  });

  it('should login a user with valid credentials', async () => {
    (authController.login as jest.Mock).mockImplementation((req, res) =>
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
    expect(authController.login).toHaveBeenCalled();
  });

  it('should allow a user to logout', async () => {
    (authController.logout as jest.Mock).mockImplementation((req, res) =>
      res.status(200).send({ message: 'Logged out successfully' })
    );

    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
    expect(authController.logout).toHaveBeenCalled();
  });

  it('should fetch the user profile when authenticated', async () => {
    (authController.getUserProfile as jest.Mock).mockImplementation(
      (req, res) =>
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
    expect(authController.getUserProfile).toHaveBeenCalled();
  });

  it('should allow an admin to change user role', async () => {
    (authController.changeUserRole as jest.Mock).mockImplementation(
      (req, res) =>
        res.status(200).send({ message: 'User role updated successfully' })
    );

    const response = await request(app)
      .post('/auth/change-role')
      .send({ userId: 'user123', newRole: UserRole.ADMIN });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User role updated successfully');
    expect(authController.changeUserRole).toHaveBeenCalled();
  });
});
