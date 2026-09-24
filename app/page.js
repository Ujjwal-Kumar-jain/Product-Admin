'use client';
import { useEffect, useState, Suspense } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { useUrlState } from '../hooks/useUrlState';
import { useDebounce } from '../hooks/useDebounce';
import { useProductContext } from '../context/ProductContext';
import Pagination from '../components/Pagination';
import { getCategories } from '../services/api';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';
import Link from 'next/link';
import ProductModal from '../components/ProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function DashboardContent() {
  const { getParams, updateParams } = useUrlState();
  const params = getParams();
  
  const [searchInput, setSearchInput] = useState(params.search || '');
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const [categories, setCategories] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  
  // Sync search input if URL changes externally (e.g. back button)
  useEffect(() => {
    setSearchInput(params.search || '');
  }, [params.search]);
  
  useEffect(() => {
    if (debouncedSearch !== params.search) {
      updateParams({ q: debouncedSearch, page: 1, category: '' }); 
    }
  }, [debouncedSearch, params.search, updateParams]);
  
  useEffect(() => {
    getCategories().then(data => setCategories(data)).catch(console.error);
  }, []);

  const skip = (params.page - 1) * params.limit;
  
  const { data, loading, error, retry } = useProducts({
    skip,
    limit: params.limit,
    search: params.search,
    category: params.category,
    sortBy: params.sortBy
  });

  const { applyLocalMutations, addedProducts, deletedIds } = useProductContext();
  
  let products = applyLocalMutations(data.products || []);
  
  // Filter added products locally so search & category apply to them too
  let localAdded = [...addedProducts];
  if (params.search) {
    const q = params.search.toLowerCase();
    localAdded = localAdded.filter(p => p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }
  if (params.category) {
    localAdded = localAdded.filter(p => p.category === params.category);
  }

  // Prepend local products on the first page
  if (params.page === 1) {
    products = [...localAdded, ...products];
  }

  // Calculate true total by subtracting deleted items from this view
  const deletedInThisView = (data.products || []).filter(p => deletedIds.has(p.id)).length;
  const finalTotal = data.total - deletedInThisView + localAdded.length;
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 text-center md:text-left">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            OPS IQ — One Platform for
            <br />
            <span className="text-cyan-400">Every Quality Workflow</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base">
            Unified architecture where quality, laboratory, manufacturing and asset data share one model, so intelligence and compliance work across the whole operation.
          </p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-cyan-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-cyan-500 transition font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] whitespace-nowrap shrink-0"
        >
          <Plus size={18}/> Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4 p-5 bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/60">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search enterprise products..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500 transition"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        
        <select 
          className="bg-slate-900/80 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          value={params.category}
          onChange={(e) => {
            setSearchInput(''); 
            updateParams({ category: e.target.value, q: '', page: 1 });
          }}
          disabled={!!searchInput}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
             <option key={typeof c === 'string' ? c : c.slug} value={typeof c === 'string' ? c : c.slug}>
               {typeof c === 'string' ? c : c.name}
             </option>
          ))}
        </select>
        
        <select 
          className="bg-slate-900/80 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          value={params.sortBy}
          onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}
        >
          <option value="">Sort By...</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="rating-desc">Rating (Highest)</option>
          <option value="title-asc">Title (A-Z)</option>
        </select>
      </div>
      
      {searchInput && (
        <p className="text-sm text-cyan-400 mb-6 px-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Category filter is disabled while searching.
        </p>
      )}

      {error ? (
        <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-8 rounded-2xl text-center shadow-lg backdrop-blur-sm">
          <p className="mb-4 text-lg">{error}</p>
          <button onClick={retry} className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-500 transition shadow-md">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-slate-800/80 p-16 rounded-2xl text-center text-slate-400 border border-slate-700/50 shadow-xl backdrop-blur-sm">
          <Package size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-xl font-medium text-white mb-2">No products found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-slate-800/90 rounded-2xl shadow-xl border border-slate-700/60 overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-700/60">
                  <th className="p-5 font-semibold text-slate-300 text-sm tracking-wide">Product</th>
                  <th className="p-5 font-semibold text-slate-300 text-sm tracking-wide">Category</th>
                  <th className="p-5 font-semibold text-slate-300 text-sm tracking-wide">Price</th>
                  <th className="p-5 font-semibold text-slate-300 text-sm tracking-wide">Rating</th>
                  <th className="p-5 font-semibold text-slate-300 text-sm tracking-wide">Stock</th>
                  <th className="p-5 font-semibold text-slate-300 text-sm tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-slate-700/40 hover:bg-slate-700/40 transition-colors">
                    <td className="p-5 flex items-center gap-4">
                      <img src={product.thumbnail || 'https://dummyjson.com/image/150'} alt={product.title} className="w-14 h-14 object-cover rounded-xl bg-slate-900 border border-slate-700/50" />
                      <Link href={`/products/${product.id}`} className="font-semibold text-white hover:text-cyan-400 transition">{product.title}</Link>
                    </td>
                    <td className="p-5 text-slate-400 capitalize text-sm">{product.category}</td>
                    <td className="p-5 font-bold text-white">${Number(product.price).toFixed(2)}</td>
                    <td className="p-5 text-sm text-slate-300">
                      <span className="text-cyan-500 mr-1">★</span>{product.rating}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50' : 'bg-red-900/30 text-red-400 border border-red-800/50'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => setDeletingProduct(product)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-slate-800/90 p-5 rounded-2xl shadow-xl border border-slate-700/60 flex flex-col sm:flex-row gap-5 backdrop-blur-sm">
                <img src={product.thumbnail || 'https://dummyjson.com/image/150'} alt={product.title} className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-xl bg-slate-900 border border-slate-700/50" />
                <div className="flex-grow flex flex-col">
                  <Link href={`/products/${product.id}`} className="font-bold text-lg text-white hover:text-cyan-400 transition line-clamp-1 mb-1">{product.title}</Link>
                  <p className="text-sm text-slate-400 capitalize mb-3">{product.category}</p>
                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      <span className="font-extrabold text-xl text-white">${Number(product.price).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2.5 text-slate-400 hover:text-cyan-400 bg-slate-900/50 rounded-lg transition"><Edit2 size={18} /></button>
                      <button onClick={() => setDeletingProduct(product)} className="p-2.5 text-slate-400 hover:text-red-400 bg-slate-900/50 rounded-lg transition"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination 
            total={finalTotal} 
            limit={params.limit} 
            page={params.page} 
            onPageChange={(page) => updateParams({ page })}
            onLimitChange={(limit) => updateParams({ limit, page: 1 })}
          />
        </>
      )}

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
      
      {deletingProduct && (
        <DeleteConfirmModal 
          product={deletingProduct} 
          onClose={() => setDeletingProduct(null)} 
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
