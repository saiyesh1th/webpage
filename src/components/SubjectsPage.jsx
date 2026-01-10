import React, { useState } from 'react';
import { Book, Plus, Search, FileText, MoreVertical, Trash2, Edit2, X, ChevronLeft, ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubjectsPage = ({ subjects, setSubjects }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [newSubject, setNewSubject] = useState({ name: '', color: 'from-blue-500 to-indigo-500' });
    const [searchQuery, setSearchQuery] = useState('');

    // Notes State
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: '', content: '' });

    const colors = [
        'from-blue-500 to-indigo-500',
        'from-purple-500 to-pink-500',
        'from-emerald-500 to-teal-500',
        'from-orange-500 to-red-500',
        'from-cyan-500 to-blue-500',
        'from-rose-500 to-orange-500'
    ];

    const handleCreateSubject = () => {
        if (!newSubject.name) return;
        const subject = {
            id: Date.now(),
            name: newSubject.name,
            color: newSubject.color,
            notes: [],
            tasks: []
        };
        setSubjects([...subjects, subject]);
        setIsCreating(false);
        setNewSubject({ name: '', color: 'from-blue-500 to-indigo-500' });
    };

    const confirmDeleteSubject = (id, e) => {
        e.stopPropagation();
        setSubjectToDelete(id);
    };

    const handleDeleteSubject = () => {
        if (subjectToDelete) {
            setSubjects(subjects.filter(s => s.id !== subjectToDelete));
            if (selectedSubject?.id === subjectToDelete) setSelectedSubject(null);
            setSubjectToDelete(null);
        }
    };

    const handleSaveNote = () => {
        if (!currentNote.title) return;

        const updatedSubjects = subjects.map(s => {
            if (s.id === selectedSubject.id) {
                const notes = currentNote.id
                    ? s.notes.map(n => n.id === currentNote.id ? { ...currentNote, updatedAt: new Date().toISOString() } : n)
                    : [...s.notes, { ...currentNote, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
                return { ...s, notes };
            }
            return s;
        });

        setSubjects(updatedSubjects);
        setSelectedSubject(updatedSubjects.find(s => s.id === selectedSubject.id));
        setIsEditingNote(false);
        setCurrentNote({ title: '', content: '' });
    };

    const confirmDeleteNote = (noteId) => {
        setNoteToDelete(noteId);
    };

    const handleDeleteNote = () => {
        if (noteToDelete) {
            const updatedSubjects = subjects.map(s => {
                if (s.id === selectedSubject.id) {
                    return { ...s, notes: s.notes.filter(n => n.id !== noteToDelete) };
                }
                return s;
            });
            setSubjects(updatedSubjects);
            setSelectedSubject(updatedSubjects.find(s => s.id === selectedSubject.id));
            setNoteToDelete(null);
        }
    };

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full p-8 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    /* GRID VIEW */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col h-full"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-terminal-content mb-2 flex items-center gap-3">
                                    <Book className="w-8 h-8 text-indigo-400" />
                                    Subjects
                                </h1>
                                <p className="text-terminal-content/60">Organize your knowledge base.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-content/40" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-xl pl-10 pr-4 py-2 text-sm text-terminal-content focus:outline-none focus:border-indigo-500/50 w-64"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    <Plus className="w-5 h-5" /> New Subject
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSubjects.map((subject) => (
                                <motion.div
                                    key={subject.id}
                                    layoutId={subject.id}
                                    onClick={() => setSelectedSubject(subject)}
                                    className="group relative bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-6 cursor-pointer hover:bg-terminal-dim/50 hover:border-indigo-500/30 transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${subject.color}`}></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg`}>
                                            <Book className="w-6 h-6 text-white" />
                                        </div>
                                        <button
                                            onClick={(e) => confirmDeleteSubject(subject.id, e)}
                                            className="p-2 text-terminal-content/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-terminal-content mb-2">{subject.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-terminal-content/60">
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-4 h-4" /> {subject.notes.length} Notes
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Empty State */}
                            {filteredSubjects.length === 0 && (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-terminal-accent/10 rounded-3xl">
                                    <Book className="w-12 h-12 text-terminal-content/20 mx-auto mb-4" />
                                    <p className="text-terminal-content/40">No subjects found.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    /* DETAIL VIEW */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col h-full"
                    >
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-terminal-accent/10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="p-2 hover:bg-terminal-dim/50 rounded-lg text-terminal-content/60 hover:text-terminal-content transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold text-terminal-content flex items-center gap-3">
                                        <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${selectedSubject.color}`}></span>
                                        {selectedSubject.name}
                                    </h1>
                                    <p className="text-terminal-content/60 mt-1">{selectedSubject.notes.length} notes stored</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentNote({ title: '', content: '' });
                                    setIsEditingNote(true);
                                }}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                <Plus className="w-5 h-5" /> New Note
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedSubject.notes.map(note => (
                                <motion.div
                                    key={note.id}
                                    layout
                                    onClick={() => {
                                        setCurrentNote(note);
                                        setIsEditingNote(true);
                                    }}
                                    className="group bg-terminal-dim/30 border border-terminal-accent/10 hover:border-indigo-500/30 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                                >
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDeleteNote(note.id);
                                            }}
                                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-terminal-content mb-3 pr-8 truncate">{note.title}</h3>
                                    <p className="text-sm text-terminal-content/60 line-clamp-4 leading-relaxed mb-4">
                                        {note.content || <span className="italic opacity-50">No content</span>}
                                    </p>
                                    <div className="text-xs text-terminal-content/40">
                                        Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                                    </div>
                                </motion.div>
                            ))}

                            {selectedSubject.notes.length === 0 && (
                                <div className="col-span-full py-20 text-center">
                                    <FileText className="w-16 h-16 text-terminal-content/10 mx-auto mb-4" />
                                    <p className="text-terminal-content/40 text-lg">No notes yet.</p>
                                    <p className="text-terminal-content/30 text-sm">Create your first note to get started.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Note Editor Modal */}
            <AnimatePresence>
                {isEditingNote && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-terminal-bg border border-terminal-accent/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-terminal-accent/10 flex justify-between items-center bg-terminal-dim/30">
                                <input
                                    type="text"
                                    value={currentNote.title}
                                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                                    placeholder="Note Title..."
                                    className="bg-transparent text-xl font-bold text-terminal-content placeholder-terminal-content/40 focus:outline-none w-full"
                                    autoFocus
                                />
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => setIsEditingNote(false)}
                                        className="px-4 py-2 text-terminal-content/60 hover:text-terminal-content transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveNote}
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={currentNote.content}
                                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                                placeholder="Start writing..."
                                className="flex-1 bg-terminal-bg p-8 text-terminal-content/80 resize-none focus:outline-none leading-relaxed custom-scrollbar text-lg"
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Subject Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-terminal-bg border border-terminal-accent/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-terminal-content mb-6">New Subject</h2>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm text-terminal-content/60 mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                        placeholder="e.g. Mathematics, Physics..."
                                        className="w-full bg-terminal-dim/50 border border-terminal-accent/10 rounded-xl px-4 py-3 text-terminal-content focus:border-indigo-500 outline-none"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-terminal-content/60 mb-2">Color Theme</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setNewSubject({ ...newSubject, color })}
                                                className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} transition-transform hover:scale-110 ${newSubject.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 px-4 py-2 rounded-xl bg-terminal-dim/30 hover:bg-terminal-dim/50 text-terminal-content/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateSubject}
                                    className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Subject Confirmation Modal */}
            <AnimatePresence>
                {subjectToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setSubjectToDelete(null)}
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
                            <h2 className="text-2xl font-bold text-terminal-content mb-2">Delete Subject?</h2>
                            <p className="text-terminal-content/60 mb-8">
                                Are you sure you want to delete this subject and all its notes? This action cannot be undone.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSubjectToDelete(null)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-terminal-dim/30 hover:bg-terminal-dim/50 text-terminal-content/80 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteSubject}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Note Confirmation Modal */}
            <AnimatePresence>
                {noteToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setNoteToDelete(null)}
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
                            <h2 className="text-2xl font-bold text-terminal-content mb-2">Delete Note?</h2>
                            <p className="text-terminal-content/60 mb-8">
                                Are you sure you want to delete this note? This action cannot be undone.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setNoteToDelete(null)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-terminal-dim/30 hover:bg-terminal-dim/50 text-terminal-content/80 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteNote}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubjectsPage;
