import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Edit, Trash2, Check, X, GripVertical } from 'lucide-react';
import { Todo, TodoStatus } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onEdit: (id: number, updatedTodo: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

export const TodoItem = ({ todo, onEdit, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);
  const [editStatus, setEditStatus] = useState<TodoStatus>(todo.status);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Update local state if todo changes
    setEditText(todo.todo);
    setEditStatus(todo.status);
  }, [todo]);
  
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'TODO_ITEM',
    item: () => {
      // Create ghost effect when starting drag
      if (itemRef.current) {
        const clientRect = itemRef.current.getBoundingClientRect();
        return { id: todo.id, width: clientRect.width, height: clientRect.height }
      }
      return { id: todo.id };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // Add dropped effect when successful
      if (monitor.didDrop()) {
        // Success animation could be added here
      }
    }
  }));
  
  // Apply cursor styles to document body during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = '';
    }
    
    return () => {
      document.body.style.cursor = '';
    };
  }, [isDragging]);
  
  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, { 
        todo: editText,
        status: editStatus,
        completed: editStatus === TodoStatus.COMPLETED
      });
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditText(todo.todo);
    setEditStatus(todo.status);
    setIsEditing(false);
  };
  
  // Use preview to handle the main component display
  preview(itemRef);
  
  // Get status display name
  const getStatusLabel = (status: TodoStatus) => {
    switch(status) {
      case TodoStatus.TODO: return 'To Do';
      case TodoStatus.IN_PROGRESS: return 'In Progress';
      case TodoStatus.COMPLETED: return 'Completed';
      default: return status;
    }
  };
  
  return (
    <div 
      ref={itemRef}
      className={`p-3 rounded-md shadow-sm border border-gray-200 bg-white mb-2
        ${isDragging ? 'opacity-50 transform scale-105 shadow-lg' : 'opacity-100 hover:shadow-md transition-shadow duration-200'} 
        transition-all duration-200`}
      style={{
        transform: isDragging ? 'rotate(2deg)' : undefined,
      }}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Task
          </label>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            autoFocus
          />
          
          <label className="text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as TodoStatus)}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          >
            <option value={TodoStatus.TODO}>To Do</option>
            <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
            <option value={TodoStatus.COMPLETED}>Completed</option>
          </select>
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={handleCancelEdit}
              className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100 text-sm"
              aria-label="Cancel edit"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveEdit}
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
              aria-label="Save edit"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2">
            {/* Drag handle */}
            <div 
              ref={drag}
              className="cursor-grab hover:bg-gray-100 rounded p-1"
            >
              <GripVertical size={16} className="text-gray-400" />
            </div>
            
            <div className="font-medium">{todo.todo}</div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className={`px-2 py-1 text-xs rounded ${
                todo.status === TodoStatus.COMPLETED
                  ? 'bg-green-100 text-green-800'
                  : todo.status === TodoStatus.IN_PROGRESS
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {getStatusLabel(todo.status)}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-blue-600 hover:bg-gray-100 transition-colors"
                aria-label="Edit todo"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete(todo.id)}
                className="p-1 rounded text-red-600 hover:bg-gray-100 transition-colors"
                aria-label="Delete todo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 