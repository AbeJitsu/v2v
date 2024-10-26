const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  isProduction,
  getBackendUrl,
  getDatabaseUrl,
} = require('../utils/envUtils');

let counter = 0;

const setupDiagnosticRoutes = () => {
  router.get('/api/diagnostic', async (req, res) => {
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
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).json({
        message: 'Database connection failed',
        error: error.message,
      });
    }
  });

  router.post('/api/diagnostic/increment-counter', (req, res) => {
    counter++;
    res.json({ counter });
  });

  return router;
};

module.exports = setupDiagnosticRoutes;
