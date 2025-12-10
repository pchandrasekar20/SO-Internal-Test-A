import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Backend API Server' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
