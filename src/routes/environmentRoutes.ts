import express, { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandling';
import { logger } from '../middleware/logger';
import { configService } from '../services/configService';

const router: Router = express.Router();

/**
 * Validates the environment settings request payload.
 * @param body - The request body containing environment flags.
 * @returns {string | null} - Returns an error message if validation fails, otherwise null.
 */
const validateEnvSettings = (body: any): string | null => {
  const { useCloudBackend, useCloudDB } = body;
  if (typeof useCloudBackend !== 'boolean' || typeof useCloudDB !== 'boolean') {
    return 'Invalid input. Expected boolean values.';
  }
  return null;
};

/**
 * Handles the update of environment settings and responds with the updated values.
 */
router.post(
  '/toggle-environment',
  asyncHandler(async (req: Request, res: Response) => {
    const error = validateEnvSettings(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const { useCloudBackend, useCloudDB } = req.body;
    await configService.updateConfig({
      useCloudBackend,
      useCloudDatabase: useCloudDB,
    });

    logger.info(
      `Environment settings updated: useCloudBackend=${useCloudBackend}, useCloudDB=${useCloudDB}`
    );

    const updatedConfig = await configService.getConfig();
    res.json({
      message: 'Environment settings updated successfully',
      useCloudBackend: updatedConfig.useCloudBackend,
      useCloudDB: updatedConfig.useCloudDatabase,
    });
  })
);

export default router;
