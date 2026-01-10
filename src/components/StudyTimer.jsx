import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const StudyTimer = ({ timerState, toggleTimer, resetTimer, setTimerMode }) => {
    const { timeLeft, isActive, mode } = timerState;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            {/* Mode Selectors */}
            <div className="flex gap-2 mb-8 bg-terminal-dim/20 p-1 rounded-full backdrop-blur-sm">
                {['focus', 'shortBreak', 'longBreak'].map((m) => (
                    <button
                        key={m}
                        onClick={() => setTimerMode(m)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${mode === m
                            ? 'bg-terminal-accent text-terminal-bg shadow-lg shadow-terminal-accent/25'
                            : 'text-terminal-accent/60 hover:text-terminal-accent hover:bg-terminal-accent/5'
                            }`}
                    >
                        {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="relative mb-8 group cursor-pointer" onClick={toggleTimer}>
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-terminal-accent/20 blur-3xl rounded-full transition-opacity duration-700 ${isActive ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}></div>

                <div className="text-[6rem] md:text-[8rem] font-bold text-terminal-accent tracking-tighter leading-none font-mono select-none relative z-10 drop-shadow-2xl transition-colors">
                    {formatTime(timeLeft)}
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-sm text-terminal-accent/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isActive ? 'Click to Pause' : 'Click to Start'}
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-6">
                <button
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isActive
                        ? 'bg-terminal-dim/50 hover:bg-terminal-dim/70 text-terminal-accent border border-terminal-accent/10'
                        : 'bg-terminal-accent hover:bg-terminal-accent/90 text-terminal-bg hover:scale-105 hover:shadow-terminal-accent/25'
                        }`}
                >
                    {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>

                <button
                    onClick={resetTimer}
                    className="w-16 h-16 rounded-full bg-terminal-dim/30 hover:bg-terminal-dim/50 text-terminal-accent/70 hover:text-terminal-accent border border-terminal-accent/5 flex items-center justify-center transition-all duration-300 hover:rotate-180"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default StudyTimer;
