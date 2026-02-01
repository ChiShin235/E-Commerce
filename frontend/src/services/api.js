import api from "./axios";

// API functions
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put("/users/change-password", passwordData);
    return response.data;
  },
};

export const productAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get("/products/search", {
      params: { q: query },
    });
    return response.data;
  },
};

export const categoryAPI = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

export const cartAPI = {
  getMyCart: async () => {
    const response = await api.get("/carts/my");
    return response.data;
  },

  createCart: async (userId) => {
    const response = await api.post("/carts", { user: userId });
    return response.data;
  },
};

export const cartItemAPI = {
  getByCart: async (cartId) => {
    const response = await api.get("/cart-items", {
      params: { cart: cartId },
    });
    return response.data;
  },

  addItem: async (cartId, productId, quantity, price, size) => {
    const response = await api.post("/cart-items", {
      cart: cartId,
      product: productId,
      quantity,
      price,
      size,
    });
    return response.data;
  },

  updateItem: async (itemId, quantity, price) => {
    const response = await api.put(`/cart-items/${itemId}`, {
      quantity,
      price,
    });
    return response.data;
  },

  deleteItem: async (itemId) => {
    const response = await api.delete(`/cart-items/${itemId}`);
    return response.data;
  },
};

export const orderAPI = {
  create: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get("/orders/my");
    return response.data;
  },
};

export const vnpayAPI = {
  createPaymentUrl: async (payload) => {
    const response = await api.post("/vnpay/create", payload);
    return response.data;
  },
};

export default api;
