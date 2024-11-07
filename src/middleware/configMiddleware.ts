import express, {
  Application,
  RequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
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
  // Explicitly type the middleware array
  const middleware: RequestHandler[] = [
    attachLogger,
    cors(corsOptions) as RequestHandler,
    express.json(),
    express.urlencoded({ extended: true }),
    helmet(),
  ];

  // Add request logging only in development
  if (isDevelopment) {
    middleware.push(morgan('dev') as RequestHandler);
  }

  // Apply each middleware
  middleware.forEach((fn) => app.use(fn));

  // Add error handling middleware separately
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });
};

export default configMiddleware;
