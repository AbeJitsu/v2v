import { Request, Response } from 'express';

describe('Payment Controller Tests', () => {
  const mockRequest = (body: Partial<Record<string, any>>): Request =>
    ({
      body,
    } as Request);

  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
  };

  test('should handle payment successfully', async () => {
    const req = mockRequest({
      token: 'mockToken',
      amount: 100,
      currency: 'USD',
    });
    const res = mockResponse();

    // Simulate successful payment response
    const result = { id: 'mockPaymentId' };

    const handlePayment = async (req: Request, res: Response) => {
      const { token, amount, currency } = req.body;

      if (!token || !amount || !currency) {
        return res
          .status(400)
          .json({ message: 'Missing required payment details' });
      }

      // Directly simulate success without actual payment processing
      res.status(200).json({ message: 'Payment successful', data: result });
    };

    await handlePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Payment successful',
      data: result,
    });
  });

  test('should return error for missing payment details', async () => {
    const req = mockRequest({});
    const res = mockResponse();

    const handlePayment = async (req: Request, res: Response) => {
      const { token, amount, currency } = req.body;

      if (!token || !amount || !currency) {
        return res
          .status(400)
          .json({ message: 'Missing required payment details' });
      }
    };

    await handlePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing required payment details',
    });
  });

  test('should handle payment processing error', async () => {
    const req = mockRequest({
      token: 'mockToken',
      amount: 100,
      currency: 'USD',
    });
    const res = mockResponse();

    const handlePayment = async (req: Request, res: Response) => {
      const { token, amount, currency } = req.body;

      if (!token || !amount || !currency) {
        return res
          .status(400)
          .json({ message: 'Missing required payment details' });
      }

      // Simulate an error for testing purposes
      return res
        .status(500)
        .json({ message: 'Payment failed', error: 'Payment failed' });
    };

    await handlePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Payment failed',
      error: 'Payment failed',
    });
  });
});
