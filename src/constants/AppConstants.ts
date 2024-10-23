// Importing paths from PathConstants
import { API_PATHS } from './PathConstants';

// Default values for constants
export const DEFAULTS = {
  PORT: '3000',
  MONGODB_URI: process.env.MONGODB_URI || 'your-default-mongo-uri-here',
};

// Helper function to get environment variables with defaults
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

// Exporting constants
export const PORT = parseInt(getEnvVar('PORT', DEFAULTS.PORT), 10);
export const MONGODB_URI = getEnvVar('MONGODB_URI', DEFAULTS.MONGODB_URI);

// Reuse paths from PathConstants
export const API_ENDPOINTS = {
  USER: API_PATHS.USER || '/api/user', // Example, if defined in PathConstants
  PRODUCT: API_PATHS.PRODUCT || '/api/product', // Example, if defined in PathConstants
};

// Additional error codes
export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
};
