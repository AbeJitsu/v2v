// tests/integration/controllerServiceConnection.test.ts
import request from 'supertest';
import { app, server } from '../../src/server';
import { API_PATHS } from '../../src/constants/PathConstants'; // Import path constants

afterAll((done) => {
  server.close(done);
});

describe('Controller-Service Connection', () => {
  it('should invoke controller and return status 200', async () => {
    const res = await request(app).get(API_PATHS.HEALTH_CHECK); // Use constant for the health check path
    expect(res.status).toBe(200); // Only check that the response status is 200
  });
});
