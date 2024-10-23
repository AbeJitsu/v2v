import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db'; // This will soon come from PathConstants
import { API_PATHS } from './constants/PathConstants'; // Import paths

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get(API_PATHS.HEALTH_CHECK, (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server and save the instance in a variable
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export both the app and server
export { app, server };
