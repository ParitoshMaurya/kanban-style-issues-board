import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoLane } from '../components/TodoLane';
import { Todo, TodoStatus } from '../types/todo';

// Mock the react-dnd hooks
vi.mock('react-dnd', () => ({
  useDrop: () => [{ isOver: false, canDrop: true }, vi.fn()],
  useDrag: () => [{ isDragging: false }, vi.fn(), vi.fn()],
  DndProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the TodoItem component
vi.mock('../components/TodoItem', () => ({
  TodoItem: ({ todo }: { todo: any }) => (
    <div data-testid={`todo-item-${todo.id}`}>{todo.todo}</div>
  )
}));

// Mock the Shimmer component
vi.mock('../components/Shimmer', () => ({
  Shimmer: ({ count }: { count: number }) => (
    <div data-testid="shimmer" data-count={count}>Loading...</div>
  )
}));

describe('TodoLane', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      todo: 'Test Todo 1',
      completed: false,
      userId: 1,
      status: TodoStatus.TODO
    },
    {
      id: 2,
      todo: 'Test Todo 2',
      completed: false,
      userId: 1,
      status: TodoStatus.TODO
    }
  ];

  const mockHandlers = {
    onStatusChange: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onQuickAdd: vi.fn()
  };

  it('renders lane title and todos count', () => {
    render(
      <TodoLane 
        title="To Do"
        status={TodoStatus.TODO}
        todos={mockTodos}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Count badge
  });

  it('shows loading shimmer when isLoading is true', () => {
    render(
      <TodoLane 
        title="To Do"
        status={TodoStatus.TODO}
        todos={[]}
        isLoading={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('shimmer')).toBeInTheDocument();
  });

  it('shows "No tasks" message when there are no todos', () => {
    render(
      <TodoLane 
        title="To Do"
        status={TodoStatus.TODO}
        todos={[]}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });
}); 