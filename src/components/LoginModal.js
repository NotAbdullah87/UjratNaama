import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { loginSuccess } from '../slices/authSlice';
import { loginUser } from '../lib/api'; // import API call

export const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('hradmin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(email, password);
      dispatch(loginSuccess(response));
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-sans">
      <div className="bg-slate-800 text-white rounded-lg shadow-xl p-8 w-full max-w-sm border border-slate-700">
        <h2 className="text-2xl font-bold mb-2 text-center">HR Portal Access</h2>
        <p className="text-slate-400 text-center mb-6">Login to continue to UjratNaama</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="text"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-900 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="hr@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-900 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-md w-full transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 px-4 rounded-md w-full transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
