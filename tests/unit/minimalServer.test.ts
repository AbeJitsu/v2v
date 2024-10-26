// tests/unit/minimalServer.test.ts
import request from 'supertest';
import app from '../../src/minimalServer';

describe('Minimal Server', () => {
  test('GET /api/test responds with CORS confirmation', async () => {
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'CORS is working' });
  });

  test('GET /api/test-page responds with test page message', async () => {
    const response = await request(app).get('/api/test-page');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Test page working' });
  });

  test('POST /api/test-page/increment-counter responds with incremented message', async () => {
    const response = await request(app).post(
      '/api/test-page/increment-counter'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Counter incremented' });
  });
});
