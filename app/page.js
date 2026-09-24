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
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ProductModal from '../components/ProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function DashboardContent() {
  const { getParams, updateParams } = useUrlState();
  const params = getParams();
  
  const [searchInput, setSearchInput] = useState(params.search);
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const [categories, setCategories] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  
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

  const { applyLocalMutations, addedProducts } = useProductContext();
  
  // Prepend added products to page 1, and apply local edits
  let products = applyLocalMutations(data.products || []);
  if (params.page === 1 && !params.search && !params.category) {
    // Only show newly added products on the first page of default view
    products = [...addedProducts, ...products];
  }
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={16}/> Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-white rounded shadow-sm border border-gray-100">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        
        <select 
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
        <p className="text-xs text-amber-600 mb-4 px-2">
          * Category filter is disabled while searching.
        </p>
      )}

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded text-center">
          <p className="mb-4">{error}</p>
          <button onClick={retry} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded text-center text-gray-500 border border-gray-100 shadow-sm">
          <p className="text-lg">No products found.</p>
          <p className="text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700 text-sm">Product</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm">Category</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm">Price</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm">Rating</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm">Stock</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={product.thumbnail || 'https://dummyjson.com/image/150'} alt={product.title} className="w-12 h-12 object-cover rounded bg-gray-100 border border-gray-200" />
                      <Link href={`/products/${product.id}`} className="font-medium text-blue-600 hover:underline">{product.title}</Link>
                    </td>
                    <td className="p-4 text-gray-600 capitalize text-sm">{product.category}</td>
                    <td className="p-4 font-medium">${Number(product.price).toFixed(2)}</td>
                    <td className="p-4 text-sm">⭐ {product.rating}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeletingProduct(product)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                          <Trash2 size={16} />
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
              <div key={product.id} className="bg-white p-4 rounded shadow-sm border border-gray-200 flex gap-4">
                <img src={product.thumbnail || 'https://dummyjson.com/image/150'} alt={product.title} className="w-24 h-24 object-cover rounded bg-gray-100 border border-gray-200" />
                <div className="flex-grow flex flex-col">
                  <Link href={`/products/${product.id}`} className="font-bold text-blue-600 hover:underline line-clamp-1 mb-1">{product.title}</Link>
                  <p className="text-sm text-gray-500 capitalize mb-2">{product.category}</p>
                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      <span className="font-bold text-lg">${Number(product.price).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => setDeletingProduct(product)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination 
            total={data.total + addedProducts.length} 
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
      <Suspense fallback={<div className="p-6 text-center">Loading dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
