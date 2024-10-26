import cors, { CorsOptions, CorsRequest, CorsOptionsDelegate } from 'cors';
import { Express, RequestHandler } from 'express';
import { getFrontendUrl } from './envUtils';
import { logger } from '../middleware/logger';

/**
 * Generates CORS options based on environment settings.
 * @returns {CorsOptionsDelegate<CorsRequest>}
 */
const getCorsOptions: CorsOptionsDelegate<CorsRequest> = async (
  req,
  callback
) => {
  const frontendUrl = await getFrontendUrl();
  logger.info(`Setting CORS origin to ${frontendUrl}`);

  const options: CorsOptions = {
    origin: (origin, cb) => {
      if (!origin || origin === frontendUrl) cb(null, true);
      else cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-counter-value'],
    credentials: true,
    optionsSuccessStatus: 204,
  };

  callback(null, options);
};

/**
 * Initializes CORS middleware for direct application use.
 * @returns {Promise<RequestHandler>}
 */
export const configureCors = (): RequestHandler => cors(getCorsOptions);

/**
 * Applies CORS middleware to the given Express app.
 * @param {Express} app - The Express application instance.
 * @returns {Promise<void>}
 */
export const applyCors = (app: Express): void => {
  app.use(configureCors());
  logger.info('CORS middleware applied');
};

// Usage examples:
// 1. Apply CORS directly to the app with applyCors(app).
// 2. For custom use, use configureCors() as middleware.
