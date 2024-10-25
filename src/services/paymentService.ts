import { Client, Environment, CreatePaymentResponse } from 'square';
import crypto from 'crypto';
import { isProduction } from '../utils/envUtils';
import { logger } from '../middleware/logger';

const client = new Client({
  environment: isProduction() ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SERVER_SQUARE_ACCESS_TOKEN,
});

export const processPayment = async (
  token: string,
  amount: number,
  currency: string
): Promise<CreatePaymentResponse['payment']> => {
  const idempotencyKey = crypto.randomBytes(12).toString('hex');
  const paymentMoney = {
    amount: BigInt(Math.round(amount * 100)), // Convert to BigInt, Square API expects amount in cents
    currency,
  };

  try {
    const response = await client.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey,
      amountMoney: paymentMoney,
    });
    return response.result.payment; // Ensure this matches your test expectations
  } catch (error) {
    logger.error('Payment processing error:', error);
    throw new Error('Failed to process payment');
  }
};
