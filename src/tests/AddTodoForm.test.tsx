import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddTodoForm } from '../components/AddTodoForm';
import { TodoStatus } from '../types/todo';

describe('AddTodoForm', () => {
  it('renders form elements correctly', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodoForm onAdd={mockOnAdd} />);

    // Check if form elements are rendered
    expect(screen.getByLabelText('Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('calls onAdd with form data when submitted', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodoForm onAdd={mockOnAdd} />);

    // Fill in the form
    const taskInput = screen.getByLabelText('Task');
    fireEvent.change(taskInput, { target: { value: 'New Task' } });

    // Submit the form by clicking the button
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);

    // Check if onAdd was called with the right data
    expect(mockOnAdd).toHaveBeenCalledWith('New Task', TodoStatus.TODO);
  });
}); 