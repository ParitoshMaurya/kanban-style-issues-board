import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../components/TodoItem';
import { Todo, TodoStatus } from '../types/todo';

// Mock the react-dnd hooks
vi.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, vi.fn(), vi.fn()],
}));

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    todo: 'Test Todo',
    completed: false,
    userId: 1,
    status: TodoStatus.TODO
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders todo item correctly', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('shows edit form when edit button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Find and click the edit button
    const editButton = screen.getByLabelText('Edit todo');
    fireEvent.click(editButton);

    // Check if the form is displayed by looking for expected elements
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onEdit with updated data when save button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Enter edit mode
    fireEvent.click(screen.getByLabelText('Edit todo'));

    // Change the task text using the input directly
    const taskInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(taskInput, { target: { value: 'Updated Todo' } });

    // Change the status
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: TodoStatus.COMPLETED } });

    // Save the changes
    fireEvent.click(screen.getByText('Save'));

    // Check if onEdit was called with the right data
    expect(mockOnEdit).toHaveBeenCalledWith(1, {
      todo: 'Updated Todo',
      status: TodoStatus.COMPLETED,
      completed: true
    });
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Find and click the delete button
    const deleteButton = screen.getByLabelText('Delete todo');
    fireEvent.click(deleteButton);

    // Check if onDelete was called with the todo id
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
}); 