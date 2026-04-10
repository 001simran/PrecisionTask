'use client';

import { motion } from 'framer-motion';
import { 
  Circle,
  CheckCircle2,
  Trash2, 
  Edit2, 
  X
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface TaskItemProps {
  task: Task;
  editingId: string | null;
  editValue: string;
  onToggle: (id: string, stat: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  setEditValue: (val: string) => void;
  editInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function TaskItem({
  task,
  editingId,
  editValue,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  setEditValue,
  editInputRef
}: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`card p-4 flex items-center gap-4 group ${
        task.completed ? 'opacity-60 bg-slate-50' : 'bg-white'
      }`}
    >
      <button
        onClick={() => onToggle(task._id, task.completed)}
        className={`flex-shrink-0 transition-all ${
          task.completed ? 'text-blue-600' : 'text-slate-300 hover:text-slate-400'
        }`}
      >
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>

      <div className="flex-1 min-w-0">
        {editingId === task._id ? (
          <div className="flex gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit();
                if (e.key === 'Escape') onCancelEdit();
              }}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1 outline-none focus:border-blue-500 text-sm font-medium"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <span 
              onDoubleClick={() => onEdit(task)}
              className={`text-sm font-semibold truncate transition-colors cursor-pointer ${
                task.completed ? 'text-slate-500 line-through' : 'text-slate-800'
              }`}
            >
              {task.title}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Created {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {editingId === task._id ? (
          <>
            <button onClick={onSaveEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <CheckCircle2 size={16} />
            </button>
            <button onClick={onCancelEdit} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
