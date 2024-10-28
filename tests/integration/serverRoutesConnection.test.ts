import request from 'supertest';
import { app, server } from '../../src/server';

afterAll((done) => {
  server.close(done);
});

describe('Server Routes Connection', () => {
  it('should respond with 200 for /health route', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    // Optionally check if the response body is an object if needed
    expect(res.body).toBeInstanceOf(Object);
  });
});
