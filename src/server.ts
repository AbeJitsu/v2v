import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db'; // Import the MongoDB connection function

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server and save the instance in a variable
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export both the app and server
export { app, server };
