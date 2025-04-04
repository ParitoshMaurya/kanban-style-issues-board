import { describe, it, expect } from 'vitest';
import todoReducer, {
  createTodo,
  editTodo,
  removeTodo,
  updateTodoStatus
} from '../store/slices/todoSlice';
import { TodoStatus } from '../types/todo';

describe('todoSlice', () => {
  const initialState = {
    todos: [],
    loading: false,
    error: null,
    isInitialFetchDone: false
  };

  const mockTodos = [
    { id: 1, todo: 'Task 1', completed: false, userId: 1, status: TodoStatus.TODO },
    { id: 2, todo: 'Task 2', completed: false, userId: 1, status: TodoStatus.IN_PROGRESS }
  ];

  describe('Reducer actions', () => {
    it('handles pending fetch state', () => {
      const nextState = todoReducer(initialState, {
        type: 'todos/fetchTodos/pending'
      });
      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('handles successful fetch state', () => {
      const nextState = todoReducer(initialState, {
        type: 'todos/fetchTodos/fulfilled',
        payload: mockTodos
      });
      
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.todos.length).toBe(2);
      expect(nextState.isInitialFetchDone).toBe(true);
    });

    it('handles fetch error state', () => {
      const nextState = todoReducer(initialState, {
        type: 'todos/fetchTodos/rejected',
        payload: 'Failed to fetch todos'
      });
      
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Failed to fetch todos');
    });
  });

  describe('createTodo action', () => {
    it('adds a new todo to the state', () => {
      const state = {
        ...initialState,
        todos: [...mockTodos]
      };
      
      const action = createTodo({
        todo: 'New Task',
        completed: false,
        userId: 1,
        status: TodoStatus.TODO
      });
      
      const nextState = todoReducer(state, action);
      
      expect(nextState.todos.length).toBe(3);
      expect(nextState.todos[2].todo).toBe('New Task');
      // ID should auto-increment from the highest existing ID
      expect(nextState.todos[2].id).toBe(3);
    });
  });

  describe('editTodo action', () => {
    it('updates an existing todo', () => {
      const state = {
        ...initialState,
        todos: [...mockTodos]
      };
      
      const action = editTodo({
        id: 1,
        todoData: {
          todo: 'Updated Task',
          status: TodoStatus.COMPLETED,
          completed: true
        }
      });
      
      const nextState = todoReducer(state, action);
      
      expect(nextState.todos[0].todo).toBe('Updated Task');
      expect(nextState.todos[0].status).toBe(TodoStatus.COMPLETED);
      expect(nextState.todos[0].completed).toBe(true);
    });

    it('does not change state if todo id is not found', () => {
      const state = {
        ...initialState,
        todos: [...mockTodos]
      };
      
      const action = editTodo({
        id: 999, // Non-existent ID
        todoData: {
          todo: 'Updated Task'
        }
      });
      
      const nextState = todoReducer(state, action);
      
      // State should be unchanged
      expect(nextState.todos).toEqual(state.todos);
    });
  });

  describe('removeTodo action', () => {
    it('removes a todo from the state', () => {
      const state = {
        ...initialState,
        todos: [...mockTodos]
      };
      
      const action = removeTodo(1);
      const nextState = todoReducer(state, action);
      
      expect(nextState.todos.length).toBe(1);
      expect(nextState.todos[0].id).toBe(2); // Only the 2nd todo should remain
    });
  });

  describe('updateTodoStatus action', () => {
    it('updates the status and completed property of a todo', () => {
      const state = {
        ...initialState,
        todos: [...mockTodos]
      };
      
      const action = updateTodoStatus({
        id: 1,
        status: TodoStatus.COMPLETED
      });
      
      const nextState = todoReducer(state, action);
      
      expect(nextState.todos[0].status).toBe(TodoStatus.COMPLETED);
      expect(nextState.todos[0].completed).toBe(true);
    });
  });
}); 