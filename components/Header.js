'use client';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logoutUser } = useAuth();

  return (
    <header className="bg-slate-100 shadow-md px-6 py-4 flex justify-between items-center mb-8 border-b-4 border-cyan-500 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="flex space-x-1">
          <div className="w-1.5 h-6 bg-cyan-500 rounded-sm"></div>
          <div className="w-1.5 h-6 bg-blue-600 rounded-sm"></div>
          <div className="w-1.5 h-6 bg-slate-800 rounded-sm"></div>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Nexgensis <span className="text-slate-500 font-medium text-sm block -mt-1 uppercase tracking-widest">Technologies</span></h1>
      </div>
      {user && (
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-600 hidden sm:inline">
            Welcome, <strong className="text-slate-900">{user.firstName}</strong>
          </span>
          <button 
            onClick={logoutUser} 
            className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-2 rounded-full transition text-sm font-semibold shadow-md"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
