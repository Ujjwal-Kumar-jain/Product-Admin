import api from './axiosSetup';

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password, expiresInMins: 60 * 24 });
  return response.data;
};

export const getProducts = async ({ skip = 0, limit = 10, search = '', category = '', sortBy = '', signal }) => {
  let url = '/products';
  const params = { skip, limit };

  if (search) {
    url = `/products/search`;
    params.q = search;
  } else if (category) {
    url = `/products/category/${category}`;
  }
  
  if (sortBy) {
    const [field, order] = sortBy.split('-');
    params.sortBy = field;
    params.order = order || 'asc';
  }

  const response = await api.get(url, { params, signal });
  
  // Artificially cap total products to 6 as requested
  const MAX_PRODUCTS = 6;
  let products = response.data.products;
  let total = Math.min(response.data.total, MAX_PRODUCTS);
  
  if (skip >= MAX_PRODUCTS) {
      products = [];
  } else if (products.length > (MAX_PRODUCTS - skip)) {
      products = products.slice(0, MAX_PRODUCTS - skip);
  }

  return { ...response.data, products, total };
};

export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post('/products/add', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
