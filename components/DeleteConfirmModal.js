'use client';
import { useState } from 'react';
import { deleteProduct } from '../services/api';
import { useProductContext } from '../context/ProductContext';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ product, onClose }) {
  const { deleteLocalProduct } = useProductContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    
    try {
      await deleteProduct(product.id);
      deleteLocalProduct(product.id);
      onClose();
    } catch (err) {
      setError('Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0b1120]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center border border-slate-700">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/30 border border-red-500/30 mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">Delete Product</h3>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Are you sure you want to delete <strong className="text-white">{product.title}</strong>? This action cannot be undone.
        </p>
        
        {error && <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 text-sm rounded-lg mb-6">{error}</div>}
        
        <div className="flex justify-center gap-4">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 py-2.5 rounded-full font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 font-bold text-white rounded-full hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
