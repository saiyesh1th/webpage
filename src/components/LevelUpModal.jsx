import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export const getRank = (level) => {
    if (level >= 50) return "Time Lord";
    if (level >= 30) return "Grandmaster";
    if (level >= 20) return "Master of Focus";
    if (level >= 10) return "Adept Scholar";
    if (level >= 5) return "Apprentice";
    return "Novice";
};

const LevelUpModal = ({ level, onClose }) => {
    useEffect(() => {
        // Trigger confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#a855f7', '#ec4899']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#a855f7', '#ec4899']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const rank = getRank(level);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.5, y: 50, rotateX: 20 }}
                    animate={{ scale: 1, y: 0, rotateX: 0 }}
                    exit={{ scale: 0.5, y: 50, rotateX: 20 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="relative bg-gradient-to-b from-[#1a1a1a] to-black border border-indigo-500/50 rounded-3xl p-12 text-center max-w-lg w-full shadow-2xl shadow-indigo-500/50 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>

                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/40">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>

                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2 uppercase tracking-wider">
                            Level Up!
                        </h2>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            <span className="text-3xl font-bold text-white">Level {level}</span>
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">New Rank Unlocked</p>
                            <p className="text-2xl font-bold text-indigo-300">{rank}</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-white/20"
                        >
                            Continue Journey
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LevelUpModal;
