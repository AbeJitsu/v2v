import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db'; // This will soon come from PathConstants
import { API_PATHS } from './constants/PathConstants'; // Import paths
import routes from './routes'; // Import the main routes file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Use the routes
app.use(routes);

// Health check endpoint
app.get(API_PATHS.HEALTH_CHECK, (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server and save the instance in a variable
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export both the app and server
export { app, server };
