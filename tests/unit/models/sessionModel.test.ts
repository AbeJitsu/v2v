import mongoose from 'mongoose';
import sessionModel from '../../../src/models/sessionModel';

describe('Session Model', () => {
  it('should have the required fields in the schema', () => {
    // Check that the schema has the expected fields
    const sessionSchema = sessionModel.schema;

    expect(sessionSchema.paths).toHaveProperty('_id');
    expect(sessionSchema.paths).toHaveProperty('session');
    expect(sessionSchema.paths).toHaveProperty('expires');

    expect(sessionSchema.paths.session.isRequired).toBe(true);
    expect(sessionSchema.paths.expires.instance).toBe('Date');
  });
});
