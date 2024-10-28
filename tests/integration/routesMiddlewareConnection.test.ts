// tests/integration/middlewareConnection.test.ts
import request from 'supertest';
import { app, server } from '../../src/server';

afterAll((done) => {
  server.close(done);
});

describe('Middleware Index Connectivity', () => {
  it('should invoke placeholder middleware and return status 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK with middleware');
  });
});
