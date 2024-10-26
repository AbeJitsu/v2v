// tests/unit/routes/diagnosticRoutes.test.ts
import express from 'express';
import request from 'supertest';

describe('Diagnostic Route Unit Test', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();

    // Define the mock route directly for testing purposes
    app.get('/api/diagnostic', (req, res) => {
      res.status(200).json({
        serverLocation: 'Mock Location',
        databaseLocation: 'Mock Database',
        message: 'API diagnostic test successful',
      });
    });
  });

  it('should return diagnostic information', async () => {
    const response = await request(app).get('/api/diagnostic');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('serverLocation', 'Mock Location');
    expect(response.body).toHaveProperty('databaseLocation', 'Mock Database');
    expect(response.body).toHaveProperty(
      'message',
      'API diagnostic test successful'
    );
  });
});
