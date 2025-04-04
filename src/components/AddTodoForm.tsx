import { useState } from 'react';
import { TodoStatus } from '../types/todo';

interface AddTodoFormProps {
  onAdd: (todo: string, status: TodoStatus) => void;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [todoText, setTodoText] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.TODO);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoText.trim()) {
      onAdd(todoText, status);
      setTodoText('');
      setStatus(TodoStatus.TODO);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="todoText" className="block text-sm font-medium text-gray-700 mb-1">
          Task
        </label>
        <input
          id="todoText"
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full p-2 border border-gray-300 rounded"
          autoFocus
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TodoStatus)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value={TodoStatus.TODO}>To Do</option>
          <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
          <option value={TodoStatus.COMPLETED}>Completed</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={!todoText.trim()}
        >
          Add Task
        </button>
      </div>
    </form>
  );
}; 