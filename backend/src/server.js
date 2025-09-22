import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { connectDb } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json()); // Mem-parsing body JSON
app.use(express.urlencoded({ extended: true })); // Mem-parsing body urlencoded

// CORS Middleware untuk Development
// Izinkan frontend dev server (default: port 5173) untuk mengakses API
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
    })
  );
}

app.use('/api/users', userRoutes);
app.use('/api/transaction', transactionRoutes);

const __dirname = path.resolve(); // Dapatkan direktori saat ini

if (process.env.NODE_ENV === 'production') {
  // Set folder 'dist' di dalam 'frontend' sebagai folder statis
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  // Semua request GET yang tidak cocok dengan API di atas akan diarahkan ke index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  // Jika bukan production, berikan respons sederhana untuk root path
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// Custom Error Middleware
app.use(notFound);
app.use(errorHandler);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`✅http://localhost:${PORT}`);
  });
});
