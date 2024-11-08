import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mydatabase';

// Log the MongoDB URI for debugging purposes
console.log('Connecting to MongoDB with URI:', MONGODB_URI);

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Debug endpoint to list all collections in the database
app.get('/collections', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established');
    }
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database instance not available');
    }
    const collections = await db.listCollections().toArray();
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

// Movies endpoint to find movies by year
app.get('/movies/:year', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established');
    }
    const year = parseInt(req.params.year);
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database instance not available');
    }
    const movies = await db.collection('movies').find({ year }).toArray();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

// Movies endpoint to get all movies
app.get('/movies', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established');
    }
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database instance not available');
    }
    const movies = await db.collection('movies').find().toArray();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

// Counter increment endpoint
app.get('/counter/increment', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established');
    }
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database instance not available');
    }
    const counterCollection = db.collection('counters');
    const result = await counterCollection.findOneAndUpdate(
      { name: 'visitCounter' },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    if (result) {
      res.status(200).json({ count: result.value?.count ?? 1 });
    } else {
      res.status(404).json({ error: 'Counter not found' });
    }
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
