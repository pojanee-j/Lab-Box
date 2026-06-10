import { useEffect, useState } from 'react';
import { AppState, GameSession, PlayerAnswer, UserProfile } from './types';
import { authService, databaseService } from './lib/firebase';
import { QUESTIONS } from './data/questions';
import { aggregateTopicStats } from './utils';

// Page Components
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import GameSummary from './components/GameSummary';
import LeaderboardPage from './components/LeaderboardPage';
import HistoryPage from './components/HistoryPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('auth');
  const [user, setUser] = useState<{ uid: string; displayName: string; email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Challenge game sessions parameters
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [activeQuestions, setActiveQuestions] = useState(QUESTIONS.filter(q => q.difficulty === 'easy'));
  const [sessionStartTime, setSessionStartTime] = useState<string>('');
  const [activeSessionResult, setActiveSessionResult] = useState<GameSession | null>(null);

  // Synchronize authentication status instantly
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setUser(state.user);
      setAuthLoading(state.loading);
      if (state.user) {
        // If logged in, send them straight to portal gate
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('auth');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (profile: { uid: string; displayName: string; email: string }) => {
    setUser(profile);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCurrentPage('auth');
  };

  const handleNavigate = (page: AppState, data?: any) => {
    if (page === 'summary' && data) {
      setActiveSessionResult(data);
    }
    setCurrentPage(page);
  };

  const handleStartGame = (selectedDiff: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDiff);
    
    // Filter questions by difficulty and choose a subset if extensive
    let filtered = QUESTIONS.filter(q => q.difficulty === selectedDiff);
    
    // Target counts: Easy = 5, Medium = 7, Hard = 10
    const count = selectedDiff === 'easy' ? 5 : selectedDiff === 'medium' ? 7 : 10;
    
    // Shuffle and slice to keep the set dynamic across rounds
    filtered = [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
    
    setActiveQuestions(filtered);
    setSessionStartTime(new Date().toISOString());
    setCurrentPage('play');
  };

  // Called when active Challenge compiles completely
  const handleGameComplete = async (playerAnswers: PlayerAnswer[]) => {
    if (!user) return;

    try {
      // Calculate dynamic summaries
      const totalScore = playerAnswers.reduce((acc, ans) => acc + ans.scoreEarned, 0);
      const maxScore = activeQuestions.reduce((acc, q) => acc + q.points, 0);
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const topicStats = aggregateTopicStats(playerAnswers);

      const completedSession: GameSession = {
        uid: user.uid,
        displayName: user.displayName,
        difficulty: difficulty,
        totalScore: totalScore,
        maxScore: maxScore,
        percentage: percentage,
        topicStats: topicStats,
        startedAt: sessionStartTime,
        completedAt: new Date().toISOString(),
        answers: playerAnswers
      };

      // Asynchronously persistent syncing to drivers
      await databaseService.saveGameSession(completedSession);

      setActiveSessionResult(completedSession);
      setCurrentPage('summary');
    } catch (err) {
      console.error('Failed to aggregate and save game session scores:', err);
    }
  };

  const handleReplayActiveGame = () => {
    handleStartGame(difficulty);
  };

  // Render main core page content router
  const renderPageContent = () => {
    if (!user) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={handleNavigate} />;
      case 'setup':
        return <GameSetup onStartGame={handleStartGame} onBack={() => handleNavigate('dashboard')} />;
      case 'play':
        return (
          <GamePlay 
            difficulty={difficulty} 
            questions={activeQuestions} 
            onCancel={() => handleNavigate('dashboard')} 
            onComplete={handleGameComplete} 
          />
        );
      case 'summary':
        return activeSessionResult ? (
          <GameSummary 
            session={activeSessionResult} 
            onNavigate={handleNavigate} 
            onReplay={handleReplayActiveGame} 
          />
        ) : (
          <Dashboard user={user} onNavigate={handleNavigate} />
        );
      case 'history':
        return <HistoryPage user={user} onNavigate={handleNavigate} />;
      case 'leaderboard':
        return <LeaderboardPage user={user} onNavigate={handleNavigate} />;
      default:
        return <Dashboard user={user} onNavigate={handleNavigate} />;
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 gap-4" id="app-loading-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent shadow-sm"></div>
        <p className="font-mono text-[11px] font-bold text-indigo-600 uppercase tracking-widest animate-pulse">
          กำลังเตรียมระบบแบบทดสอบ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
      />
      
      <main className="flex-1 w-full flex flex-col">
        {renderPageContent()}
      </main>

      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center mt-auto shadow-inner">
        <p className="font-mono text-[10px] text-slate-400">
          © 2026 Programming Logic Game (Python Edition). Tailored for Computer Science Students with ❤️
        </p>
      </footer>
    </div>
  );
}
