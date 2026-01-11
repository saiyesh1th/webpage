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
        <div className="min-h-screen bg-terminal-bg flex items-center justify-center font-mono text-terminal-accent p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-terminal-accent/10 animate-scanline"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.1)_0%,_rgba(0,0,0,0)_70%)]"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
            </div>

            <AnimatePresence mode="wait">
                {step === 'BOOT' && (
                    <motion.div
                        key="boot"
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        className="max-w-md w-full space-y-2 relative z-10"
                    >
                        <Typewriter text="> INITIALIZING SYSTEM..." delay={0} />
                        <Typewriter text="> CONNECTING TO NETWORK..." delay={300} />
                        <Typewriter text="> ESTABLISHING SECURE UPLINK..." delay={600} />
                        <Typewriter text="> ACCESS GRANTED." delay={900} />
                    </motion.div>
                )}

                {step === 'AUTH' && (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-md bg-black/60 border border-terminal-accent/30 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(var(--terminal-accent),0.1)] relative z-10 group"
                    >
                        {/* Decorative Corner Markers */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-terminal-accent rounded-tl-lg"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-terminal-accent rounded-tr-lg"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-terminal-accent rounded-bl-lg"></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-terminal-accent rounded-br-lg"></div>

                        <div className="text-center mb-8 relative">
                            <div className="w-16 h-16 mx-auto mb-4 bg-terminal-accent/10 rounded-full flex items-center justify-center border border-terminal-accent/30 shadow-[0_0_15px_rgba(var(--terminal-accent),0.2)] group-hover:shadow-[0_0_25px_rgba(var(--terminal-accent),0.4)] transition-all duration-500">
                                <Terminal className="w-8 h-8 text-terminal-accent" />
                            </div>
                            <h1 className="text-3xl font-bold text-terminal-accent mb-2 tracking-tight">
                                {authMode === 'LOGIN' ? 'SYSTEM ACCESS' : 'NEW REGISTRATION'}
                            </h1>
                            <p className="text-terminal-content/60 text-sm tracking-wide">
                                {authMode === 'LOGIN' ? '> PLEASE AUTHENTICATE' : '> INITIALIZE PROTOCOLS'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3 shadow-inner"
                            >
                                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-terminal-accent/80 ml-1 tracking-wider">EMAIL ADDRESS</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-accent/40 group-focus-within/input:text-terminal-accent transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-terminal-bg/40 border-2 border-terminal-accent/10 rounded-xl pl-12 pr-4 py-3.5 text-terminal-content placeholder-terminal-content/20 focus:outline-none focus:border-terminal-accent focus:bg-terminal-bg/60 transition-all font-mono shadow-inner"
                                        placeholder="user@struktify.net"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-terminal-accent/80 ml-1 tracking-wider">PASSWORD</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-accent/40 group-focus-within/input:text-terminal-accent transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-terminal-bg/40 border-2 border-terminal-accent/10 rounded-xl pl-12 pr-4 py-3.5 text-terminal-content placeholder-terminal-content/20 focus:outline-none focus:border-terminal-accent focus:bg-terminal-bg/60 transition-all font-mono shadow-inner"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-terminal-accent text-terminal-bg font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(var(--terminal-accent),0.2)] hover:shadow-[0_0_30px_rgba(var(--terminal-accent),0.4)] hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>{authMode === 'LOGIN' ? 'AUTHENTICATE' : 'INITIALIZE'}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-terminal-accent/10 pt-6">
                            <button
                                onClick={toggleMode}
                                className="text-terminal-accent/60 hover:text-terminal-accent text-sm hover:underline flex items-center justify-center gap-2 w-full transition-colors group/toggle"
                            >
                                {authMode === 'LOGIN' ? (
                                    <>
                                        <UserPlus className="w-4 h-4 group-hover/toggle:scale-110 transition-transform" />
                                        <span>CREATE NEW IDENTITY</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4 group-hover/toggle:scale-110 transition-transform" />
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
