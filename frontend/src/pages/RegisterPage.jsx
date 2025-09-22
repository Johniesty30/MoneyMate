import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Kriteria validasi password sesuai model backend
  const passwordCriteria = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    noSpecialChars: /^[a-zA-Z0-9]+$/.test(password) || password.length === 0,
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Password tidak memenuhi semua kriteria yang dibutuhkan.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.message || 'Registrasi gagal.');
      }

      // Jika sukses, arahkan ke login setelah beberapa saat
      alert('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">MoneyMate</h1>
          <p className="mt-2 text-gray-600">Buat akun baru Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Petunjuk Validasi Password Real-time */}
          {password.length > 0 && (
            <div className="space-y-1 text-sm">
              <p
                className={
                  passwordCriteria.minLength ? 'text-green-600' : 'text-red-600'
                }
              >
                {passwordCriteria.minLength ? '✓' : '✗'} Minimal 8 karakter
              </p>
              <p
                className={
                  passwordCriteria.uppercase ? 'text-green-600' : 'text-red-600'
                }
              >
                {passwordCriteria.uppercase ? '✓' : '✗'} Mengandung 1 huruf
                besar
              </p>
              <p
                className={
                  passwordCriteria.lowercase ? 'text-green-600' : 'text-red-600'
                }
              >
                {passwordCriteria.lowercase ? '✓' : '✗'} Mengandung 1 huruf
                kecil
              </p>
              <p
                className={
                  passwordCriteria.number ? 'text-green-600' : 'text-red-600'
                }
              >
                {passwordCriteria.number ? '✓' : '✗'} Mengandung 1 angka
              </p>
              <p
                className={
                  passwordCriteria.noSpecialChars
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {passwordCriteria.noSpecialChars ? '✓' : '✗'} Tidak boleh
                mengandung simbol
              </p>
            </div>
          )}

          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
