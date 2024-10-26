import express from 'express';
import session from 'express-session';
import {
  createSessionConfig,
  applySessionMiddleware,
} from '../../../src/config/session';
import MongoStore from 'connect-mongo';
import request from 'supertest';

jest.mock('connect-mongo');

describe('Session Middleware', () => {
  let app: express.Application;
  const mongoURI = 'mongodb://localhost/test';

  beforeEach(() => {
    app = express();
    applySessionMiddleware(app, mongoURI);
  });

  test('should create session configuration with correct settings', () => {
    const sessionConfig = createSessionConfig(mongoURI);
    expect(sessionConfig).toBeDefined();
    // Check properties on the sessionConfig if needed
  });

  test('should set up session middleware', (done) => {
    app.get('/test-session', (req, res) => {
      req.session.user_id = 'user123';
      res.send('Session set');
    });

    request(app)
      .get('/test-session')
      .expect(200)
      .then((response) => {
        expect(response.text).toBe('Session set');
        expect(response.headers['set-cookie']).toBeDefined(); // Ensure session cookie is set
        done();
      })
      .catch((err) => done(err));
  });
});
