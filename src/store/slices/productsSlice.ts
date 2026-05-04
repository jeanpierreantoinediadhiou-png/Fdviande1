import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '@/lib/types';

export const fetchProducts = createAsyncThunk<Product[]>('products/fetchProducts', async () => {
  const response = await fetch('/api/products');
  return response.json();
});

export const addProduct = createAsyncThunk<Product, Product>('products/addProduct', async (product) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return response.json();
});

export const updateProduct = createAsyncThunk<Product, { id: string | number; [key: string]: any }>(
  'products/updateProduct',
  async ({ id, ...data }) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || 'Erreur lors de la mise à jour du produit');
    }
    return json.product ?? json;
  }
);

export const deleteProduct = createAsyncThunk<string, string | number>('products/deleteProduct', async (id) => {
  await fetch(`/api/products/${id}`, { method: 'DELETE' });
  return id.toString();
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
