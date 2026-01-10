import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Edit3, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarWidget = ({ tasks, notes, onUpdateNote, challenges = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const getDateString = (date) => {
        return date.toISOString().split('T')[0];
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Filter tasks for the selected date
    const selectedDateTasks = tasks.filter(t => {
        if (!t.deadline) return false;
        const tDate = new Date(t.deadline);
        return isSameDay(tDate, selectedDate);
    });

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const today = new Date();

        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            const dateStr = getDateString(date);
            const hasNote = notes && notes[dateStr] && notes[dateStr].trim().length > 0;

            // Check for tasks on this day
            const hasTask = tasks.some(t => {
                if (!t.deadline) return false;
                const tDate = new Date(t.deadline);
                return isSameDay(tDate, date);
            });

            // Check for active challenges on this day
            const activeChallenges = challenges.filter(c => {
                const start = new Date(c.startDate);
                const end = new Date(start);
                end.setDate(start.getDate() + c.duration);
                return date >= start && date < end;
            });

            days.push(
                <motion.button
                    key={day}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`h-9 w-9 flex flex-col items-center justify-center relative rounded-full transition-all duration-200 ${isSelected
                        ? 'bg-terminal-accent text-terminal-bg shadow-lg shadow-terminal-accent/30'
                        : isToday
                            ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/20'
                            : 'text-terminal-accent/60 hover:bg-terminal-accent/5 hover:text-terminal-accent'
                        }`}
                >
                    <span className="text-xs font-medium relative z-10">{day}</span>

                    {/* Challenge Indicator (Background Bar) */}
                    {activeChallenges.length > 0 && !isSelected && (
                        <div className="absolute inset-0 rounded-full border-2 border-yellow-500/30 opacity-50"></div>
                    )}

                    <div className="flex gap-0.5 absolute bottom-1.5 z-10">
                        {hasTask && (
                            <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-terminal-bg' : 'bg-indigo-400'
                                }`}></div>
                        )}
                        {hasNote && (
                            <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-terminal-bg' : 'bg-emerald-400'
                                }`}></div>
                        )}
                    </div>
                </motion.button>
            );
        }

        return days;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-terminal-accent/60 uppercase tracking-widest flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-terminal-accent" /> Calendar
                </h3>
                <div className="flex items-center gap-1 bg-terminal-accent/5 rounded-lg p-1 border border-terminal-accent/5">
                    <button onClick={prevMonth} className="p-1 hover:bg-terminal-accent/10 rounded-md transition-colors text-terminal-accent/60 hover:text-terminal-accent">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-terminal-accent w-20 text-center">
                        {monthNames[currentDate.getMonth()]}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-terminal-accent/10 rounded-md transition-colors text-terminal-accent/60 hover:text-terminal-accent">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
                <div className="grid grid-cols-7 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-center text-[10px] text-terminal-accent/40 font-bold uppercase tracking-wider">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Selected Date Content (Tasks + Notes) */}
            <div className="flex-1 flex flex-col min-h-0 gap-4">

                {/* Tasks Section */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium text-terminal-accent/60 uppercase tracking-wide">
                            {isSameDay(selectedDate, new Date()) ? "Today's Schedule" : `Schedule: ${selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                        </h4>
                        <span className="text-[10px] bg-terminal-accent/5 px-2 py-0.5 rounded text-terminal-accent/60">
                            {selectedDateTasks.length} Tasks
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                        <AnimatePresence mode='popLayout'>
                            {selectedDateTasks.length > 0 ? (
                                selectedDateTasks.map((task, index) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group flex items-center gap-3 p-2 rounded-xl bg-terminal-accent/5 border border-terminal-accent/5 hover:bg-terminal-accent/10 transition-all duration-200"
                                    >
                                        <div className={`w-1 h-6 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}></div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate ${task.completed ? 'line-through text-terminal-accent/40' : 'text-terminal-accent/90'}`}>
                                                {task.text}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-[10px] text-terminal-accent/40 italic text-center py-2">No tasks scheduled.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Daily Note Section */}
                <div className="h-1/3 min-h-[100px] flex flex-col">
                    <h4 className="text-xs font-medium text-terminal-accent/60 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Edit3 className="w-3 h-3" /> Daily Note
                    </h4>
                    <textarea
                        value={notes && notes[getDateString(selectedDate)] ? notes[getDateString(selectedDate)] : ''}
                        onChange={(e) => onUpdateNote && onUpdateNote(getDateString(selectedDate), e.target.value)}
                        placeholder="Log your progress..."
                        className="flex-1 w-full bg-terminal-accent/5 border border-terminal-accent/10 rounded-xl p-3 text-xs text-terminal-accent placeholder-terminal-accent/30 focus:outline-none focus:border-terminal-accent/30 resize-none transition-colors"
                    />
                </div>

            </div>
        </div>
    );
};

export default CalendarWidget;
