import { processPayment } from '../../../src/services/paymentService';

jest.mock('../../../src/services/paymentService', () => ({
  processPayment: jest.fn(),
}));

describe('Payment Service Unit Tests', () => {
  const mockToken = 'mockToken';
  const mockAmount = 100;
  const mockCurrency = 'USD';

  test('should process payment successfully', async () => {
    // Simulate successful payment response
    const mockResponse = { id: 'mockPaymentId' };
    (processPayment as jest.Mock).mockResolvedValue(mockResponse);

    const result = await processPayment(mockToken, mockAmount, mockCurrency);
    expect(result).toEqual(mockResponse);
  });

  test('should handle payment processing failure', async () => {
    (processPayment as jest.Mock).mockRejectedValue(
      new Error('Payment failed')
    );

    await expect(
      processPayment(mockToken, mockAmount, mockCurrency)
    ).rejects.toThrow('Payment failed');
  });
});
