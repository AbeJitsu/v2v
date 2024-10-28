// tests/integration/serviceModelConnection.test.ts
import request from 'supertest';
import { app, server } from '../../src/server';

afterAll((done) => {
  server.close(done);
});

describe('Service-Model Connection', () => {
  it('should invoke service and return status 200', async () => {
    const res = await request(app).get('/health'); // Assuming the health route uses the service
    expect(res.status).toBe(200); // Check if the response status is 200
  });
});
