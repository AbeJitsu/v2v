import express from 'express';

const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 3000;

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

let server: ReturnType<typeof app.listen>;

// Start the server function
const startServer = () => {
  server = app.listen(PORT, () => {
    const address = server.address();
    const port = typeof address === 'string' ? PORT : address?.port;
    console.log(`Server is running on port ${port}`);
  });
};

// Function to close the server, useful for tests
const closeServer = () => server && server.close();

export { app, server, startServer, closeServer };
