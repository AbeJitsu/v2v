// src/constants/PathConstants.ts

export const API_PATHS = {
  HEALTH_CHECK: '/health',
  USER: '/api/user',
  PRODUCT: '/api/product',
  // Add other paths as needed
};

export const DB_PATHS = {
  CONNECT_DB: './config/database-connection',
};

export const SERVER_PATHS = {
  SERVER: '../../src/server', // Check if this relative path is accurate in the context where it's used
};

export const UTIL_PATHS = {
  VALIDATION_UTILS: '../utils/validationUtils',
  RESPONSE_UTILS: '../utils/responseUtils',
};
