import React from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const TransactionList = ({
  transactions,
  loading,
  error,
  onTransactionDeleted,
}) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal menghapus transaksi.');
      }

      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="text-center p-4">
            Memuat data...
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan="5" className="text-center p-4 text-red-500">
            {error}
          </td>
        </tr>
      );
    }
    if (transactions.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center p-4 text-gray-500">
            Belum ada transaksi.
          </td>
        </tr>
      );
    }

    return transactions
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((trx) => (
        <tr key={trx._id} className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
            {formatDate(trx.date)}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
            {trx.category}
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                trx.type === 'Pemasukan'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {trx.type}
            </span>
          </td>
          <td
            className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
              trx.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(trx.amount)}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
            <button
              onClick={() => handleDelete(trx._id)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Hapus
            </button>
          </td>
        </tr>
      ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Riwayat Transaksi</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipe
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah
              </th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderContent()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
