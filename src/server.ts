import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database-connection'; // Adjust the path as necessary
import routes from './routes';
import { placeholderMiddleware } from './middleware'; // Import the middleware

dotenv.config();

const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Use placeholder middleware for all routes
app.use(placeholderMiddleware);

// Use the routes
app.use(routes);

// Start the server and save the instance in a variable
const server = app.listen(PORT, () => {
  const address = server.address();
  const port = typeof address === 'string' ? PORT : address?.port;
  console.log(`Server is running on port ${port}`);
});

// Function to close the server, useful for tests
const closeServer = () => server.close();

// Export both the app and server, including the close function
export { app, server, closeServer };
