// import express, { Router, Request, Response } from 'express';
// import { asyncHandler } from '../middleware/errorHandling';
// import { logger } from '../middleware/logger';
// import {
//   isProduction,
//   getBackendUrl,
//   getDatabaseUrl,
//   isCloudDatabase,
// } from '../utils/envUtils';
// import { getConnectionStatus, handleDbOperation } from '../utils/dbUtils';
// import { VisitCounter as Counter } from '../models/visitCounter';

// const router: Router = express.Router();

// const getServerInfo = async () => ({
//   serverLocation: `${
//     isProduction() ? 'production' : 'development'
//   } at ${await getBackendUrl()}`,
//   databaseLocation: (await isCloudDatabase())
//     ? 'MongoDB Atlas'
//     : 'Local MongoDB',
//   databaseURI: await getDatabaseUrl(),
//   dbStatus: getConnectionStatus(),
// });

// router.get(
//   '/api/test-page',
//   asyncHandler(async (req: Request, res: Response) => {
//     const dbInfo = await handleDbOperation(async () => {
//       const counter = await Counter.findOneAndUpdate(
//         {},
//         { $inc: { value: 1 } },
//         { upsert: true, new: true }
//       );
//       return { count: counter?.value ?? 0 };
//     });

//     const serverInfo = await getServerInfo();

//     res.json({
//       ...serverInfo,
//       ...dbInfo,
//       message: 'API and Database connection successful',
//     });
//   })
// );

// router.post(
//   '/api/test-page/increment-counter',
//   asyncHandler(async (req: Request, res: Response) => {
//     const counter = await handleDbOperation(() =>
//       Counter.findOneAndUpdate(
//         {},
//         { $inc: { value: 1 } },
//         { upsert: true, new: true }
//       )
//     );
//     res.json({ count: counter?.value ?? 0 });
//   })
// );

// router.get(
//   '/api/count',
//   asyncHandler(async (req: Request, res: Response) => {
//     const startTime = Date.now();
//     const counter = await handleDbOperation(() => Counter.findOne({}));
//     logger.info(`Counter fetch took ${Date.now() - startTime}ms`);
//     res.json({ count: counter?.value ?? 0 });
//   })
// );

// // Simple health check endpoint
// router.get('/health', (req: Request, res: Response) => {
//   res.status(200).json({ status: 'OK' });
// });

// export default router;
