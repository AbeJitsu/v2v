import { Request, Response, NextFunction } from 'express';

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
  (req as any).logger = logger;
  next();
};

export { logger, attachLogger };
