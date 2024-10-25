import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json()); // Middleware for parsing JSON

// Mock the controller functions
const registerMock = jest.fn((req, res) => res.status(201).send());
const loginMock = jest.fn((req, res) => res.status(200).send());

// Define mock auth routes directly in the test file
app.post('/auth/register', registerMock);
app.post('/auth/login', loginMock);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should call register controller on /auth/register POST', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(registerMock).toHaveBeenCalled();
  });

  it('should call login controller on /auth/login POST', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(loginMock).toHaveBeenCalled();
  });

  // You can add similar tests for logout, getUserProfile, and role changes here
});
