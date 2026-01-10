import React, { useState } from 'react';
import { CheckSquare, Trash2, Plus, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = ({ tasks, setTasks, onCompleteTask }) => {
    const [newTask, setNewTask] = useState('');

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, {
            id: Date.now(),
            text: newTask,
            completed: false,
            priority: 'medium',
            deadline: null
        }]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const newCompleted = !t.completed;
                if (newCompleted && onCompleteTask) {
                    onCompleteTask(t.priority);
                }
                return { ...t, completed: newCompleted };
            }
            return t;
        }));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold text-terminal-content flex items-center gap-2 mb-4">
                <CheckSquare className="w-5 h-5 text-terminal-accent" />
                Tasks
            </h2>

            <form onSubmit={addTask} className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a quick task..."
                        className="w-full bg-terminal-dim/30 border border-terminal-accent/10 rounded-xl px-4 py-3 pl-10 text-terminal-content placeholder-terminal-content/40 focus:outline-none focus:border-terminal-accent/30 transition-colors"
                    />
                    <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-accent/40" />
                </div>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                <AnimatePresence>
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${task.completed
                                ? 'bg-terminal-dim/50 border-terminal-accent/5 opacity-50'
                                : 'bg-terminal-dim/30 border-terminal-accent/10 hover:bg-terminal-dim/40'
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed
                                    ? 'bg-indigo-500 border-indigo-500'
                                    : 'border-gray-500 hover:border-indigo-400'
                                    }`}
                            >
                                {task.completed && <CheckSquare className="w-3 h-3 text-white" />}
                            </button>

                            <span className={`text-sm flex-1 ${task.completed ? 'line-through text-terminal-content/40' : 'text-terminal-content'}`}>
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-terminal-content/40 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                    <div className="text-center py-8 text-terminal-content/40">
                        <p className="text-sm">No tasks yet. Stay focused.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
