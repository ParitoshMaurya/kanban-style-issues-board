import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import todoReducer from '../store/slices/todoSlice';

// Create a simplified test store
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      todos: todoReducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      })
  });
}

// Wrapper for rendering with Redux Provider and DndProvider
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
}

export function renderWithProviders(
  ui: ReactElement,
  options: ExtendedRenderOptions = {}
) {
  const { preloadedState = {}, ...renderOptions } = options;
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          {children}
        </DndProvider>
      </Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
} 