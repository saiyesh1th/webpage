import React from 'react';
import { Trophy, Star, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { getRank } from './LevelUpModal';

const StatsPage = ({ stats }) => {
    const xpPercentage = (stats.xp / stats.maxXp) * 100;
    const rank = getRank(stats.level);

    const achievements = [
        {
            id: 'first-steps',
            title: 'First Steps',
            description: 'Reach Level 2',
            icon: <Target className="w-6 h-6" />,
            condition: (s) => s.level >= 2,
            color: 'text-blue-400',
            bg: 'bg-blue-500/20'
        },
        {
            id: 'on-fire',
            title: 'On Fire',
            description: 'Reach a 3-day streak',
            icon: <Zap className="w-6 h-6" />,
            condition: (s) => s.streak >= 3,
            color: 'text-orange-400',
            bg: 'bg-orange-500/20'
        },
        {
            id: 'task-master',
            title: 'Task Master',
            description: 'Complete 10 tasks',
            icon: <Trophy className="w-6 h-6" />,
            condition: (s) => s.totalTasksCompleted >= 10,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/20'
        },
        {
            id: 'scholar',
            title: 'Scholar',
            description: 'Reach Level 5',
            icon: <Star className="w-6 h-6" />,
            condition: (s) => s.level >= 5,
            color: 'text-purple-400',
            bg: 'bg-purple-500/20'
        },
        {
            id: 'unstoppable',
            title: 'Unstoppable',
            description: 'Reach a 7-day streak',
            icon: <TrendingUp className="w-6 h-6" />,
            condition: (s) => s.streak >= 7,
            color: 'text-red-400',
            bg: 'bg-red-500/20'
        },
        {
            id: 'grandmaster',
            title: 'Grandmaster',
            description: 'Reach Level 10',
            icon: <Target className="w-6 h-6" />,
            condition: (s) => s.level >= 10,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/20'
        },
        {
            id: 'night-owl',
            title: 'Night Owl',
            description: 'Active after 10 PM',
            icon: <Star className="w-6 h-6" />,
            condition: (s) => {
                const hour = new Date(s.lastActive).getHours();
                return hour >= 22 || hour < 4;
            },
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/20'
        },
        {
            id: 'early-bird',
            title: 'Early Bird',
            description: 'Active before 7 AM',
            icon: <Zap className="w-6 h-6" />,
            condition: (s) => {
                const hour = new Date(s.lastActive).getHours();
                return hour >= 4 && hour < 7;
            },
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/20'
        },
        {
            id: 'completionist',
            title: 'Completionist',
            description: 'Complete 50 tasks',
            icon: <Trophy className="w-6 h-6" />,
            condition: (s) => s.totalTasksCompleted >= 50,
            color: 'text-pink-400',
            bg: 'bg-pink-500/20'
        },
        {
            id: 'legend',
            title: 'Legend',
            description: 'Reach Level 20',
            icon: <Target className="w-6 h-6" />,
            condition: (s) => s.level >= 20,
            color: 'text-amber-400',
            bg: 'bg-amber-500/20'
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-8 h-full flex flex-col overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 shrink-0"
            >
                <h1 className="text-3xl font-bold text-terminal-content mb-2">Your Legacy</h1>
                <p className="text-terminal-content/60">Track your journey to mastery.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 shrink-0">
                {/* Level Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-full bg-black/30 border-4 border-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-5xl font-bold text-white">{stats.level}</span>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Level {stats.level} {rank}</h2>
                                    <p className="text-indigo-300">Keep flowing to reach the next tier.</p>
                                </div>
                                <span className="text-xl font-mono text-white">{stats.xp} / {stats.maxXp} XP</span>
                            </div>

                            <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpPercentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Streak Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-6 flex items-center gap-6"
                >
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                        <p className="text-terminal-content/60 text-sm uppercase tracking-wider font-medium">Current Streak</p>
                        <h3 className="text-3xl font-bold text-terminal-content">{stats.streak} Days</h3>
                    </div>
                </motion.div>

                {/* Total Tasks Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-6 flex items-center gap-6"
                >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                        <Target className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-terminal-content/60 text-sm uppercase tracking-wider font-medium">Tasks Completed</p>
                        <h3 className="text-3xl font-bold text-terminal-content">{stats.totalTasksCompleted || 0}</h3>
                    </div>
                </motion.div>
            </div>

            {/* Achievements Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-2"
            >
                <h2 className="text-xl font-bold text-terminal-content mb-4 flex items-center gap-2 sticky top-0 bg-terminal-bg/95 backdrop-blur-sm py-2 z-10">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Achievements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                    {achievements.map((achievement) => {
                        const isUnlocked = achievement.condition(stats);
                        return (
                            <div
                                key={achievement.id}
                                className={`p-4 rounded-xl border transition-all duration-300 ${isUnlocked
                                    ? 'bg-terminal-dim/50 border-terminal-accent/20 shadow-lg'
                                    : 'bg-terminal-dim/30 border-terminal-accent/5 opacity-50 grayscale'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${isUnlocked ? achievement.bg : 'bg-terminal-dim'}`}>
                                        <div className={isUnlocked ? achievement.color : 'text-terminal-accent/40'}>
                                            {achievement.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isUnlocked ? 'text-terminal-accent' : 'text-terminal-content/50'}`}>
                                            {achievement.title}
                                        </h3>
                                        <p className="text-sm text-terminal-content/60 mt-1">
                                            {achievement.description}
                                        </p>
                                        {isUnlocked && (
                                            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                                Unlocked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default StatsPage;
