import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import StatsPage from './components/StatsPage';
import SettingsPage from './components/SettingsPage';
import SubjectsPage from './components/SubjectsPage';
import ChallengesPage from './components/ChallengesPage';
import AiFab from './components/AiFab';
import FocusMode from './components/FocusMode';
import LevelUpModal from './components/LevelUpModal';
import LoginPage from './components/LoginPage';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // USER STATE
  const [user, setUser] = useLocalStorage('studysync-user', null);



  // Derived key prefix based on user ID (or 'guest' if not logged in, though we force login now)
  // We use a specific prefix for the user to ensure data isolation.
  const userPrefix = user ? `studysync-${user.id}` : 'studysync-guest';

  // TASKS STATE
  const [tasks, setTasks] = useLocalStorage(`${userPrefix}-tasks`, [
    { id: 1, text: 'Complete React Component', completed: false, priority: 'high', deadline: new Date(Date.now() + 86400000).toISOString() },
    { id: 2, text: 'Review Tailwind Config', completed: true, priority: 'medium', deadline: null },
    { id: 3, text: 'Plan Next Feature', completed: false, priority: 'low', deadline: null },
  ]);

  // GAMIFICATION STATE
  const [stats, setStats] = useLocalStorage(`${userPrefix}-stats`, {
    level: 1,
    xp: 0,
    maxXp: 500, // Harder base difficulty
    streak: 1,
    lastActive: new Date().toISOString(),
    totalTasksCompleted: 0
  });

  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  // NOTES STATE
  const [notes, setNotes] = useLocalStorage(`${userPrefix}-notes`, {});

  // SUBJECTS STATE
  const [subjects, setSubjects] = useLocalStorage(`${userPrefix}-subjects`, []);

  // CHALLENGES STATE
  const [challenges, setChallenges] = useLocalStorage(`${userPrefix}-challenges`, []);

  // FOCUS STATE
  const [focusedTaskId, setFocusedTaskId] = useLocalStorage(`${userPrefix}-focus`, null);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);

  // PREFERENCES STATE (Lifted)
  // Preferences might be global or per user? Let's make them per user for full customization.
  const [preferences, setPreferences] = useLocalStorage(`${userPrefix}-preferences`, {
    darkMode: true,
    notifications: true,
    sound: true
  });

  // TIMER STATE (Lifted)
  const [timerState, setTimerState] = useState({
    timeLeft: 25 * 60,
    isActive: false,
    mode: 'focus' // focus, shortBreak, longBreak
  });

  // Apply Theme
  useEffect(() => {
    if (preferences.darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [preferences.darkMode]);

  useEffect(() => {
    let interval = null;
    if (timerState.isActive && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (timerState.timeLeft === 0 && timerState.isActive) {
      // Timer Finished
      setTimerState(prev => ({ ...prev, isActive: false }));

      // Play Sound
      if (preferences.sound) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Retro Beep
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed:', e));
      }

      // Show Notification
      if (preferences.notifications) {
        if (Notification.permission === 'granted') {
          new Notification('StudySync', {
            body: 'Timer Finished! Take a break.',
            icon: '/vite.svg'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('StudySync', {
                body: 'Timer Finished! Take a break.',
                icon: '/vite.svg'
              });
            }
          });
        }
      }
    }
    return () => clearInterval(interval);
  }, [timerState.isActive, timerState.timeLeft, preferences]);

  const toggleTimer = () => setTimerState(prev => ({ ...prev, isActive: !prev.isActive }));

  const resetTimer = () => {
    setTimerState(prev => {
      let newTime = 25 * 60;
      if (prev.mode === 'shortBreak') newTime = 5 * 60;
      else if (prev.mode === 'longBreak') newTime = 15 * 60;
      return { ...prev, isActive: false, timeLeft: newTime };
    });
  };

  const setTimerMode = (newMode) => {
    let newTime = 25 * 60;
    if (newMode === 'shortBreak') newTime = 5 * 60;
    else if (newMode === 'longBreak') newTime = 15 * 60;
    setTimerState({ mode: newMode, isActive: false, timeLeft: newTime });
  };

  const updateNote = (dateStr, content) => {
    setNotes(prev => ({
      ...prev,
      [dateStr]: content
    }));
  };

  // STREAK LOGIC (Run on mount)
  useEffect(() => {
    const checkStreak = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = stats.lastActive.split('T')[0];

      if (today !== lastActive) {
        // New day
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActive === yesterdayStr) {
          // Consecutive day
          setStats(prev => ({
            ...prev,
            streak: prev.streak + 1,
            lastActive: new Date().toISOString()
          }));
        } else {
          // Streak broken
          setStats(prev => ({
            ...prev,
            streak: 1,
            lastActive: new Date().toISOString()
          }));
        }
      }
    };

    checkStreak();

    // One-time reset of task count as requested
    const resetKey = `${userPrefix}-reset-tasks-v1`;
    const hasResetTasks = localStorage.getItem(resetKey);
    if (!hasResetTasks) {
      setStats(prev => ({ ...prev, totalTasksCompleted: 0 }));
      localStorage.setItem(resetKey, 'true');
    }
  }, [userPrefix]); // Re-run when user changes

  // XP & LEVEL UP LOGIC
  const addXp = (amount, { taskCountChange = 0 } = {}) => {
    setStats(prev => {
      const newXp = Math.max(0, prev.xp + amount);

      let currentLevel = prev.level;
      let currentXp = newXp;
      let currentMaxXp = prev.maxXp;

      // Level Up Logic
      if (currentXp >= currentMaxXp) {
        setShowLevelUpModal(true);
        currentLevel++;
        currentXp -= currentMaxXp;
        currentMaxXp = Math.floor(currentMaxXp * 1.5);
      }

      return {
        ...prev,
        level: currentLevel,
        xp: currentXp,
        maxXp: currentMaxXp,
        totalTasksCompleted: Math.max(0, prev.totalTasksCompleted + taskCountChange)
      };
    });
  };

  const handleResetData = () => {
    if (confirm('Are you sure? This will wipe everything.')) {
      setTasks([]);
      setStats({
        level: 1,
        xp: 0,
        maxXp: 100,
        streak: 1,
        lastActive: new Date().toISOString(),
        totalTasksCompleted: 0
      });
      setNotes({});
      setSubjects([]);
      setChallenges([]);
      setFocusedTaskId(null);
      setCurrentPage('dashboard');
      // Don't reset user here, let them do it explicitly via logout if they want
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const addTask = (text, priority = 'medium') => {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      priority: priority,
      deadline: null
    };
    setTasks(prev => [...prev, newTask]);
  };

  const focusedTask = tasks.find(t => t.id === focusedTaskId);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} user={user}>
      {showLevelUpModal && (
        <LevelUpModal level={stats.level} onClose={() => setShowLevelUpModal(false)} />
      )}
      <FocusMode
        isActive={isFocusModeActive}
        onClose={() => setIsFocusModeActive(false)}
        currentTask={focusedTask ? focusedTask.text : null}
        timerState={timerState}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        preferences={preferences}
      />

      {currentPage === 'dashboard' && (
        <Dashboard
          tasks={tasks}
          stats={stats}
          notes={notes}
          challenges={challenges}
          onUpdateNote={updateNote}
          focusedTaskId={focusedTaskId}
          setFocusedTaskId={setFocusedTaskId}
          timerState={timerState}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          setTimerMode={setTimerMode}
          onEnterFocusMode={() => setIsFocusModeActive(true)}
          preferences={preferences}
          user={user}
        />
      )}
      {currentPage === 'tasks' && (
        <TasksPage
          tasks={tasks}
          setTasks={setTasks}
          onCompleteTask={(priority, isCompleted) => {
            const xpMap = { high: 30, medium: 20, low: 10 };
            const amount = xpMap[priority] || 20;
            if (isCompleted) {
              addXp(amount, { taskCountChange: 1 });
            } else {
              addXp(-amount, { taskCountChange: -1 });
            }
          }}
        />
      )}
      {currentPage === 'subjects' && (
        <SubjectsPage subjects={subjects} setSubjects={setSubjects} />
      )}
      {currentPage === 'challenges' && (
        <ChallengesPage
          challenges={challenges}
          setChallenges={setChallenges}
          addXp={addXp}
        />
      )}
      {currentPage === 'stats' && (
        <StatsPage stats={stats} />
      )}
      {currentPage === 'settings' && (
        <SettingsPage
          onResetData={handleResetData}
          preferences={preferences}
          setPreferences={setPreferences}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <AiFab onAddTask={addTask} />
    </Layout>
  );
}

export default App;
