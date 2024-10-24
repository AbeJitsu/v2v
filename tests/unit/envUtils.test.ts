import {
  getEnvVar,
  requireEnvVar,
  validateEnvVariables,
} from '../../src/utils/envUtils';

describe('EnvUtils Unit Tests', () => {
  beforeEach(() => {
    process.env = { ...process.env, TEST_VAR: 'test_value' };
  });

  test('should retrieve an environment variable', () => {
    const result = getEnvVar('TEST_VAR');
    expect(result).toBe('test_value');
  });

  test('should throw error if required variable is missing', () => {
    expect(() => requireEnvVar('MISSING_VAR')).toThrow(
      'Environment variable MISSING_VAR is not set'
    );
  });

  test('should validate required environment variables', () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '3001',
      MONGODB_URI: 'mongodb://localhost',
      SESSION_SECRET: 'secret',
    };

    expect(() => validateEnvVariables()).not.toThrow();
  });
});
