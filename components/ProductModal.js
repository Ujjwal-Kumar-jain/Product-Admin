'use client';
import { useState } from 'react';
import { addProduct, updateProduct } from '../services/api';
import { useProductContext } from '../context/ProductContext';
import { X } from 'lucide-react';

export default function ProductModal({ product, onClose }) {
  const isEdit = !!product;
  const { addLocalProduct, editLocalProduct } = useProductContext();
  
  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: product?.price || '',
    category: product?.category || 'smartphones',
    stock: product?.stock || 0,
    description: product?.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEdit) {
        await updateProduct(product.id, formData);
        editLocalProduct(product.id, formData);
      } else {
        const res = await addProduct(formData);
        addLocalProduct({ ...formData, ...res, id: res.id || Date.now(), thumbnail: 'https://dummyjson.com/image/150' });
      }
      onClose();
    } catch (err) {
      setError('Failed to save product. Changes were not applied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-2 text-sm rounded">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input required name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" rows="3"></textarea>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
