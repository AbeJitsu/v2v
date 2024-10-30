import request from 'supertest';
import { app, server } from '../../src/server';
import { API_PATHS } from '../../src/constants/PathConstants'; // Consistent use of path constants

// Mock the service and model if necessary
// import * as Service from '../../src/services/healthService'; // Example service file
// jest.mock('../../src/services/healthService');

afterAll((done) => {
  server.close(done);
});

describe('Service-Model Connection', () => {
  it('should invoke service and interact with model to return status 200', async () => {
    // Setup mock for the service call to ensure it interacts with the model correctly
    Service.checkHealthStatus = jest.fn().mockResolvedValue({ status: 'ok' }); // Mock implementation

    const res = await request(app).get(API_PATHS.HEALTH_CHECK); // Use the path from constants

    expect(res.status).toBe(200); // Check if the service allows the request to pass with 200 OK
    expect(Service.checkHealthStatus).toHaveBeenCalled(); // Ensure the service was called
    expect(res.body).toEqual({ status: 'ok' }); // Optional: Check that the service returns the expected response
  });
});
