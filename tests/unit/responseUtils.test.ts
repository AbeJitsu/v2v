import { handleError } from '../../src/utils/responseUtils';
import { Response } from 'express';

describe('ResponseUtils Unit Tests', () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  test('should handle errors correctly', () => {
    const error = new Error('Test Error');
    handleError(res as Response, error, 'Test Error', 500);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});
