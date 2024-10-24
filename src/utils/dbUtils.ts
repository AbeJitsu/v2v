import mongoose from 'mongoose';

// Simple console-based logger to replace Winston
const logger = {
  error: (message: string, error: any) => console.error(message, error),
  info: (message: string) => console.info(message),
};

export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseOperationError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'DatabaseOperationError';
  }
}

export class EnvironmentVariableError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
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
  return states[mongoose.connection.readyState] || 'unknown';
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
