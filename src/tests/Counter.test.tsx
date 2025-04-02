import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '../store/reducers/rootReducer';
import { Counter } from '../components/Counter';

const createTestStore = () => createStore(rootReducer);

describe('Counter', () => {
  it('renders counter with initial state', () => {
    render(
      <Provider store={createTestStore()}>
        <Counter />
      </Provider>
    );

    expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument();
  });

  it('increments counter when increase button is clicked', () => {
    render(
      <Provider store={createTestStore()}>
        <Counter />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Increment'));
    expect(screen.getByText(/Counter: 1/i)).toBeInTheDocument();
  });

  it('decrements counter when decrease button is clicked', () => {
    render(
      <Provider store={createTestStore()}>
        <Counter />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Decrement'));
    expect(screen.getByText(/Counter: -1/i)).toBeInTheDocument();
  });

  it('increments counter by 5 when "Add 5" button is clicked', () => {
    render(
      <Provider store={createTestStore()}>
        <Counter />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add 5'));
    expect(screen.getByText(/Counter: 5/i)).toBeInTheDocument();
  });
});