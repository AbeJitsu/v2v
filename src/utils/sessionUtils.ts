import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Application } from 'express';
import { logger } from '../middleware/logger';
import { DatabaseOperationError, handleDbOperation } from '../utils/dbUtils';

// Function to check if a session exists in the MongoDB database
export const checkSessionExists = async (
  sessionId: string
): Promise<boolean> => {
  if (!sessionId) {
    logger.error('Session ID is required to check session existence.');
    return false;
  }

  return handleDbOperation(async () => {
    if (mongoose.connection.readyState !== 1) {
      throw new DatabaseOperationError(
        'Database connection is not established.'
      );
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new DatabaseOperationError('Database instance is not available.');
    }

    const sessionCollection = db.collection('sessions');
    const session = await sessionCollection.findOne({
      _id: new mongoose.Types.ObjectId(sessionId),
    });

    if (session) {
      logger.info(`Session with ID ${sessionId} exists.`);
    } else {
      logger.info(`Session with ID ${sessionId} does not exist.`);
    }

    return !!session;
  }, 'Error checking session existence');
};

// Function to set up the session middleware
export const setupSession = (app: Application): void => {
  app.use(
    session({
      secret: process.env.SERVER_SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );

  logger.info('Session middleware set up successfully');
};
