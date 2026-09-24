'use client';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logoutUser } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-gray-800">Product Admin</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">
            Welcome, <strong>{user.firstName}</strong>
          </span>
          <button 
            onClick={logoutUser} 
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded transition text-sm font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
