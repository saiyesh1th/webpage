import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal, Lock, Mail, UserPlus, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const LoginPage = ({ onLogin }) => {
    const [step, setStep] = useState('BOOT');
    const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' or 'SIGNUP'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Boot sequence
        const timer = setTimeout(() => {
            // Check for existing session
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    onLogin({
                        id: session.user.id,
                        email: session.user.email,
                        joinedAt: session.user.created_at,
                        authType: 'supabase'
                    });
                } else {
                    setStep('AUTH');
                }
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [onLogin]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (authMode === 'SIGNUP') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.session) {
                    onLogin({
                        id: data.user.id,
                        email: data.user.email,
                        joinedAt: data.user.created_at,
                        authType: 'supabase'
                    });
                } else if (data.user && !data.session) {
                    // User created but not authenticated (likely needs email confirmation)
                    setError('Account created! Please check your email to confirm your registration before logging in.');
                    setAuthMode('LOGIN');
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) {
                    onLogin({
                        id: data.user.id,
                        email: data.user.email,
                        joinedAt: data.user.created_at,
                        authType: 'supabase'
                    });
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
        setError(null);
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
                        <Typewriter text="> CONNECTING TO NETWORK..." delay={500} />
                        <Typewriter text="> ESTABLISHING SECURE UPLINK..." delay={1000} />
                    </motion.div>
                )}

                {step === 'AUTH' && (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-terminal-dim/30 border border-terminal-accent/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_30px_rgba(var(--terminal-accent),0.15)] relative z-10"
                    >
                        <div className="text-center mb-8">
                            <Terminal className="w-12 h-12 text-terminal-accent mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-terminal-accent mb-2">
                                {authMode === 'LOGIN' ? 'SYSTEM ACCESS' : 'NEW REGISTRATION'}
                            </h1>
                            <p className="text-terminal-content/60 text-sm">
                                {authMode === 'LOGIN' ? '> ENTER CREDENTIALS' : '> CREATE IDENTITY'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2"
                            >
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs text-terminal-accent/70 ml-1">EMAIL</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-accent/50" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-terminal-bg/50 border border-terminal-accent/20 rounded-xl pl-10 pr-4 py-3 text-terminal-content placeholder-terminal-content/20 focus:outline-none focus:border-terminal-accent/60 focus:shadow-[0_0_15px_rgba(var(--terminal-accent),0.1)] transition-all font-mono"
                                        placeholder="user@studysync.net"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-terminal-accent/70 ml-1">PASSWORD</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-accent/50" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-terminal-bg/50 border border-terminal-accent/20 rounded-xl pl-10 pr-4 py-3 text-terminal-content placeholder-terminal-content/20 focus:outline-none focus:border-terminal-accent/60 focus:shadow-[0_0_15px_rgba(var(--terminal-accent),0.1)] transition-all font-mono"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-terminal-accent text-terminal-bg font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(var(--terminal-accent),0.3)] hover:shadow-[0_0_30px_rgba(var(--terminal-accent),0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>{authMode === 'LOGIN' ? 'AUTHENTICATE' : 'INITIALIZE'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={toggleMode}
                                className="text-terminal-accent/70 hover:text-terminal-accent text-sm hover:underline flex items-center justify-center gap-2 w-full transition-colors"
                            >
                                {authMode === 'LOGIN' ? (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>CREATE NEW IDENTITY</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        <span>ACCESS EXISTING ACCOUNT</span>
                                    </>
                                )}
                            </button>
                        </div>
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
