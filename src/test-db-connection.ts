// db-connection-check.ts
import mongoose from 'mongoose';

(async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mydatabase';

    // Attempt to connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if the database instance is available
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database instance not available');
    }

    // List all collections in the database
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
  } catch (error) {
    console.error(
      'Error connecting to MongoDB or accessing the database:',
      error
    );
  } finally {
    // Disconnect after checking the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
})();
