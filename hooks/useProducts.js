import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';

export const useProducts = (queryOptions) => {
  const [data, setData] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (options, signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts({ ...options, signal });
      setData({ products: response.products, total: response.total });
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      if (signal && !signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(queryOptions, abortController.signal);
    return () => abortController.abort();
  }, [
    queryOptions.skip, 
    queryOptions.limit, 
    queryOptions.search, 
    queryOptions.category, 
    queryOptions.sortBy, 
    fetchProducts
  ]);

  const retry = () => {
    const abortController = new AbortController();
    fetchProducts(queryOptions, abortController.signal);
  };

  return { data, loading, error, retry };
};
