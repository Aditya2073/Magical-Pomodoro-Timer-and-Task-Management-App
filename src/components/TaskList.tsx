import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2, Edit, Star, Scroll, Award } from 'lucide-react';
import { Task } from '../types';
import useSound from 'use-sound';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, task: Partial<Task>) => void;
  onAdd: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  onAdd
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const [playCompleteSound] = useSound('/sounds/quest-complete.mp3', { volume: 0.3 });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date().toISOString()
    };

    onAdd(newTask);
    setNewTaskTitle('');
    setNewTaskPriority('medium');
  };

  const handleStartEdit = (task: Task) => {
    setEditingTask(task.id);
    setNewTaskTitle(task.title);
    setNewTaskPriority(task.priority);
  };

  const handleSaveEdit = (id: string) => {
    if (!newTaskTitle.trim()) return;

    onEdit(id, {
      title: newTaskTitle.trim(),
      priority: newTaskPriority
    });
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskPriority('medium');
  };

  const handleToggleComplete = (id: string) => {
    onToggleComplete(id);
    playCompleteSound();
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="p-3 sm:p-6">
        <div className="quest-title text-magical text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
          <Scroll className="text-purple-400" size={20} />
          <h2>Quest Log</h2>
          <span className="text-xs sm:text-sm text-purple-400">
            {tasks.length} {tasks.length === 1 ? 'quest' : 'quests'}
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <form onSubmit={handleAddTask} className="space-y-2 sm:space-y-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter a new quest..."
              className="w-full px-3 sm:px-4 py-2 bg-gray-900/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/20 text-sm sm:text-base"
            />
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="magical-input rounded-lg px-2 sm:px-3 py-2 focus:outline-none bg-gray-900/50 text-white border border-purple-500/20 text-sm sm:text-base"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <button
                type="submit"
                className="magical-btn px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 text-sm sm:text-base"
              >
                <Plus size={18} />
                Add Quest
              </button>
            </div>
          </form>

          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`quest-item p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 bg-slate-800/50 border border-purple-500/30 rounded-lg ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                {editingTask === task.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1 magical-input rounded-lg px-3 py-2 focus:outline-none bg-slate-700/50 text-white border border-purple-500/30"
                    />
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="magical-input rounded-lg px-3 py-2 focus:outline-none bg-slate-700/50 text-white border border-purple-500/30"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="magical-btn px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                      >
                        {task.completed ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      <span className={`flex-1 text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </span>
                      <span className="priority-badge px-2 py-1 rounded-full text-xs">
                        <Star
                          size={16}
                          className={
                            task.priority === 'high'
                              ? 'text-red-400'
                              : task.priority === 'medium'
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }
                        />
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TaskList;