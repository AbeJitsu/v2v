import request from 'supertest';
import mongoose from 'mongoose';
import { API_PATHS, SERVER_PATHS } from '../../src/constants/PathConstants'; // Import paths
const { app, server } = require(SERVER_PATHS.SERVER); // Use the constant for server path

describe('GET /health', () => {
  afterAll(async () => {
    // Close the MongoDB connection
    await mongoose.connection.close();

    // Close the server, handling any potential errors
    await new Promise<void>((resolve, reject) => {
      server.close((err: Error | null) => {
        // Explicitly type 'err'
        if (err) {
          reject(err); // Reject the promise if there's an error
        } else {
          resolve(); // Resolve the promise when the server is closed
        }
      });
    });
  });

  it('should return status 200 with OK message', async () => {
    const res = await request(app).get(API_PATHS.HEALTH_CHECK);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});
