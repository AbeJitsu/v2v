// tests/integration/middlewareControllerConnection.test.ts
import request from 'supertest';
import { app, server } from '../../src/server';

afterAll((done) => {
  server.close(done);
});

describe('Middleware-Controller Connection', () => {
  it('should invoke middleware and pass control to controller, returning status 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200); // Only check that the response is successful
  });
});
