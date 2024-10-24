import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/authRoutes'; // Correct path

import * as authController from '../../src/controllers/authController'; // Correct path

const app = express();
app.use(express.json()); // Middleware for parsing JSON
app.use('/auth', authRoutes);

jest.mock('../../src/controllers/authController'); // Correct path for mocking the authController

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should call register controller on /auth/register POST', async () => {
    (authController.register as jest.Mock).mockImplementation((req, res) =>
      res.status(201).send()
    );

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(authController.register).toHaveBeenCalled();
  });

  it('should call login controller on /auth/login POST', async () => {
    (authController.login as jest.Mock).mockImplementation((req, res) =>
      res.status(200).send()
    );

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(authController.login).toHaveBeenCalled();
  });

  // Add similar tests for logout, getUserProfile, and role changes
});
