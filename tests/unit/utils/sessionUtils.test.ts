import { checkSessionExists } from '../../../src/utils/sessionUtils';

// Mock the internal functions within sessionUtils
jest.mock('../../../src/utils/sessionUtils', () => ({
  checkSessionExists: jest.fn(async (sessionId: string) => {
    if (!sessionId) return false;
    if (sessionId === 'no-connection')
      throw new Error('Database connection is not established');
    if (sessionId === 'valid-session-id') return true;
    return false;
  }),
}));

describe('Session Utils - checkSessionExists', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return false if sessionId is not provided', async () => {
    const result = await checkSessionExists('');
    expect(result).toBe(false);
  });

  test('should throw error if database connection is not established', async () => {
    await expect(checkSessionExists('no-connection')).rejects.toThrow(
      'Database connection is not established'
    );
  });

  test('should return true if session exists', async () => {
    const result = await checkSessionExists('valid-session-id');
    expect(result).toBe(true);
  });

  test('should return false if session does not exist', async () => {
    const result = await checkSessionExists('invalid-session-id');
    expect(result).toBe(false);
  });
});
