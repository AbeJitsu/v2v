// tests/integration/modelDatabaseConnection.test.ts
import mongoose from 'mongoose';
import connectDB from '../../src/config/database-connection'; // Adjust path if necessary
import Session from '../../src/models/sessionModel'; // Adjust path if necessary

beforeAll(async () => {
  await connectDB(); // Connect to the database before all tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the connection after all tests
});

describe('Model Database Connection', () => {
  it('should create a session in the database', async () => {
    const sessionData = {
      _id: 'testSessionId',
      session: 'sampleSessionData',
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiration
    };

    const session = new Session(sessionData);
    const savedSession = await session.save();

    expect(savedSession._id).toBe(sessionData._id); // Verify the saved session's ID
    expect(savedSession.session).toBe(sessionData.session); // Verify the saved session data
  });
});
