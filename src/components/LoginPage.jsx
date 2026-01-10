import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [step, setStep] = useState('BOOT');
    const [name, setName] = useState('');

    useEffect(() => {
        // Boot sequence
        const timer = setTimeout(() => {
            const storedIdentity = localStorage.getItem('studysync-identity');
            if (storedIdentity) {
                try {
                    const identity = JSON.parse(storedIdentity);
                    onLogin(identity);
                } catch (e) {
                    console.error("Failed to parse identity", e);
                    setStep('INPUT');
                }
            } else {
                setStep('INPUT');
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [onLogin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const identity = {
            name: name.trim(),
            avatar: 'terminal', // Default avatar
            id: `user_${Date.now()}`,
            joinedAt: new Date().toISOString(),
            authType: 'manual'
        };

        localStorage.setItem('studysync-identity', JSON.stringify(identity));
        onLogin(identity);
    };

    return (
        <div className="min-h-screen bg-terminal-bg flex items-center justify-center font-mono text-terminal-accent p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-terminal-accent/20 animate-scanline"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
            </div>

            <AnimatePresence mode="wait">
                {step === 'BOOT' && (
                    <motion.div
                        key="boot"
                        exit={{ opacity: 0 }}
                        className="max-w-md w-full space-y-2"
                    >
                        <Typewriter text="> INITIALIZING SYSTEM..." delay={0} />
                        <Typewriter text="> LOADING MODULES..." delay={500} />
                        <Typewriter text="> CHECKING IDENTITY..." delay={1000} />
                    </motion.div>
                )}

                {step === 'INPUT' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-terminal-dim/30 border border-terminal-accent/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_30px_rgba(var(--terminal-accent),0.15)] relative z-10"
                    >
                        <div className="text-center mb-8">
                            <Terminal className="w-12 h-12 text-terminal-accent mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-terminal-accent mb-2">Identify Yourself</h1>
                            <p className="text-terminal-content/60 text-sm">&gt; ENTER CODENAME</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-terminal-bg/50 border border-terminal-accent/20 rounded-xl px-4 py-3 text-terminal-content placeholder-terminal-content/20 focus:outline-none focus:border-terminal-accent/60 focus:shadow-[0_0_15px_rgba(var(--terminal-accent),0.1)] transition-all font-mono text-center text-lg"
                                placeholder="Operator"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!name.trim()}
                                className="w-full bg-terminal-accent text-terminal-bg font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(var(--terminal-accent),0.3)] hover:shadow-[0_0_30px_rgba(var(--terminal-accent),0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>INITIALIZE</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Typewriter = ({ text, delay }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm"
        >
            {text}
        </motion.div>
    );
};

export default LoginPage;
