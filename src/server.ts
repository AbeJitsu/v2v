import dotenv from 'dotenv';
import express from 'express';
// import connectDB from './db';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Use the routes
app.use(routes); // Uncomment this to connect to routes

// Health check endpoint (hardcoded for now)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server and save the instance in a variable
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export both the app and server
export { app, server };
