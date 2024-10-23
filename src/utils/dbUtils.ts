<<<<<<< ./packages/server/src/utils/dbUtils.ts
=======
// Content from jw1:
// server/src/utils/dbUtils.js

const { logger } = require('../api/middleware/logger');

const handleDbOperation = async (operation, successMessage) => {
  try {
    const result = await operation();
    logger.info(successMessage);
    return result;
  } catch (error) {
    logger.error(`Database operation failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  handleDbOperation,
};


// No content from jw2

// Content from ec24:
>>>>>>> ./packages/server/src/utils/modules/dbUtils.js
import mongoose from 'mongoose';
import { logger } from '../middleware/logger';

export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'DatabaseConnectionError';
  }
}

export class DatabaseOperationError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'DatabaseOperationError';
  }
}

export class EnvironmentVariableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentVariableError';
  }
}

export const handleDbOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Database operation failed'
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.error(errorMessage, error);
    throw new DatabaseOperationError(errorMessage, error);
  }
};

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const getConnectionStatus = (): string => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState];
};

export const validateObjectId = (id: string): boolean => {
  return mongoose.isValidObjectId(id);
};

export const toObjectId = (id: string): mongoose.Types.ObjectId => {
  if (!validateObjectId(id)) {
    throw new DatabaseOperationError(`Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
};

interface MongoDocument {
  _id?: mongoose.Types.ObjectId;
  __v?: number;
  [key: string]: unknown;
}

export const sanitizeDocument = <
  T extends MongoDocument,
  K extends keyof T = '_id' | '__v'
>(
  doc: T,
  fieldsToOmit: K[] = ['_id', '__v'] as K[]
): Omit<T, K> => {
  const sanitized = { ...doc };
  fieldsToOmit.forEach((field) => delete sanitized[field]);
  return sanitized as Omit<T, K>;
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      logger.warn(`Operation failed. Retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay);
    }
    throw error;
  }
};
<<<<<<< ./packages/server/src/utils/dbUtils.ts
=======


// Content from ec3:


>>>>>>> ./packages/server/src/utils/modules/dbUtils.js
1,2d0
< <<<<<<< ./packages/server/src/utils/dbUtils.ts
< =======
27d24
< >>>>>>> ./packages/server/src/utils/modules/dbUtils.js
125,126d121
< <<<<<<< ./packages/server/src/utils/dbUtils.ts
< =======
132d126
< >>>>>>> ./packages/server/src/utils/modules/dbUtils.js
