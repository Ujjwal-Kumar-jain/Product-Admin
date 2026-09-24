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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold mb-2">Delete Product</h3>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete <strong>{product.title}</strong>? This action cannot be undone.
        </p>
        
        {error && <div className="bg-red-50 text-red-600 p-2 text-sm rounded mb-4">{error}</div>}
        
        <div className="flex justify-center gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="px-4 py-2 border rounded font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            disabled={loading}
            className="px-4 py-2 bg-red-600 font-medium text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
