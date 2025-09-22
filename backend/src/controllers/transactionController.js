import Transaction from '../models/transactionModel.js';

const createTransaction = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const userId = req.user._id;
    let { amount, type, category, date, description } = req.body;

    if (amount === undefined || !type || !category) {
      return res  
        .status(400)
        .json({ message: 'amount, type, and category are required' });
    }

    amount = Number(amount);
    if (Number.isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    date = date ? new Date(date) : new Date();
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      category,
      date,
      description,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create transaction', error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    if (transactions.length === 0) {
      return res
        .status(200)
        .json({ message: 'No transactions found', transactions: [] });
    }
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction)
      return res.status(404).json({ message: 'Transaction not found' });

    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch transaction', error: error.message });
  }
};

const getTransactionsByMonth = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user._id;
    const { year, month } = req.params;

    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }

    const startDate = new Date(y, m - 1, 1);
    // last millisecond of the last day of month m
    const endDate = new Date(y, m, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const userId = req.user._id;

    // Allow only specific fields to be updated
    const allowed = ['amount', 'type', 'category', 'date', 'description'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === 'amount') {
          const amt = Number(req.body[key]);
          if (Number.isNaN(amt))
            return res.status(400).json({ message: 'Invalid amount' });
          updates.amount = amt;
        } else if (key === 'date') {
          const d = new Date(req.body.date);
          if (isNaN(d.getTime()))
            return res.status(400).json({ message: 'Invalid date' });
          updates.date = d;
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update transaction', error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const userId = req.user._id;

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete transaction', error: error.message });
  }
};

export {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionsByMonth,
  updateTransaction,
  deleteTransaction,
};
