export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  status: TodoStatus;
  description?: string;
}

export enum TodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  isInitialFetchDone: boolean;
} 