import express from 'express';
import { asyncHandler } from '../middleware/errorHandling';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware//authMiddleware';

const router = express.Router();

// Common Swagger Schemas for Request Body
const userSchemas = {
  register: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'password' },
    },
  },
  login: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'password' },
    },
  },
};

// Swagger Responses for User Operations
const userResponses = {
  200: {
    description: 'Request successful',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' }, // only in login
          },
        },
      },
    },
  },
  400: { description: 'Invalid input' },
  401: { description: 'Unauthorized' },
  500: { description: 'Internal server error' },
};

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${userSchemas.register}
 *     responses: ${userResponses}
 */
router.post('/register', asyncHandler(authController.register));

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${userSchemas.login}
 *     responses: ${userResponses}
 */
router.post('/login', asyncHandler(authController.login));

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [User]
 *     responses: ${userResponses}
 */
router.post('/logout', authMiddleware, asyncHandler(authController.logout));

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     responses: ${userResponses}
 */
router.get(
  '/profile',
  authMiddleware,
  asyncHandler(authController.getUserProfile)
);

export default router;
