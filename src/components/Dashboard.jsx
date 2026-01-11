import React, { useState, useEffect } from 'react';
import { Brain, Activity, Quote, Music, Zap, Trophy, Star, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StudyTimer from './StudyTimer';
import CalendarWidget from './CalendarWidget';
import FunnyProgressBar from './FunnyProgressBar';
import AmbientPlayer from './AmbientPlayer';

import { motivationalQuotes } from '../data/quotes';

const container = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Dashboard = ({
    tasks,
    stats,
    notes,
    onUpdateNote,
    focusedTaskId,
    setFocusedTaskId,
    timerState,
    toggleTimer,
    resetTimer,
    setTimerMode,
    onEnterFocusMode,
    preferences
}) => {
    const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
    const [isSelectingFocus, setIsSelectingFocus] = useState(false);

    useEffect(() => {
        // Random quote on mount
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        setCurrentQuote(motivationalQuotes[randomIndex]);

        // Rotate quote every 5 minutes (less frequent to avoid annoyance)
        const interval = setInterval(() => {
            const newIndex = Math.floor(Math.random() * motivationalQuotes.length);
            setCurrentQuote(motivationalQuotes[newIndex]);
        }, 300000);

        return () => clearInterval(interval);
    }, []);
    const focusedTask = tasks.find(t => t.id === focusedTaskId);
    const availableTasks = tasks.filter(t => !t.completed);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col lg:flex-row w-full h-full"
        >
            {/* LEFT COLUMN: FOCUS ZONE (65%) */}
            <div className="flex-1 lg:flex-[0.65] flex flex-col justify-center items-center p-6 relative">

                {/* Floating Header Stats - Funny Progress Bar */}
                <motion.div variants={item} className="absolute top-8 left-8 w-64">
                    <FunnyProgressBar completed={tasks.filter(t => t.completed).length} total={tasks.length} />
                </motion.div>

                {/* Zen Mode Trigger */}
                <motion.button
                    variants={item}
                    onClick={onEnterFocusMode}
                    className="absolute top-8 right-8 p-3 rounded-full bg-terminal-dim/30 hover:bg-terminal-dim/50 text-terminal-content/60 hover:text-terminal-accent transition-all group"
                    title="Enter Deep Focus Mode"
                >
                    <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </motion.button>

                {/* Timer - Floating */}
                <motion.div variants={item} className="scale-125 mb-12">
                    <StudyTimer
                        timerState={timerState}
                        toggleTimer={toggleTimer}
                        resetTimer={resetTimer}
                        setTimerMode={setTimerMode}
                    />
                </motion.div>

                {/* Current Objective - Interactive Pill */}
                <motion.div variants={item} className="relative z-20">
                    <button
                        onClick={() => setIsSelectingFocus(!isSelectingFocus)}
                        className="bg-terminal-dim/30 backdrop-blur-md border border-terminal-accent/10 px-6 py-3 rounded-full flex items-center gap-3 hover:bg-terminal-dim/50 transition-all cursor-pointer group shadow-lg shadow-black/10"
                    >
                        <div className={`w-2 h-2 rounded-full ${focusedTask ? 'bg-indigo-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className="text-terminal-content/70">Objective: <span className="text-terminal-accent font-semibold group-hover:text-indigo-400 transition-colors">{focusedTask ? focusedTask.text : 'Select a Focus...'}</span></span>
                    </button>

                    {/* Focus Selector Dropdown */}
                    <AnimatePresence>
                        {isSelectingFocus && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-72 bg-terminal-bg border border-terminal-accent/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {availableTasks.length > 0 ? (
                                        availableTasks.map(task => (
                                            <button
                                                key={task.id}
                                                onClick={() => {
                                                    setFocusedTaskId(task.id);
                                                    setIsSelectingFocus(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${focusedTaskId === task.id ? 'bg-indigo-600 text-white' : 'text-terminal-content/80 hover:bg-terminal-dim/50'}`}
                                            >
                                                {task.text}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-center text-terminal-content/50 text-sm">
                                            No active tasks found.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>

            {/* RIGHT COLUMN: UTILITY PANEL (35%) */}
            <div className="flex-1 lg:flex-[0.35] flex flex-col gap-6 h-full border-l border-terminal-accent/10 bg-terminal-dim/30 backdrop-blur-sm p-8">

                {/* Calendar / Today's Focus Widget */}
                <motion.div variants={item} className="flex-1 flex flex-col min-h-0">
                    <CalendarWidget tasks={tasks} notes={notes} onUpdateNote={onUpdateNote} />
                </motion.div>

                {/* Ambient Player */}
                <motion.div variants={item}>
                    <AmbientPlayer />
                </motion.div>

                {/* Filler: Quote */}
                <motion.div variants={item} className="h-32 terminal-card bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <Quote className="absolute top-4 right-4 w-6 h-6 text-terminal-content/10 group-hover:text-terminal-accent/20 transition-colors" />
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentQuote.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-sm font-medium text-terminal-content/90 italic leading-relaxed">"{currentQuote.text}"</p>
                            <p className="text-xs text-terminal-content/60 mt-2">— {currentQuote.author}</p>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Dashboard;
