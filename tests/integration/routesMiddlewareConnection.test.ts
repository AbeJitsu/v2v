import request from 'supertest';
import { app, server } from '../../src/server';
import { API_PATHS } from '../../src/constants/PathConstants'; // Ensuring path consistency

afterAll((done) => {
  server.close(done);
});

describe('Routes Middleware Connectivity', () => {
  it('should ensure middleware properly processes and modifies the response for the health check route', async () => {
    const res = await request(app).get(API_PATHS.HEALTH_CHECK);
    expect(res.status).toBe(200);
    // This checks if middleware added the 'status' property correctly, assuming middleware should modify response
    expect(res.body).toHaveProperty('status', 'OK'); // Expecting specific status value to ensure middleware functionality
  });
});
