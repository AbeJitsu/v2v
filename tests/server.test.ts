import request from 'supertest';
import { app, server } from '../src/server';
import mongoose from 'mongoose';

describe('GET /health', () => {
  afterAll(async () => {
    // Close the MongoDB connection
    await mongoose.connection.close();

    // Close the server, handling any potential errors
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err); // Reject the promise if there's an error
        } else {
          resolve(); // Resolve the promise when the server is closed
        }
      });
    });
  });

  it('should return status 200 with OK message', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});
