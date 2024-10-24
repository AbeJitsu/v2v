// src/routes/authRoutes.ts

import express, { Request, Response } from 'express';
import {
  register,
  login,
  logout,
  getUserProfile,
  changeUserRole,
} from '../controllers/authController';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';
import { UserRole } from '../models/userModel';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: User not authenticated
 */
router.get('/user', authMiddleware, getUserProfile);

/**
 * @swagger
 * /auth/change-role:
 *   post:
 *     summary: Change user role
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               newRole:
 *                 type: string
 *     responses:
 *       200:
 *         description: User role changed successfully
 *       403:
 *         description: Access denied
 */
router.post(
  '/change-role',
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  changeUserRole
);

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Admin access test
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Admin access granted
 *       403:
 *         description: Access denied
 */
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  (req: Request, res: Response) => {
    res.status(200).json({ message: 'Admin access granted' });
  }
);

export default router;
