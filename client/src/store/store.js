import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './features/products/productSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product : productReducer
  }
});