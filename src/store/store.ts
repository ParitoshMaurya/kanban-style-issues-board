import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer
  },
  devTools: true
});

// Define RootState based on the store's state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;