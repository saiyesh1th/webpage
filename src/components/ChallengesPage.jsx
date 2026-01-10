import React, { useState } from 'react';
import { Trophy, Plus, Calendar, Flame, Skull, PartyPopper, X, Check, ThumbsDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { funnyQuotes } from '../data/quotes';

const ChallengesPage = ({ challenges, setChallenges, addXp }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [challengeToDelete, setChallengeToDelete] = useState(null);
    const [newChallenge, setNewChallenge] = useState({ title: '', duration: 30, startDate: new Date().toISOString().split('T')[0] });

    const handleCreate = () => {
        if (!newChallenge.title) return;
        const challenge = {
            id: Date.now(),
            ...newChallenge,
            completedDays: 0,
            lastCheckIn: null,
            history: [], // Array of { date: string, success: boolean }
            status: 'active' // active, completed, failed
        };
        setChallenges(prev => [...prev, challenge]);
        setIsCreating(false);
        setNewChallenge({ title: '', duration: 30, startDate: new Date().toISOString().split('T')[0] });
    };

    const confirmDelete = (id, e) => {
        e.stopPropagation();
        setChallengeToDelete(id);
    };

    const handleDelete = () => {
        if (challengeToDelete) {
            setChallenges(prev => prev.filter(c => c.id !== challengeToDelete));
            setChallengeToDelete(null);
        }
    };

    const handleCheckIn = (success) => {
        if (!selectedChallenge) return;

        const today = new Date().toISOString().split('T')[0];

        // Prevent duplicate check-ins for the same day
        if (selectedChallenge.lastCheckIn === today) {
            setSelectedChallenge(null);
            return;
        }

        const newHistoryItem = { date: today, success };

        if (success) {
            // REWARD
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            addXp(10);

            setChallenges(prev => prev.map(c => {
                if (c.id === selectedChallenge.id) {
                    return {
                        ...c,
                        completedDays: c.completedDays + 1,
                        lastCheckIn: today,
                        history: [...(c.history || []), newHistoryItem]
                    };
                }
                return c;
            }));
        } else {
            // PUNISHMENT
            addXp(-20);
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log(e));

            // Update lastCheckIn even on failure to prevent re-asking
            setChallenges(prev => prev.map(c => {
                if (c.id === selectedChallenge.id) {
                    return {
                        ...c,
                        lastCheckIn: today,
                        history: [...(c.history || []), newHistoryItem]
                    };
                }
                return c;
            }));
        }

        setSelectedChallenge(null);
    };

    const getProgress = (challenge) => {
        const start = new Date(challenge.startDate);
        start.setHours(0, 0, 0, 0);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (now < start) {
            return 0; // Not started yet
        }

        const diffTime = now - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Cap progress at duration
        return Math.min(diffDays, challenge.duration);
    };

    const canCheckIn = (challenge) => {
        const today = new Date().toISOString().split('T')[0];
        return challenge.lastCheckIn !== today && getProgress(challenge) > 0;
    };

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-terminal-content mb-2 flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" /> Challenge Arena
                    </h1>
                    <p className="text-terminal-content/60">Prove your worth. Or don't. I'm just code.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="w-5 h-5" /> New Challenge
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {challenges.map((challenge) => {
                        const progress = getProgress(challenge);
                        const percent = progress > 0 ? (progress / challenge.duration) * 100 : 0;
                        const isCheckInAvailable = canCheckIn(challenge);

                        return (
                            <motion.div
                                key={challenge.id}
                                layoutId={challenge.id}
                                onClick={() => isCheckInAvailable && setSelectedChallenge(challenge)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-6 relative group overflow-hidden transition-all ${isCheckInAvailable ? 'cursor-pointer hover:border-indigo-500/50 hover:bg-terminal-dim/40' : ''}`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-1000"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-terminal-content">{challenge.title}</h3>
                                    <button
                                        onClick={(e) => confirmDelete(challenge.id, e)}
                                        className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Give Up (Shameful)"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-terminal-content/60 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{challenge.duration} Days</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm font-medium ${progress === 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                                        <Flame className="w-4 h-4" />
                                        <span>{progress === 0 ? 'Starts Soon' : `Day ${progress}`}</span>
                                    </div>
                                </div>

                                {/* History Visualization */}
                                <div className="flex gap-1 mb-4 flex-wrap">
                                    {Array.from({ length: challenge.duration }).map((_, i) => {
                                        const dayIndex = i;
                                        const targetDate = new Date(challenge.startDate);
                                        targetDate.setDate(targetDate.getDate() + dayIndex);
                                        const dateStr = targetDate.toISOString().split('T')[0];

                                        const record = (challenge.history || []).find(h => h.date === dateStr);

                                        let bgClass = 'bg-terminal-dim/20'; // Future/Unknown

                                        if (record) {
                                            bgClass = record.success ? 'bg-green-500' : 'bg-red-500';
                                        } else {
                                            // Check if this day is in the past
                                            const today = new Date().toISOString().split('T')[0];
                                            if (dateStr < today) {
                                                bgClass = 'bg-terminal-dim/10 border border-terminal-accent/10'; // Missed/Past
                                            }
                                        }

                                        return (
                                            <div
                                                key={i}
                                                className={`w-3 h-3 rounded-sm ${bgClass}`}
                                                title={`Day ${dayIndex + 1} (${dateStr}): ${record ? (record.success ? 'Sustained' : 'Failed') : 'No Record'}`}
                                            ></div>
                                        );
                                    })}
                                </div>

                                {isCheckInAvailable && (
                                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                        <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform scale-110">
                                            Click to Check In!
                                        </span>
                                    </div>
                                )}

                                <div className="bg-terminal-dim/50 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-terminal-content/60 italic">
                                        "{funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]}"
                                    </p>
                                </div>

                                {percent >= 100 ? (
                                    <div className="flex items-center justify-center gap-2 text-green-400 font-bold bg-green-500/10 p-2 rounded-lg">
                                        <PartyPopper className="w-5 h-5" /> COMPLETED!
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between text-xs text-terminal-content/60">
                                        <span>{Math.round(percent)}% Complete</span>
                                        <span>{challenge.duration - progress} days left</span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {challenges.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-terminal-content/40 border-2 border-dashed border-terminal-accent/10 rounded-3xl">
                        <Skull className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No active challenges.</p>
                        <p className="text-sm">Are you too scared to start one?</p>
                    </div>
                )}
            </div>

            {/* Check-In Modal */}
            <AnimatePresence>
                {selectedChallenge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setSelectedChallenge(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-terminal-bg border border-terminal-accent/10 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold text-terminal-content mb-2">{selectedChallenge.title}</h2>
                            <p className="text-terminal-content/60 mb-8">Day {getProgress(selectedChallenge)} Check-In</p>

                            <h3 className="text-xl font-semibold text-terminal-content mb-8">Did you survive today's challenge?</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleCheckIn(true)}
                                    className="flex flex-col items-center gap-3 p-6 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-2xl transition-all hover:scale-105 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] transition-shadow">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-green-400 font-bold text-lg">YES!</span>
                                    <span className="text-xs text-green-500/70">+10 XP & Glory</span>
                                </button>

                                <button
                                    onClick={() => handleCheckIn(false)}
                                    className="flex flex-col items-center gap-3 p-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl transition-all hover:scale-105 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-shadow">
                                        <ThumbsDown className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-red-400 font-bold text-lg">NO...</span>
                                    <span className="text-xs text-red-500/70">-20 XP & Shame</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {challengeToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setChallengeToDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-terminal-bg border border-terminal-accent/10 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-terminal-content mb-2">Give Up?</h2>
                            <p className="text-terminal-content/60 mb-8">
                                "Giving up already? That's disappointing. Are you sure you want to delete this challenge?"
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setChallengeToDelete(null)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-terminal-dim/30 hover:bg-terminal-dim/50 text-terminal-content/80 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-terminal-bg border border-terminal-accent/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-terminal-content mb-6">New Challenge</h2>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm text-terminal-content/60 mb-1">Challenge Name</label>
                                    <input
                                        type="text"
                                        value={newChallenge.title}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                        placeholder="e.g., No Sugar, 100 Pushups, Read 1hr"
                                        className="w-full bg-terminal-dim/50 border border-terminal-accent/10 rounded-xl px-4 py-3 text-terminal-content focus:border-indigo-500 outline-none"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-terminal-content/60 mb-1">Duration (Days)</label>
                                    <input
                                        type="number"
                                        value={newChallenge.duration}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, duration: parseInt(e.target.value) })}
                                        min="1"
                                        max="365"
                                        className="w-full bg-terminal-dim/50 border border-terminal-accent/10 rounded-xl px-4 py-3 text-terminal-content focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-terminal-content/60 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={newChallenge.startDate}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, startDate: e.target.value })}
                                        className="w-full bg-terminal-dim/50 border border-terminal-accent/10 rounded-xl px-4 py-3 text-terminal-content focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-terminal-dim/30 hover:bg-terminal-dim/50 text-terminal-content/80 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                                >
                                    Start Challenge
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChallengesPage;
