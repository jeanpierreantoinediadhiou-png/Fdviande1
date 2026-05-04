import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
