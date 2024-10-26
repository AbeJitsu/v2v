import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  customMessage?: string;
}

/**
 * Error handler middleware
 * Logs the error stack and sends a JSON response with the error message and status.
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error stack:', err.stack);
  const statusCode = err.status || 500;
  const errorMessage = err.customMessage || 'An unexpected error occurred';

  res.status(statusCode).json({
    message: errorMessage,
    error: err.message || 'An unexpected error has occurred.',
  });
};

/**
 * Async handler to wrap route handlers and catch errors
 * Simplifies handling async errors by forwarding them to the error handler.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
