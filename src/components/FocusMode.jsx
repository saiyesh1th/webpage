import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusMode = ({ isActive, onClose, currentTask, timerState, toggleTimer, resetTimer }) => {
    if (!isActive) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-4 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group"
            >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Exit Zen Mode
                </span>
            </button>

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-gray-400 text-lg uppercase tracking-[0.2em] mb-4">Current Focus</h2>
                    <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight">
                        {currentTask || "No active task selected"}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center"
                >
                    <div className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-none tracking-tighter tabular-nums select-none">
                        {formatTime(timerState.timeLeft)}
                    </div>

                    <div className="flex items-center gap-8 mt-12">
                        <button
                            onClick={toggleTimer}
                            className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-white text-black hover:scale-110 transition-all duration-300"
                        >
                            {timerState.isRunning ? (
                                <Pause className="w-10 h-10 fill-current" />
                            ) : (
                                <Play className="w-10 h-10 fill-current ml-1" />
                            )}
                            <div className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:animate-ping"></div>
                        </button>

                        <button
                            onClick={resetTimer}
                            className="p-6 rounded-full bg-white/10 hover:bg-white/20 text-white hover:rotate-180 transition-all duration-500"
                        >
                            <RotateCcw className="w-8 h-8" />
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-12 text-gray-500 text-sm font-medium tracking-widest opacity-50">
                DEEP FOCUS MODE ACTIVE
            </div>
        </motion.div>
    );
};

export default FocusMode;
