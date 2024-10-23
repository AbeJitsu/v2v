import { Response } from 'express';

/**
 * Handle success responses in the application.
 *
 * @param res - Express Response object.
 * @param message - Success message to send back.
 * @param data - Additional data to send back with the response.
 * @param statusCode - HTTP status code, defaults to 200 (OK).
 */
export const handleSuccess = (
  res: Response,
  message: string,
  data: any = {},
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * Handle error responses in the application.
 *
 * @param res - Express Response object.
 * @param error - Error object or message.
 * @param message - Custom error message.
 * @param statusCode - HTTP status code, defaults to 500 (Internal Server Error).
 */
export const handleError = (
  res: Response,
  error: any,
  message: string,
  statusCode: number = 500
) => {
  res.status(statusCode).json({
    status: 'error',
    message,
    error: error.message || error,
  });
};
