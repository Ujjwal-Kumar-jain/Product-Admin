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
    <div className="fixed inset-0 bg-[#0b1120]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700">
        <div className="flex justify-between items-center p-5 border-b border-slate-700/60 bg-slate-900/50">
          <h3 className="text-xl font-bold text-white">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition bg-slate-800 p-1.5 rounded-full hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 text-sm rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition" />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Price ($)</label>
              <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Stock</label>
              <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
            <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition" rows="3"></textarea>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 font-medium transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:opacity-50 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
