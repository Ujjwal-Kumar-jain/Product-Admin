'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [addedProducts, setAddedProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedAdded = localStorage.getItem('addedProducts');
      const storedEdited = localStorage.getItem('editedProducts');
      const storedDeleted = localStorage.getItem('deletedIds');

      if (storedAdded) setAddedProducts(JSON.parse(storedAdded));
      if (storedEdited) setEditedProducts(JSON.parse(storedEdited));
      if (storedDeleted) setDeletedIds(new Set(JSON.parse(storedDeleted)));
    } catch (e) {
      console.error("Failed to load local mutations", e);
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('addedProducts', JSON.stringify(addedProducts));
    localStorage.setItem('editedProducts', JSON.stringify(editedProducts));
    localStorage.setItem('deletedIds', JSON.stringify(Array.from(deletedIds)));
  }, [addedProducts, editedProducts, deletedIds, isLoaded]);

  const addLocalProduct = (product) => {
    setAddedProducts(prev => [product, ...prev]);
  };

  const editLocalProduct = (id, changes) => {
    setEditedProducts(prev => ({ ...prev, [id]: { ...prev[id], ...changes } }));
  };

  const deleteLocalProduct = (id) => {
    setDeletedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const applyLocalMutations = (apiProducts) => {
    return apiProducts
      .filter(p => !deletedIds.has(p.id))
      .map(p => editedProducts[p.id] ? { ...p, ...editedProducts[p.id] } : p);
  };

  return (
    <ProductContext.Provider value={{ addedProducts, applyLocalMutations, addLocalProduct, editLocalProduct, deleteLocalProduct, deletedIds }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
