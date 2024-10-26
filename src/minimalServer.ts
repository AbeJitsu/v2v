// src/minimalServer.ts
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'https://jewelry-website-simplified.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-counter-value'],
    credentials: true,
  })
);

app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working' });
});

app.get('/api/test-page', (req, res) => {
  res.json({ message: 'Test page working' });
});

app.post('/api/test-page/increment-counter', (req, res) => {
  res.json({ message: 'Counter incremented' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
  });
}

export default app;
