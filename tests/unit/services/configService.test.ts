// tests/unit/configService.test.ts
import { configService } from '../../src/services/configService';
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

describe('ConfigService Unit Tests', () => {
  let connectSpy: jest.SpyInstance;

  beforeEach(() => {
    connectSpy = jest
      .spyOn(configService, 'connect')
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should connect to MongoDB', async () => {
    await configService.connect();
    expect(connectSpy).toHaveBeenCalled();
  });

  test('should fetch configuration', async () => {
    const mockConfig = {
      _id: 'main',
      useCloudBackend: false,
      useCloudDatabase: true,
    };
    jest.spyOn(configService, 'getConfig').mockResolvedValue(mockConfig);
    const config = await configService.getConfig();
    expect(config).toEqual(mockConfig);
  });

  test('should update configuration', async () => {
    const updateSpy = jest
      .spyOn(configService, 'updateConfig')
      .mockResolvedValue(undefined);
    await configService.updateConfig({ useCloudBackend: true });
    expect(updateSpy).toHaveBeenCalled();
  });
});
