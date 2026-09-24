'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useUrlState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParams = useCallback(() => {
    const pageVal = parseInt(searchParams.get('page'));
    const limitVal = parseInt(searchParams.get('limit'));
    
    return {
      page: isNaN(pageVal) || pageVal < 1 ? 1 : pageVal,
      limit: [10, 20, 50].includes(limitVal) ? limitVal : 10,
      search: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      sortBy: searchParams.get('sortBy') || '',
    };
  }, [searchParams]);

  const updateParams = useCallback((newParams) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.keys(newParams).forEach(key => {
      if (newParams[key] === null || newParams[key] === '') {
        current.delete(key);
      } else {
        current.set(key, newParams[key]);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/${query}`);
  }, [router, searchParams]);

  return { getParams, updateParams };
};
