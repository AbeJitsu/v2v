import { Request, Response, NextFunction } from 'express';

// Extend the Express Request type
declare global {
  namespace Express {
    interface Request {
      logger: typeof logger;
    }
  }
}

const logger = {
  log: (level: 'info' | 'error' | 'warn', message: string, data?: any) => {
    console[level](message, data);
  },
  info: (message: string, data?: any) => {
    logger.log('info', message, data);
  },
  error: (message: string, data?: any) => {
    logger.log('error', message, data);
  },
  warn: (message: string, data?: any) => {
    logger.log('warn', message, data);
  },
};

const attachLogger = (req: Request, res: Response, next: NextFunction) => {
  req.logger = logger;
  next();
};

export { logger, attachLogger };
