import React from 'react';
import { motion } from 'framer-motion';

const FunnyProgressBar = ({ completed, total }) => {
    const percentage = total === 0 ? 0 : Math.min(100, Math.max(0, (completed / total) * 100));

    const getFunnyMessage = (pct) => {
        if (total === 0) return "Add some tasks. Don't be lazy.";
        if (pct === 0) return "Zero done. The panic is setting in.";
        if (pct < 30) return "A start is a start... I guess.";
        if (pct < 50) return "Keep pushing. Coffee helps.";
        if (pct < 80) return "Look at you go! Productivity beast.";
        if (pct < 100) return "Almost there. Don't choke now.";
        if (pct >= 100) return "ALL DONE? Go touch grass. 🌱";
        return "Working...";
    };

    return (
        <div className="w-full max-w-xs">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-terminal-accent uppercase tracking-wider">Daily Progress</span>
                <span className="text-[10px] text-terminal-accent/60 italic">{getFunnyMessage(percentage)}</span>
            </div>
            <div className="h-1.5 w-full bg-terminal-dim/30 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-terminal-accent"
                />
            </div>
            <div className="text-right mt-1">
                <span className="text-[10px] text-terminal-accent/50">{completed} / {total} Tasks</span>
            </div>
        </div>
    );
};

export default FunnyProgressBar;
