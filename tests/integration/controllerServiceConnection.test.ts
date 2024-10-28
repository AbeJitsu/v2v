// tests/integration/controllerServiceConnection.test.ts
import request from 'supertest';
import { app, server } from '../../src/server';

afterAll((done) => {
  server.close(done);
});

describe('Controller-Service Connection', () => {
  it('should invoke controller and return status 200', async () => {
    const res = await request(app).get('/health'); // Assuming the health route uses the controller
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK from service'); // Expect the service's response
  });
});