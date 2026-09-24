'use client';
import { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [addedProducts, setAddedProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [deletedIds, setDeletedIds] = useState(new Set());

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
