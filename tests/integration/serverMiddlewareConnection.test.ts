import request from 'supertest';
import { app, server } from '../../src/server';
import { API_PATHS } from '../../src/constants/PathConstants'; // Using path constants for consistency

afterAll((done) => {
  server.close(done);
});

describe('Server Middleware Connection', () => {
  it('should correctly process middleware and return a successful response for the health check route', async () => {
    const res = await request(app).get(API_PATHS.HEALTH_CHECK);
    expect(res.status).toBe(200); // Check that the middleware allows the request to pass with 200 OK
    // Optionally check if the response body is an object if needed
    expect(res.body).toBeInstanceOf(Object);
    // Check for specific middleware effects, like adding a specific header or modifying the body
    // Example: expect(res.body).toHaveProperty('success', true);
    // Example: expect(res.headers).toHaveProperty('x-custom-header', 'value'); // If middleware adds custom headers
  });
});
