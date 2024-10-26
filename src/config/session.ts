import express from 'express';
import session, { Session, SessionData } from 'express-session';
import MongoStore from 'connect-mongo';
import { logger } from '../middleware/logger';
import { isProduction } from '../utils/envUtils';

declare module 'express-session' {
  interface SessionData {
    user_id?: string;
  }
}

interface SessionConfig extends express.RequestHandler {
  store: MongoStore;
}

const createSessionConfig = (mongoURI: string): SessionConfig => {
  if (!mongoURI) {
    throw new Error('MongoDB URI is required for session store.');
  }

  const config = session({
    secret: process.env.SERVER_SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24 * 7, // 7 days
      stringify: false,
      autoRemove: 'native',
      touchAfter: 24 * 3600, // Update session every 24 hours if not modified
    }),
    cookie: {
      maxAge: 60 * 60 * 24 * 1000 * 7, // 7 days
      secure: isProduction(),
      httpOnly: true,
      sameSite: 'lax',
    },
    name: 'sessionId',
  });

  return config as SessionConfig; // Ensure it returns the correct type
};

const applySessionMiddleware = (
  app: express.Application,
  mongoURI: string
): void => {
  app.use(createSessionConfig(mongoURI));

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!isProduction()) {
        logger.info(`[${new Date().toISOString()}] Request URL: ${req.url}`);
        logger.info(`Request headers: ${JSON.stringify(req.headers)}`);
      }

      if (req.sessionID) {
        logger.info(`Session ID: ${req.sessionID}`);
        if (req.session.user_id) {
          logger.info(
            `Existing session found for user: ${req.session.user_id}`
          );
        }
      }

      const originalSave = req.session.save;
      req.session.save = function (
        callback?: (err: any) => void
      ): Session & Partial<SessionData> {
        logger.info(`Saving session: ${req.sessionID}`);
        originalSave.call(this, (err: any) => {
          if (err) {
            logger.error(`Error saving session: ${err}`);
          } else {
            logger.info(`Session saved successfully: ${req.sessionID}`);
          }
          if (callback) callback(err);
        });
        return this as Session & Partial<SessionData>;
      };

      const originalSend = res.send;
      res.send = function (
        body: any
      ): express.Response<any, Record<string, any>> {
        if (!isProduction()) {
          logger.info(`Response headers: ${JSON.stringify(res.getHeaders())}`);
        }
        return originalSend.call(this, body);
      };

      next();
    }
  );

  logger.info('Session middleware applied.');
};

export { createSessionConfig, applySessionMiddleware };
