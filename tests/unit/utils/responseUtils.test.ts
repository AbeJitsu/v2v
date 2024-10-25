import { handleError } from '../../../src/utils/responseUtils';
import { Response } from 'express';

describe('ResponseUtils Unit Tests', () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(), // Mocking the status method to return the res object
      json: jest.fn(), // Mocking the json method
    };
  });

  test('should handle errors correctly', () => {
    const error = new Error('Test Error');
    handleError(res as Response, error, 'Test Error', 500);

    expect(res.status).toHaveBeenCalledWith(500); // Checking status code
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test Error',
      error: 'Test Error',
    });
  });
});
