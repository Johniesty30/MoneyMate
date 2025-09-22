import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDb } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api/users', userRoutes);
app.use('/api/transaction', transactionRoutes);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`✅http://localhost:${PORT}`);
  });
});
