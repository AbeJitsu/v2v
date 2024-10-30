import rateLimit from 'express-rate-limit';
import { Request } from 'express'; // Import Request for better type definition
import { API_PATHS } from '../constants/PathConstants'; // Import path constants

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: Request) => {
    // Use the X-Forwarded-For header if available, otherwise fallback to req.ip
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown'; // Ensure a fallback value
    return ip; // Always return a string
  },
  skip: (req: Request) => {
    // Skip rate limiting for health checks or any other paths if needed
    return req.path === API_PATHS.HEALTH_CHECK; // Use constant for the path
  },
});

export default apiLimiter; // Export as default for ES module syntax
