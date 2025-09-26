import Transaction from '../models/transactionModel.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create Transaction
const createTransaction = asyncHandler(async (req, res, next) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const { amount, type, category, date, description } = req.body;

  if (amount === undefined || !type || !category) {
    throw new ApiError(400, 'amount, type, and category are required');
  }

  const numAmount = Number(amount);
  if (Number.isNaN(numAmount)) throw new ApiError(400, 'Invalid amount');

  const transactionDate = date ? new Date(date) : new Date();
  if (isNaN(transactionDate.getTime())) throw new ApiError(400, 'Invalid date');

  const newTransaction = new Transaction({
    userId: req.user._id,
    amount: numAmount,
    type,
    category,
    date: transactionDate,
    description,
  });

  const savedTransaction = await newTransaction.save();
  res.status(201).json({
    message: 'Transaction Created Successfully',
    transaction: savedTransaction,
  });
});

// Get All Transactions
const getTransactions = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const transactions = await Transaction.find({ userId: req.user._id }).sort({
    date: -1,
  });

  if (transactions.length === 0) {
    return res
      .status(200)
      .json({ message: 'No transactions found', transactions: [] });
  }

  res.status(200).json(transactions);
});

// Get Transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!transaction) throw new ApiError(404, 'Transaction not found');

  res.status(200).json(transaction);
});

// Get Transactions by Month
const getTransactionsByMonth = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const { year, month } = req.params;
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);

  if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) {
    throw new ApiError(400, 'Invalid year or month');
  }

  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);

  const transactions = await Transaction.find({
    userId: req.user._id,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });

  res.status(200).json(transactions);
});

// Update Transaction
const updateTransaction = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const allowed = ['amount', 'type', 'category', 'date', 'description'];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      if (key === 'amount') {
        const amt = Number(req.body[key]);
        if (Number.isNaN(amt)) throw new ApiError(400, 'Invalid amount');
        updates.amount = amt;
      } else if (key === 'date') {
        const d = new Date(req.body.date);
        if (isNaN(d.getTime())) throw new ApiError(400, 'Invalid date');
        updates.date = d;
      } else {
        updates[key] = req.body[key];
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No valid fields to update');
  }

  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: updates },
    { new: true }
  );

  if (!updatedTransaction) throw new ApiError(404, 'Transaction not found');

  res.status(200).json(updatedTransaction);
});

// Delete Transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const deletedTransaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!deletedTransaction) throw new ApiError(404, 'Transaction not found');

  res.status(200).json({ message: 'Transaction deleted successfully' });
});

export {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionsByMonth,
  updateTransaction,
  deleteTransaction,
};
