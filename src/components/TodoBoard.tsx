import { useEffect, useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchTodos, createTodo, editTodo, removeTodo, updateTodoStatus } from '../store/slices/todoSlice';
import { TodoLane } from './TodoLane';
import { AddTodoForm } from './AddTodoForm';
import { Todo, TodoStatus } from '../types/todo';
import { ArrowLeftRight, Info, AlertCircle, Plus, X } from 'lucide-react';

export const TodoBoard = () => {
  const dispatch = useAppDispatch();
  const { todos, loading, error, isInitialFetchDone } = useAppSelector((state) => state.todos);
  const [showHint, setShowHint] = useState(true);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Only fetch todos once when the component mounts
  useEffect(() => {
    if (!isInitialFetchDone) {
      dispatch(fetchTodos());
    }
  }, [dispatch, isInitialFetchDone]);
  
  useEffect(() => {
    // Hide hint after 10 seconds or if there's user interaction
    const timer = setTimeout(() => setShowHint(false), 10000);
    
    const hideOnInteraction = () => setShowHint(false);
    window.addEventListener('mousedown', hideOnInteraction);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', hideOnInteraction);
    };
  }, []);
  
  // Handle clicking outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAddForm(false);
      }
    };

    if (showAddForm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddForm]);
  
  // Add body class to prevent scrolling when modal is open
  useEffect(() => {
    if (showAddForm) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showAddForm]);
  
  // Auto-hide feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  
  const handleAddTodo = (todoText: string, status: TodoStatus) => {
    // Update local store only
    dispatch(createTodo({
      todo: todoText,
      completed: status === TodoStatus.COMPLETED,
      userId: 1,
      status
    }));
    
    // Show success feedback
    setFeedback({ 
      message: 'Task added successfully', 
      type: 'success' 
    });
    
    // Hide the add form after adding
    setShowAddForm(false);
  };
  
  const handleEditTodo = (id: number, updatedTodo: Partial<Todo>) => {
    // Update local store only
    dispatch(editTodo({ id, todoData: updatedTodo }));
    
    // Show success feedback
    setFeedback({ 
      message: 'Task updated successfully', 
      type: 'success' 
    });
  };
  
  const handleDeleteTodo = (id: number) => {
    // Update local store only
    dispatch(removeTodo(id));
    
    // Show success feedback
    setFeedback({ 
      message: 'Task deleted successfully', 
      type: 'success' 
    });
  };
  
  const handleStatusChange = (id: number, status: TodoStatus) => {
    const completed = status === TodoStatus.COMPLETED;
    
    // Update local store only - no API call
    dispatch(updateTodoStatus({ id, status }));
    
    // Show success feedback
    setFeedback({ 
      message: `Task moved to ${status.replace('-', ' ')}`, 
      type: 'success' 
    });
  };
  
  if (error && todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center py-6 px-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={32} />
          <h2 className="text-lg font-semibold text-red-700 mb-2">Failed to load tasks</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchTodos())}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const todosByStatus = {
    [TodoStatus.TODO]: todos.filter((todo: Todo) => todo.status === TodoStatus.TODO),
    [TodoStatus.IN_PROGRESS]: todos.filter((todo: Todo) => todo.status === TodoStatus.IN_PROGRESS),
    [TodoStatus.COMPLETED]: todos.filter((todo: Todo) => todo.status === TodoStatus.COMPLETED),
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Board</h1>
          
          {/* Main add task button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add Task
          </button>
        </div>
        
        {/* Modal on Desktop / Drawer on Mobile for Add Task */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center p-4 md:p-0">
            {/* Desktop Modal */}
            <div 
              ref={modalRef}
              className="hidden md:block bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
            >
              <button 
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
              <AddTodoForm onAdd={handleAddTodo} />
            </div>
            
            {/* Mobile Drawer */}
            <div className="md:hidden fixed inset-x-0 bottom-0 w-full bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 ease-in-out">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3"></div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                <AddTodoForm onAdd={handleAddTodo} />
              </div>
            </div>
          </div>
        )}
        
        {/* User feedback toast */}
        {feedback && (
          <div className={`fixed bottom-4 right-4 py-2 px-4 rounded-md shadow-lg transition-opacity duration-300 flex items-center gap-2 ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            feedback.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {feedback.type === 'success' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            {feedback.type === 'error' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
            {feedback.type === 'info' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            {feedback.message}
          </div>
        )}
        
        {/* Drag and drop hint for first-time users */}
        {showHint && todos.length > 0 && !loading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-sm text-blue-700 animate-dropPulse">
            <Info size={20} className="text-blue-500" />
            <div className="flex items-center">
              <span>Drag tasks between columns</span>
              <ArrowLeftRight size={16} className="mx-2 animate-wiggle" />
              <span>to change their status</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <TodoLane
            title="To Do"
            status={TodoStatus.TODO}
            todos={todosByStatus[TodoStatus.TODO]}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onQuickAdd={handleAddTodo}
            isLoading={loading && todos.length === 0}
          />
          
          <TodoLane
            title="In Progress"
            status={TodoStatus.IN_PROGRESS}
            todos={todosByStatus[TodoStatus.IN_PROGRESS]}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onQuickAdd={handleAddTodo}
            isLoading={loading && todos.length === 0}
          />
          
          <TodoLane
            title="Completed"
            status={TodoStatus.COMPLETED}
            todos={todosByStatus[TodoStatus.COMPLETED]}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onQuickAdd={handleAddTodo}
            isLoading={loading && todos.length === 0}
          />
        </div>
      </div>
    </DndProvider>
  );
}; 