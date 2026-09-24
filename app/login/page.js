'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/api';

export default function LoginPage() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login(username, password);
      loginUser(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-slate-800/90 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-white tracking-tight">Admin Login</h2>
        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 mb-6 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Username</label>
            <input 
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-500 transition disabled:opacity-50 font-medium shadow-[0_0_15px_rgba(6,182,212,0.3)] mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
