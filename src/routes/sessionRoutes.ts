import { Router, Request, Response, NextFunction } from 'express';
import { createSession } from '../controllers/sessionController'; // Import the session controller

const router = Router();

// POST route for creating a session
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createSession(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
