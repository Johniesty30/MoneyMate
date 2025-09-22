import React from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const SummaryCards = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'Pemasukan')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Pengeluaran')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-green-600 mb-2">
          Total Pemasukan
        </h3>
        <p className="text-3xl font-bold text-gray-800">
          {formatCurrency(totalIncome)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Total Pengeluaran
        </h3>
        <p className="text-3xl font-bold text-gray-800">
          {formatCurrency(totalExpense)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
          Saldo Saat Ini
        </h3>
        <p
          className={`text-3xl font-bold ${
            balance < 0 ? 'text-red-600' : 'text-gray-800'
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
