'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Edit2, 
  Check,
  X,
  Square,
  CheckSquare,
  Clock
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, stat: boolean) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string, title: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onSaveEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== task.title) {
      onSaveEdit(task._id, editValue);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="card-clean p-4 flex items-start gap-4 group cursor-default"
    >
      <button
        onClick={() => onToggle(task._id, task.completed)}
        className={`transition-all duration-300 mt-0.5 flex-shrink-0 active:scale-95 ${
          task.completed ? 'text-blue-500' : 'text-slate-200 hover:text-slate-400'
        }`}
      >
        {task.completed ? <CheckSquare size={20} strokeWidth={2.5} /> : <Square size={20} strokeWidth={1.5} />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="w-full bg-slate-50 border border-blue-400 rounded-md px-3 py-1 text-sm font-semibold text-slate-900 outline-none"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <span 
              onDoubleClick={() => setIsEditing(true)}
              className={`text-[15px] font-bold tracking-tight block cursor-text select-none transition-all duration-500 leading-snug ${
                task.completed ? 'text-slate-300 line-through decoration-slate-200 decoration-1' : 'text-slate-700'
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
               <Clock size={10} />
               <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
          title="Edit Entry"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
          title="Archive Task"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
