import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, ArrowUp, ArrowDown, Minus, Calendar, Clock, Sparkles, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSchedule, suggestResources } from '../services/aiService';

const TasksPage = ({ tasks, setTasks, onCompleteTask }) => {
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('medium');
    const [deadline, setDeadline] = useState('');

    // AI Optimize State
    const [showAiMenu, setShowAiMenu] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [availability, setAvailability] = useState('Today, 9 AM - 5 PM');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSchedule, setGeneratedSchedule] = useState(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // AI Resources State
    const [showResourcesModal, setShowResourcesModal] = useState(false);
    const [resourceSubject, setResourceSubject] = useState('');
    const [resources, setResources] = useState(null);
    const [isFetchingResources, setIsFetchingResources] = useState(false);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, {
            id: Date.now(),
            text: newTask,
            completed: false,
            priority,
            deadline: deadline ? new Date(deadline).toISOString() : null
        }]);
        setNewTask('');
        setPriority('medium');
        setDeadline('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const newCompleted = !t.completed;
                if (onCompleteTask) {
                    onCompleteTask(t.priority, newCompleted);
                }
                return { ...t, completed: newCompleted };
            }
            return t;
        }));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        // Sort by completion, then priority, then deadline
        if (a.completed !== b.completed) return a.completed ? 1 : -1;

        const pMap = { high: 3, medium: 2, low: 1 };
        if (pMap[a.priority] !== pMap[b.priority]) return pMap[b.priority] - pMap[a.priority];

        if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
        if (a.deadline) return -1;
        if (b.deadline) return 1;

        return 0;
    });

    const handleOptimize = () => {
        setShowAiMenu(false);
        setShowAvailabilityModal(true);
    };

    const handleGetResources = async (e) => {
        e.preventDefault();
        if (!resourceSubject.trim()) return;

        setIsFetchingResources(true);
        try {
            const result = await suggestResources(resourceSubject);
            setResources(result.text); // The result is a chat message object, we just want the text
        } catch (error) {
            console.error("Resources failed", error);
        } finally {
            setIsFetchingResources(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const result = await generateSchedule(tasks, availability);
            if (result.data) {
                setGeneratedSchedule(result.data);
                setShowAvailabilityModal(false);
                setShowScheduleModal(true);
            }
        } catch (error) {
            console.error("Optimization failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 h-full flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex justify-between items-end"
            >
                <div>
                    <h1 className="text-3xl font-bold text-terminal-content mb-2">Task Command Center</h1>
                    <p className="text-terminal-content/60">Manage your objectives and deadlines.</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowAiMenu(!showAiMenu)}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Bot className="w-4 h-4" />
                        AI Actions
                    </button>

                    <AnimatePresence>
                        {showAiMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-48 bg-terminal-dim border border-terminal-accent/10 rounded-xl shadow-xl overflow-hidden z-50"
                            >
                                <button
                                    onClick={handleOptimize}
                                    className="w-full text-left px-4 py-3 text-sm text-terminal-accent/80 hover:bg-terminal-accent/10 hover:text-terminal-accent flex items-center gap-2 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    Optimize Schedule
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAiMenu(false);
                                        setShowResourcesModal(true);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-terminal-accent/80 hover:bg-terminal-accent/10 hover:text-terminal-accent flex items-center gap-2 transition-colors"
                                >
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    Study Resources
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Input Area */}
            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={addTask}
                className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4"
            >
                <div className="flex-1">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full bg-transparent text-lg text-terminal-content placeholder-terminal-content/40 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-terminal-dim/50 rounded-lg px-3 py-2 border border-terminal-accent/5">
                        <Clock className="w-4 h-4 text-terminal-accent/60" />
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="bg-transparent text-sm text-terminal-content/80 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="bg-terminal-dim/50 text-sm text-terminal-content/80 rounded-lg px-3 py-2 border border-terminal-accent/5 focus:outline-none cursor-pointer"
                    >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>

                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 font-medium transition-colors">
                        Add Task
                    </button>
                </div>
            </motion.form>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                <AnimatePresence>
                    {sortedTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${task.completed
                                ? 'bg-terminal-dim/50 border-terminal-accent/5 opacity-50'
                                : 'bg-terminal-dim/30 border-terminal-accent/10 hover:border-indigo-500/30 hover:bg-terminal-dim/40'
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${task.completed
                                    ? 'bg-indigo-500 border-indigo-500'
                                    : 'border-gray-500 hover:border-indigo-400'
                                    }`}
                            >
                                {task.completed && <CheckSquare className="w-4 h-4 text-white" />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`text-base font-medium truncate ${task.completed ? 'line-through text-terminal-content/50' : 'text-terminal-content'}`}>
                                        {task.text}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                                        task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {task.priority}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                        +{task.priority === 'high' ? 30 : task.priority === 'medium' ? 20 : 10} XP
                                    </span>
                                </div>
                                {task.deadline && (
                                    <div className="flex items-center gap-2 text-xs text-terminal-content/50">
                                        <Calendar className="w-3 h-3" />
                                        <span>Due: {new Date(task.deadline).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg text-terminal-content/40 hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-terminal-dim/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckSquare className="w-8 h-8 text-terminal-content/40" />
                        </div>
                        <h3 className="text-xl font-medium text-terminal-content/60">No tasks yet</h3>
                        <p className="text-terminal-content/40 mt-2">Add a task to get started on your journey.</p>
                    </div>
                )}
            </div>

            {/* Availability Modal */}
            <AnimatePresence>
                {showAvailabilityModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-terminal-bg border border-terminal-accent/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-terminal-content mb-4 flex items-center gap-2">
                                <Bot className="w-5 h-5 text-purple-400" />
                                Optimize Schedule
                            </h2>
                            <p className="text-terminal-content/60 mb-4 text-sm">
                                Tell me your availability, and I'll arrange your tasks perfectly.
                            </p>
                            <form onSubmit={handleGenerate}>
                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-terminal-content/60 uppercase tracking-wider mb-2">
                                        Availability Window
                                    </label>
                                    <input
                                        type="text"
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        className="w-full bg-terminal-dim/30 border border-terminal-accent/10 rounded-lg px-4 py-3 text-terminal-content focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="e.g. Today 2pm - 6pm"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAvailabilityModal(false)}
                                        className="px-4 py-2 text-terminal-content/60 hover:text-terminal-content transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isGenerating}
                                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Generate Plan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Schedule Modal */}
            <AnimatePresence>
                {showScheduleModal && generatedSchedule && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-terminal-bg border border-terminal-accent/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 border-b border-terminal-accent/5 flex justify-between items-center bg-terminal-dim/30">
                                <h2 className="text-xl font-bold text-terminal-content flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-400" />
                                    Your Optimized Plan
                                </h2>
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="p-1 hover:bg-terminal-accent/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-terminal-content/60" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-3">
                                {generatedSchedule.map((item, i) => (
                                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${item.type === 'break'
                                        ? 'bg-green-500/5 border-green-500/10'
                                        : 'bg-terminal-dim/30 border-terminal-accent/10'
                                        }`}>
                                        <div className={`w-2 h-12 rounded-full ${item.type === 'break' ? 'bg-green-500' :
                                            item.priority === 'high' ? 'bg-red-500' :
                                                item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-mono text-terminal-content/60">{item.time}</span>
                                                {item.type !== 'break' && (
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                                                        item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                                                        }`}>
                                                        {item.priority}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className={`font-medium ${item.type === 'break' ? 'text-green-400' : 'text-terminal-content'}`}>
                                                {item.task}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-terminal-accent/5 bg-terminal-dim/30 flex justify-end">
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Let's do this! 🚀
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TasksPage;
