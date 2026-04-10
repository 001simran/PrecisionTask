'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Loader2, 
  Search, 
  CheckCircle,
  Circle,
  Filter,
  Trash2,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import TaskItem from './TaskItem';

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

type FilterStatus = 'all' | 'active' | 'completed';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const editInputRef = useRef<HTMLInputElement>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (err: any) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/tasks', { title: newTaskTitle.trim() });
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
      toast.success('Task added successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      // Optimistic Update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: !currentStatus } : t));
      await axios.patch(`/api/tasks/${taskId}`, { completed: !currentStatus });
    } catch (err: any) {
      // Rollback
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: currentStatus } : t));
      toast.error('Update failed');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.filter(t => t._id !== taskId));
      await axios.delete(`/api/tasks/${taskId}`);
      toast.success('Task deleted');
    } catch (err: any) {
      fetchTasks();
      toast.error('Delete failed');
    }
  };

  const handleUpdateTitle = async () => {
    if (!editingId || !editValue.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const response = await axios.patch(`/api/tasks/${editingId}`, { title: editValue.trim() });
      setTasks(prev => prev.map(t => t._id === editingId ? { ...t, title: response.data.title } : t));
      setEditingId(null);
      toast.success('Title updated');
    } catch (err: any) {
      toast.error('Change failed');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'active' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (searchQuery.trim()) return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="lg:w-72 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="text-blue-600" size={24} />
            Task Manager
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Views</p>
          {(['all', 'active', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="capitalize">{status}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {status === 'all' ? tasks.length : status === 'active' ? activeCount : tasks.length - activeCount}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Action Row */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <h2 className="text-2xl font-bold text-slate-900">Your Tasks</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Add Task Box */}
          <section className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input 
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 font-medium"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting || !newTaskTitle.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed m-1"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={18} /> Add Task</>}
              </button>
            </form>
          </section>

          {/* Task List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {isLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-white animate-pulse rounded-xl border border-slate-100" />)}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No tasks found in this view.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem 
                    key={task._id}
                    task={task}
                    editingId={editingId}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={(t) => { setEditingId(t._id); setEditValue(t.title); setTimeout(() => editInputRef.current?.focus(), 50); }}
                    onSaveEdit={handleUpdateTitle}
                    onCancelEdit={() => setEditingId(null)}
                    editInputRef={editInputRef}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
