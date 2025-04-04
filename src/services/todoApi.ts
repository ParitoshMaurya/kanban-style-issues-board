import { Todo } from '../types/todo';

// Base URL for the DummyJSON API
const API_URL = 'https://dummyjson.com';

export const todoApi = {
  // Fetch all todos
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_URL}/todos?limit=15`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.status}`);
      }
      
      const data = await response.json();
      return data.todos;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }
}; 