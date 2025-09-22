import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          window.location.href = '/login';
        }
        throw new Error('Gagal memuat transaksi.');
      }

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <SummaryCards transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <TransactionForm onTransactionAdded={fetchTransactions} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              loading={loading}
              error={error}
              onTransactionDeleted={fetchTransactions}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
