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
  return response.data;
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
