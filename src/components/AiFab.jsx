import React, { useState } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AiAssistant from './AiAssistant';

const AiFab = ({ onAddTask }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Neural Core Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-45' : ''}`}
            >
                {/* Orb Layers */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 animate-spin-slow blur-sm opacity-75"></div>
                <div className="absolute inset-1 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    {isOpen ? (
                        <PlusIcon className="w-8 h-8 text-white/50" />
                    ) : (
                        <Bot className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    )}
                </div>
                {/* Pulse Ring */}
                {!isOpen && (
                    <div className="absolute -inset-2 rounded-full border border-indigo-500/30 animate-ping opacity-20"></div>
                )}
            </motion.button>

            {/* Pop-up Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                        className="fixed bottom-28 right-8 w-[380px] h-[550px] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <span className="font-medium text-white">AI Nexus</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden relative">
                            <AiAssistant onAddTask={onAddTask} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Helper for the close icon rotation effect
const PlusIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

export default AiFab;
