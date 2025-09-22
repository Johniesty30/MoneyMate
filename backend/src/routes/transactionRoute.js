import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactionsByMonth,
  getTransactions,
  updateTransaction,
  getTransactionById,
} from '../controllers/transactionController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createTransaction);
router.get('/', protect, getTransactions);
router.get('/month/:year/:month', protect, getTransactionsByMonth);
router.get('/:id', protect, getTransactionById);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);

export default router;
