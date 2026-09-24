'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '../../../services/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Header from '../../../components/Header';
import { useProductContext } from '../../../context/ProductContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { deletedIds, editedProducts, addedProducts } = useProductContext();

  useEffect(() => {
    const fetchDetails = async () => {
      // Check if it's locally deleted
      if (deletedIds.has(Number(id)) || deletedIds.has(id)) {
        setError(true);
        setLoading(false);
        return;
      }
      
      // Check if it's a locally added product (not on server)
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

  if (loading) return <ProtectedRoute><Header /><div className="p-6 text-center">Loading product...</div></ProtectedRoute>;
  
  if (error || !product) {
    return (
      <ProtectedRoute>
        <Header />
        <div className="p-10 text-center max-w-md mx-auto mt-10 bg-white rounded shadow border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been deleted.</p>
          <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="p-6 max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6 font-medium">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
             <img src={product.thumbnail || 'https://dummyjson.com/image/400'} alt={product.title} className="max-w-full h-auto object-contain max-h-96" />
          </div>
          
          <div className="w-full md:w-1/2 p-8">
            <div className="uppercase text-sm text-gray-500 font-bold tracking-wider mb-2">{product.category}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-blue-600">${Number(product.price).toFixed(2)}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">⭐ {product.rating || 'N/A'}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock} in stock
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-8">
              {product.description || 'No description available for this product.'}
            </p>
            
            {product.reviews && product.reviews.length > 0 && (
              <div>
                <h3 className="font-bold text-lg border-b pb-2 mb-4">Reviews</h3>
                <div className="space-y-4">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded text-sm border border-gray-100">
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-gray-800">{r.reviewerName}</span>
                        <span className="text-yellow-500">⭐ {r.rating}</span>
                      </div>
                      <p className="text-gray-600">{r.comment}</p>
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
