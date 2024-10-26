import express from 'express';
import request from 'supertest';
import { applySessionMiddleware } from '../../../src/middleware/sessionMiddleware'; // Adjust path as necessary

jest.mock('connect-mongo');

describe('Session Middleware', () => {
  let app: express.Application;
  const mongoURI = 'mongodb://localhost/test';

  beforeEach(() => {
    app = express();
    applySessionMiddleware(app, mongoURI);
  });

  test('should set session data correctly', (done) => {
    app.get('/set-session', (req, res) => {
      req.session.user_id = 'user123'; // Set session data
      res.send('Session set');
    });

    request(app)
      .get('/set-session')
      .expect(200)
      .then((response) => {
        expect(response.text).toBe('Session set');
        done();
      })
      .catch((err) => done(err));
  });
});
