// tests/integration/crossLayerIntegration.test.ts
import request from 'supertest';
import { app, server } from '../../src/server';
import mongoose from 'mongoose';
import connectDB from '../../src/config/database-connection';
import Session from '../../src/models/sessionModel';

beforeAll(async () => {
  await connectDB(); // Connect to the database before all tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the connection after all tests
  server.close(); // Close the server after tests
});

describe('Cross-Layer Integration Test', () => {
  it('should create a session and retrieve it correctly', async () => {
    const sessionData = {
      _id: `crossLayerTestSessionId_${Date.now()}`, // Unique ID using timestamp
      session: 'crossLayerTestData',
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiration
    };

    // Step 1: Create a session via the API
    await request(app).post('/sessions').send(sessionData).expect(201); // Expecting a successful creation

    // Step 2: Retrieve the session from the database
    const retrievedSession = await Session.findById(sessionData._id);

    // Step 3: Verify the retrieved session data
    if (!retrievedSession) {
      throw new Error(`Session not found: ${sessionData._id}`);
    }

    expect(retrievedSession.session).toBe(sessionData.session); // Verify session data
  });
});
