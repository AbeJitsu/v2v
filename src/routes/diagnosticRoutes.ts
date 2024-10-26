import express from 'express'; // Use ES module import
import mongoose from 'mongoose';
import { isProduction, getBackendUrl, getDatabaseUrl } from '../utils/envUtils';

const router = express.Router(); // Keep the router initialization
let counter = 0;

// Setup diagnostic routes
router.get('/', async (req, res) => {
  // Remove /api/ from the path
  const isCloudDB = process.env.SERVER_USE_CLOUD_DB === 'true';
  const serverAddress = getBackendUrl();

  try {
    res.json({
      serverLocation: `${
        isProduction() ? 'production' : 'development'
      } at ${serverAddress}`,
      databaseLocation: isCloudDB ? 'MongoDB Atlas' : 'Local MongoDB',
      databaseURI: getDatabaseUrl(),
      counter,
      dbStatus: mongoose.connection.readyState,
      message: 'API and Database connection successful',
    });
  } catch (error: unknown) {
    // Explicitly typing the error as unknown
    if (error instanceof Error) {
      console.error('Error connecting to database:', error);
      res.status(500).json({
        message: 'Database connection failed',
        error: error.message,
      });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({
        message: 'Unexpected error occurred',
      });
    }
  }
});

// Increment counter
router.post('/increment-counter', (req, res) => {
  // Remove /api/ from the path
  counter++;
  res.json({ counter });
});

// Use ES module export
export default router; // Directly export the router instance
