import { Request, Response } from 'express';
import { register, login, logout } from '../../src/controllers/authController';
import { handleSuccess, handleError } from '../../src/utils/responseUtils';

jest.mock('../../src/utils/responseUtils');

describe('AuthController Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(), // Mock clearCookie to avoid errors in logout
    };
  });

  describe('register', () => {
    it('should return error if validation fails', async () => {
      req.body = { email: 'invalid-email', password: 'short' };

      await register(req as Request, res as Response);

      expect(handleError).toHaveBeenCalled(); // Basic check that error handler is called
    });
  });

  describe('login', () => {
    it('should return error if validation fails', async () => {
      req.body = { email: 'invalid-email', password: 'short' };

      await login(req as Request, res as Response);

      expect(handleError).toHaveBeenCalled(); // Basic check that error handler is called
    });
  });

  describe('logout', () => {
    it('should return error if no session exists', async () => {
      req.session = undefined;

      await logout(req as Request, res as Response);

      expect(handleError).toHaveBeenCalled(); // Basic check that error handler is called
    });

    it('should log out user if session exists', async () => {
      req.session = {
        destroy: jest.fn((cb) => cb(null)),
      } as any; // Simplified session mock without strict type checking

      await logout(req as Request, res as Response);

      expect(handleSuccess).toHaveBeenCalled(); // Check that success handler is called
    });
  });
});
