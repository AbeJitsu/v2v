import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from '../middleware/errorHandling';
import { attachLogger } from '../middleware/logger';

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Common configuration values
 */
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
};

/**
 * Configures middleware for the application
 * @param app - The Express application
 */
const configMiddleware = (app: Application): void => {
  const middleware = [
    attachLogger,
    cors(corsOptions),
    express.json(),
    express.urlencoded({ extended: true }),
    helmet(),
    errorHandler,
  ];

  // Add request logging only in development
  if (isDevelopment) {
    middleware.push(morgan('dev'));
  }

  middleware.forEach((fn) => app.use(fn));
};

export default configMiddleware;
