import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the MongoDB URI from the environment variables
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error('MONGODB_URI is not defined in the environment variables.');
}

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
