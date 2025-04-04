import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Todo, TodoStatus } from '../types/todo';
import { TodoItem } from './TodoItem';
import { Shimmer } from './Shimmer';
import { MoveHorizontal, Plus } from 'lucide-react';

interface TodoLaneProps {
  title: string;
  status: TodoStatus;
  todos: Todo[];
  onStatusChange: (id: number, status: TodoStatus) => void;
  onEdit: (id: number, updatedTodo: Partial<Todo>) => void;
  onDelete: (id: number) => void;
  onQuickAdd: (text: string, status: TodoStatus) => void;
  isLoading?: boolean;
}

export const TodoLane = ({ 
  title, 
  status, 
  todos, 
  onStatusChange,
  onEdit,
  onDelete,
  onQuickAdd,
  isLoading = false
}: TodoLaneProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TODO_ITEM',
    canDrop: (item: { id: number }) => {
      // Find the todo item
      const draggedTodo = todos.find(todo => todo.id === item.id);
      // Prevent dropping in the same lane
      return !draggedTodo || draggedTodo.status !== status;
    },
    drop: (item: { id: number }) => {
      onStatusChange(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));
  
  // Determine the appearance of the lane based on drag state
  const isActive = isOver && canDrop;
  
  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onQuickAdd(newTaskText, status);
      setNewTaskText('');
      setIsAddingTask(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskText('');
    }
  };
  
  return (
    <div 
      className={`flex-1 min-w-[300px] p-4 rounded-lg transition-all duration-200 flex flex-col
        ${isActive 
          ? 'bg-blue-50 border-2 border-blue-300 shadow-md scale-[1.02]' 
          : canDrop 
            ? 'bg-gray-50 border-2 border-gray-200' 
            : 'bg-gray-50 border-2 border-transparent'
        }`}
      ref={drop}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {title}
          {isActive && (
            <MoveHorizontal size={18} className="text-blue-500 animate-pulse" />
          )}
        </h2>
        <div className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-600 font-medium">
          {isLoading ? '...' : todos.length}
        </div>
      </div>
      
      <div className="space-y-2 flex-1">
        {isLoading ? (
          <Shimmer count={2} />
        ) : (
          <>
            {todos.map((todo) => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
            
            {/* Empty state with drop indicator */}
            {todos.length === 0 && !isLoading && !isAddingTask && (
              <div className={`p-4 text-center rounded-md border-2 border-dashed transition-colors
                ${isActive 
                  ? 'border-blue-300 bg-blue-50 text-blue-500' 
                  : 'border-gray-300 bg-gray-50 text-gray-500'
                }`}>
                {isActive 
                  ? 'Drop here!' 
                  : 'No tasks'}
              </div>
            )}
          </>
        )}
        
        {/* Quick add task input */}
        {isAddingTask && (
          <div className="p-3 border border-gray-200 rounded-md bg-white shadow-sm">
            <input
              type="text"
              placeholder="What needs to be done?"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!newTaskText.trim()}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add task button at bottom of lane */}
      {!isAddingTask && !isLoading && (
        <button
          onClick={() => setIsAddingTask(true)}
          className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
        >
          <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" />
          Add a task
        </button>
      )}
    </div>
  );
}; 