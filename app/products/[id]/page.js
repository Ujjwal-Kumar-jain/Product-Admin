'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '../../../services/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Header from '../../../components/Header';
import { useProductContext } from '../../../context/ProductContext';
import Link from 'next/link';
import { ArrowLeft, Star, Package } from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { deletedIds, editedProducts, addedProducts } = useProductContext();

  useEffect(() => {
    const fetchDetails = async () => {
      if (deletedIds.has(Number(id)) || deletedIds.has(id)) {
        setError(true);
        setLoading(false);
        return;
      }
      
      const localProduct = addedProducts.find(p => String(p.id) === String(id));
      if (localProduct) {
        setProduct(localProduct);
        setLoading(false);
        return;
      }
      
      try {
        const data = await getProductById(id);
        
        if (editedProducts[id]) {
          setProduct({ ...data, ...editedProducts[id] });
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id, deletedIds, editedProducts, addedProducts]);

  if (loading) return (
    <ProtectedRoute>
      <Header />
      <div className="flex justify-center py-24">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    </ProtectedRoute>
  );
  
  if (error || !product) {
    return (
      <ProtectedRoute>
        <Header />
        <div className="p-10 text-center max-w-md mx-auto mt-12 bg-slate-800/80 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-sm">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/30 border border-red-500/30 mb-6">
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">Product Not Found</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">The product you are looking for does not exist or has been deleted.</p>
          <button onClick={() => router.push('/')} className="bg-cyan-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-cyan-500 transition shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            Back to Dashboard
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="p-6 max-w-5xl mx-auto pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition mb-8 font-medium">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
        
        <div className="bg-slate-800/80 rounded-2xl shadow-xl overflow-hidden border border-slate-700/60 flex flex-col md:flex-row backdrop-blur-sm">
          <div className="w-full md:w-1/2 bg-slate-900/50 flex items-center justify-center p-10 border-b md:border-b-0 md:border-r border-slate-700/60">
             <img src={product.thumbnail || 'https://dummyjson.com/image/400'} alt={product.title} className="max-w-full h-auto object-contain max-h-[400px] drop-shadow-2xl" />
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="uppercase text-xs text-cyan-400 font-bold tracking-widest mb-3">{product.category}</div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight leading-tight">{product.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="text-3xl font-extrabold text-white">${Number(product.price).toFixed(2)}</span>
              <span className="bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold text-slate-300 flex items-center gap-1">
                <Star size={14} className="text-cyan-500" fill="currentColor" /> {product.rating || 'N/A'}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${product.stock > 0 ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50' : 'bg-red-900/30 text-red-400 border border-red-800/50'}`}>
                {product.stock} in stock
              </span>
            </div>
            
            <p className="text-slate-400 leading-relaxed mb-10 text-lg">
              {product.description || 'No description available for this product.'}
            </p>
            
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-auto">
                <h3 className="font-bold text-xl text-white border-b border-slate-700/60 pb-3 mb-5">Quality Reviews</h3>
                <div className="space-y-4">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between font-bold mb-2">
                        <span className="text-white">{r.reviewerName}</span>
                        <span className="text-cyan-400 flex items-center gap-1 text-sm"><Star size={12} fill="currentColor"/> {r.rating}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
