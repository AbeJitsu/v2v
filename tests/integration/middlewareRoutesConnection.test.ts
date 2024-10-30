// tests/integration/middlewareRoutesConnection.test.ts
import request from 'supertest';
import { app, server } from '../../src/server';
import { API_PATHS } from '../../src/constants/PathConstants'; // Ensuring path consistency

afterAll((done) => {
  server.close(done);
});

describe('Middleware-Routes Connection', () => {
  it('should invoke middleware and correctly route to the health check, returning status 200', async () => {
    const res = await request(app).get(API_PATHS.HEALTH_CHECK); // Using the path constant for consistency
    expect(res.status).toBe(200); // Verifying successful route handling via middleware
  });
});
