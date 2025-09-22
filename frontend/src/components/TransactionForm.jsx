import React, { useState } from 'react';

const TransactionForm = ({ onTransactionAdded }) => {
  const [type, setType] = useState('Pengeluaran');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          category,
          amount: Number(amount),
          date,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan transaksi.');
      }

      // Reset form
      setType('Pengeluaran');
      setCategory('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setMessage({ text: 'Transaksi berhasil disimpan!', type: 'success' });

      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
      <h3 className="text-2xl font-semibold mb-6">Tambah Transaksi</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 mb-2">
            Tipe
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="Pengeluaran">Pengeluaran</option>
            <option value="Pemasukan">Pemasukan</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 mb-2">
            Kategori
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            placeholder="Cth: Gaji, Makanan"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 mb-2">
            Jumlah (Rp)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            placeholder="50000"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 mb-2">
            Tanggal
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Makan siang (opsional)"
          ></textarea>
        </div>

        {message.text && (
          <p
            className={`text-center mb-4 ${
              message.type === 'error' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
        >
          {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
