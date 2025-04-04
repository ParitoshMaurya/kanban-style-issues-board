import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import { TodoBoard } from '../components/TodoBoard';
import { TodoStatus } from '../types/todo';

// Mock the child components to simplify testing
vi.mock('../components/TodoLane', () => ({
  TodoLane: ({ title }: { title: string }) => (
    <div data-testid={`lane-${title}`}>{title}</div>
  ),
}));

vi.mock('../components/AddTodoForm', () => ({
  AddTodoForm: () => <div data-testid="add-form">Add Form</div>,
}));

// Mock the redux hooks
vi.mock('../hooks/useAppDispatch', () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock('../hooks/useAppSelector', () => ({
  useAppSelector: () => ({
    todos: [
      { id: 1, todo: 'Test Todo', status: TodoStatus.TODO, completed: false, userId: 1 },
    ],
    loading: false,
    error: null,
    isInitialFetchDone: true,
  }),
}));

describe('TodoBoard component', () => {
  it('renders the board with lanes', () => {
    renderWithProviders(<TodoBoard />);
    
    expect(screen.getByTestId('lane-To Do')).toBeInTheDocument();
    expect(screen.getByTestId('lane-In Progress')).toBeInTheDocument();
    expect(screen.getByTestId('lane-Completed')).toBeInTheDocument();
  });
  
  it('opens AddTodoForm modal when Add Task button is clicked', () => {
    renderWithProviders(<TodoBoard />);
    
    // Click the Add Task button
    fireEvent.click(screen.getByText('Add Task'));
    
    // Check that the form is displayed - use getAllByTestId since there might be multiple instances in responsive design
    expect(screen.getAllByTestId('add-form')).not.toHaveLength(0);
  });
}); 