import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // credentials: lets the browser send the refresh cookie
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Connect once and reuse the connection (needed for serverless hosts like Vercel).
let connecting;
app.use(async (_req, _res, next) => {
  try {
    connecting ??= mongoose.connect(process.env.MONGODB_URI);
    await connecting;
    next();
  } catch (err) {
    connecting = null;
    next(err);
  }
});

app.get('/', (_req, res) => res.json({ ok: true, name: 'GreenCart API' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side. Try again in a moment.' });
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`GreenCart API listening on ${port}`));
}

export default app;
