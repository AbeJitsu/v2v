// tests/unit/server.test.ts
import request from 'supertest';
import { app, startServer, closeServer } from '../../src/server';

beforeAll(() => startServer());
afterAll(() => closeServer());

describe('Server Initialization and Health Check', () => {
  it('should start the server and respond with 200 on the /health route', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object); // Ensures response is an object
    expect(res.body).toHaveProperty('status', 'OK'); // Checks if response has correct status
  });
});
