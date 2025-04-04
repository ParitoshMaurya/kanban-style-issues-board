import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoStatus } from '../../types/todo';
import { todoApi } from '../../services/todoApi';

// Define the initial state
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  isInitialFetchDone: boolean;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  isInitialFetchDone: false
};

// Async thunk for fetching todos
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const todos = await todoApi.getTodos();
      return todos;
    } catch (error) {
      return rejectWithValue('Failed to fetch todos.');
    }
  }
);

// For the following operations, we'll create regular actions instead of async thunks
// This lets us update the local state without making API calls

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Create a new todo (local only)
    createTodo: (state, action: PayloadAction<Omit<Todo, 'id'>>) => {
      const newTodo: Todo = {
        id: Math.max(0, ...state.todos.map(todo => todo.id)) + 1,
        ...action.payload
      };
      state.todos.push(newTodo);
    },
    
    // Update a todo (local only)
    editTodo: (state, action: PayloadAction<{ id: number; todoData: Partial<Todo> }>) => {
      const { id, todoData } = action.payload;
      const todoIndex = state.todos.findIndex(todo => todo.id === id);
      
      if (todoIndex !== -1) {
        state.todos[todoIndex] = {
          ...state.todos[todoIndex],
          ...todoData
        };
      }
    },
    
    // Delete a todo (local only)
    removeTodo: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.todos = state.todos.filter(todo => todo.id !== id);
    },
    
    // Update todo status (local only)
    updateTodoStatus: (state, action: PayloadAction<{ id: number; status: TodoStatus }>) => {
      const { id, status } = action.payload;
      const todoIndex = state.todos.findIndex(todo => todo.id === id);
      
      if (todoIndex !== -1) {
        state.todos[todoIndex].status = status;
        state.todos[todoIndex].completed = status === TodoStatus.COMPLETED;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.todos = action.payload.map((todo: any) => ({
          ...todo,
          status: todo.completed ? TodoStatus.COMPLETED : TodoStatus.TODO
        }));
        state.isInitialFetchDone = true;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { createTodo, editTodo, removeTodo, updateTodoStatus } = todoSlice.actions;

export default todoSlice.reducer; 