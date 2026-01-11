import React from 'react';
import { Home, CheckSquare, Layout as LayoutIcon, Settings, User, Book, Trophy } from 'lucide-react';

const Layout = ({ children, currentPage, onNavigate }) => {
    return (
        <div className="flex h-screen bg-terminal-bg text-terminal-content overflow-hidden font-mono selection:bg-terminal-accent selection:text-terminal-bg">
            {/* CRT Overlay */}
            <div className="fixed inset-0 z-50 pointer-events-none crt-overlay"></div>
            <div className="fixed inset-0 z-40 pointer-events-none bg-gradient-to-b from-transparent to-black/20"></div>

            {/* Sidebar */}
            <aside className="fixed left-4 top-4 bottom-4 w-64 bg-terminal-bg backdrop-blur-xl border border-terminal-accent/20 rounded-2xl flex flex-col z-30 hidden md:flex shadow-2xl shadow-black/50">
                <div className="p-6 flex items-center gap-3 border-b border-terminal-accent/10">
                    <div className="w-10 h-10 flex items-center justify-center border border-terminal-accent/50 rounded-lg shadow-[0_0_10px_rgba(255,204,51,0.2)] bg-terminal-accent/5">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-terminal-accent fill-current" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" opacity="0.3" />
                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-widest uppercase text-shadow-glow text-terminal-accent">Struktify</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider ${currentPage === 'dashboard' ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/30 shadow-[0_0_10px_rgba(255,204,51,0.1)]' : 'border border-transparent text-terminal-accent/60 hover:bg-terminal-accent/5 hover:text-terminal-accent hover:border-terminal-accent/20'}`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button
                        onClick={() => onNavigate('tasks')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider ${currentPage === 'tasks' ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/30 shadow-[0_0_10px_rgba(255,204,51,0.1)]' : 'border border-transparent text-terminal-accent/60 hover:bg-terminal-accent/5 hover:text-terminal-accent hover:border-terminal-accent/20'}`}
                    >
                        <CheckSquare className="w-5 h-5" />
                        <span className="font-medium">Tasks</span>
                    </button>
                    <button
                        onClick={() => onNavigate('subjects')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider ${currentPage === 'subjects' ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/30 shadow-[0_0_10px_rgba(255,204,51,0.1)]' : 'border border-transparent text-terminal-accent/60 hover:bg-terminal-accent/5 hover:text-terminal-accent hover:border-terminal-accent/20'}`}
                    >
                        <Book className="w-5 h-5" />
                        <span className="font-medium">Subjects</span>
                    </button>
                    <button
                        onClick={() => onNavigate('stats')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider ${currentPage === 'stats' ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/30 shadow-[0_0_10px_rgba(255,204,51,0.1)]' : 'border border-transparent text-terminal-accent/60 hover:bg-terminal-accent/5 hover:text-terminal-accent hover:border-terminal-accent/20'}`}
                    >
                        <LayoutIcon className="w-5 h-5" />
                        <span className="font-medium">Stats</span>
                    </button>
                    <button
                        onClick={() => onNavigate('challenges')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider ${currentPage === 'challenges' ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/30 shadow-[0_0_10px_rgba(255,204,51,0.1)]' : 'border border-transparent text-terminal-accent/60 hover:bg-terminal-accent/5 hover:text-terminal-accent hover:border-terminal-accent/20'}`}
                    >
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">Challenges</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-terminal-accent/10">
                    <button
                        onClick={() => onNavigate('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider ${currentPage === 'settings' ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/30 shadow-[0_0_10px_rgba(255,204,51,0.1)]' : 'border border-transparent text-terminal-accent/60 hover:bg-terminal-accent/5 hover:text-terminal-accent hover:border-terminal-accent/20'}`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <header className="md:hidden absolute top-0 left-0 right-0 h-16 bg-terminal-dim/40 backdrop-blur-xl border-b border-terminal-accent/10 flex items-center justify-between px-4 z-20">
                <h1 className="text-xl font-bold text-terminal-accent tracking-tight flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    Struktify
                </h1>
                <div className="w-8 h-8 rounded-full bg-terminal-accent/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-terminal-accent" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-hidden relative z-10 pt-16 md:pt-0 md:pl-72">
                <div className="h-full overflow-y-auto custom-scrollbar p-4">
                    <div className={`w-full h-full ${currentPage === 'dashboard' ? '' : 'max-w-7xl mx-auto'}`}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
