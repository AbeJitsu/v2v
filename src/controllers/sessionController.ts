// In sessionController.ts
import { Request, Response, NextFunction } from 'express';
import Session from '../models/sessionModel'; // Ensure to import your Session model

export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, session, expires } = req.body; // Destructure the request body

    // Validate request body
    if (!_id || !session || !expires) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new session instance
    const newSession = new Session({ _id, session, expires });

    // Save the session to the database
    const savedSession = await newSession.save();

    res.status(201).json(savedSession); // Respond with the saved session
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};
