'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, Search, ClipboardList, CheckCircle } from 'lucide-react';
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

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (err: any) {
      toast.error('Could not load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('/tasks', { title: newTaskTitle.trim() });
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
      toast.success('Task created');
    } catch (err: any) {
      toast.error('Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: !currentStatus } : t));
      await axios.patch(`/tasks/${taskId}`, { completed: !currentStatus });
    } catch (err: any) {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: currentStatus } : t));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.filter(t => t._id !== taskId));
      await axios.delete(`/tasks/${taskId}`);
    } catch (err: any) {
      fetchTasks();
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    try {
      const response = await axios.patch(`/tasks/${id}`, { title: newTitle.trim() });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, title: response.data.title } : t));
    } catch (err: any) {
      toast.error('Update failed');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && !task.completed) || 
      (filterStatus === 'completed' && task.completed);
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-l-4 border-blue-600 pl-4">
            Task Manager
          </h1>
          <p className="text-sm text-slate-400 pl-5 font-medium italic">Practical Assessment Release</p>
        </div>
        <ClipboardList className="text-slate-200" size={40} />
      </header>

      {/* Input Section */}
      <div className="space-y-6">
        <form onSubmit={handleAddTask} className="flex gap-3">
          <input 
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="No tasks yet. Add one to get started!"
            className="input-standard shadow-sm bg-white"
            disabled={isSubmitting}
          />
          <button 
            type="submit"
            disabled={isSubmitting || !newTaskTitle.trim()}
            className="btn-blue flex items-center justify-center gap-2 min-w-[124px]"
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin" /> Adding...</>
            ) : (
              <><Plus size={18} strokeWidth={2.5} /> Add Task</>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-6 px-1">
          <nav className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
            {(['all', 'active', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === status 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="capitalize">{status}</span>
              </button>
            ))}
          </nav>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter objectives..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-700 outline-none focus:border-blue-200 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Unified Task Ecosystem */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="mx-auto text-blue-200 animate-spin" size={32} />
              <p className="text-sm font-semibold text-slate-300 tracking-widest uppercase">Initializing Stream...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-white/50"
            >
              <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                <Plus className="text-slate-200" size={24} />
              </div>
              <p className="text-sm font-bold text-slate-400">No tasks yet. Add one to get started!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTasks.map((task) => (
                <TaskItem 
                  key={task._id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onSaveEdit={handleUpdateTitle}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Optimized Stats Footer */}
      <footer className="pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-3">
           <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-400">
             {tasks.filter(t => !t.completed).length} Pending
           </span>
           <span className="bg-blue-50 px-2 py-1 rounded border border-blue-100 text-blue-400">
             {tasks.filter(t => t.completed).length} Success
           </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-400" size={12} />
          <span>Local Persistance Active</span>
        </div>
      </footer>
    </div>
  );
}
