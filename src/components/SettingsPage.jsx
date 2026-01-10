import React from 'react';
import { Settings, Trash2, Moon, Bell, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = ({ onResetData, preferences, setPreferences, user, onLogout }) => {
    const togglePreference = (key) => {
        const newValue = !preferences[key];

        // Feedback logic
        if (key === 'notifications' && newValue) {
            Notification.requestPermission();
        }

        if (key === 'sound' && newValue) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }

        setPreferences(prev => ({
            ...prev,
            [key]: newValue
        }));
    };

    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        onLogout();
        setShowLogoutConfirm(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-8 flex flex-col relative">
            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-terminal-dim border border-terminal-accent/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terminal-accent to-transparent opacity-50"></div>

                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-terminal-accent/10 flex items-center justify-center mb-4">
                                    <Settings className="w-8 h-8 text-terminal-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-terminal-content mb-2">Terminating Session?</h3>
                                <p className="text-terminal-content/60">
                                    Are you sure you want to disconnect? Unsaved changes in the current buffer might be lost.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-2 rounded-xl border border-terminal-accent/20 text-terminal-content hover:bg-terminal-accent/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-4 py-2 rounded-xl bg-terminal-accent text-terminal-bg font-bold hover:bg-terminal-accent/90 transition-colors shadow-lg shadow-terminal-accent/20"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-3xl font-bold text-terminal-content mb-2">Settings</h1>
                <p className="text-terminal-content/60">Configure your workspace.</p>
            </motion.div>

            <div className="space-y-6 pb-12">
                {/* Profile Section */}
                {user && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-terminal-accent/10 flex items-center justify-center border border-terminal-accent/20">
                                <span className="text-xl font-bold text-terminal-accent">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-terminal-content">{user.name}</h2>
                                <p className="text-xs text-terminal-content/60 font-mono">OPERATOR // {user.avatar.toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogoutClick}
                            className="px-4 py-2 rounded-lg border border-terminal-accent/30 text-terminal-accent hover:bg-terminal-accent/10 transition-colors text-sm font-medium"
                        >
                            LOGOUT
                        </button>
                    </motion.div>
                )}

                {/* Preferences */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-semibold text-terminal-content mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-400" /> Preferences
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Moon className="w-5 h-5 text-terminal-content/60" />
                                <span className="text-terminal-content">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => togglePreference('darkMode')}
                                className={`w-10 h-6 rounded-full relative transition-colors ${preferences.darkMode ? 'bg-indigo-600' : 'bg-terminal-dim'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.darkMode ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-terminal-content/60" />
                                <span className="text-terminal-content">Notifications</span>
                            </div>
                            <button
                                onClick={() => togglePreference('notifications')}
                                className={`w-10 h-6 rounded-full relative transition-colors ${preferences.notifications ? 'bg-indigo-600' : 'bg-terminal-dim'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.notifications ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-5 h-5 text-terminal-content/60" />
                                <span className="text-terminal-content">Sound Effects</span>
                            </div>
                            <button
                                onClick={() => togglePreference('sound')}
                                className={`w-10 h-6 rounded-full relative transition-colors ${preferences.sound ? 'bg-indigo-600' : 'bg-terminal-dim'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.sound ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" /> Danger Zone
                    </h2>
                    <p className="text-sm text-terminal-content/60 mb-4">
                        Resetting your data will wipe all tasks, stats, and progress. This cannot be undone.
                    </p>
                    <button
                        onClick={onResetData}
                        className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors text-sm font-medium"
                    >
                        Reset All Data
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage;
