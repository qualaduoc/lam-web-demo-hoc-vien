import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SubjectHub } from './features/curriculum/SubjectHub';
import { AdventureMap } from './features/curriculum/AdventureMap';
import { GameEngineContainer } from './features/games/GameEngineContainer';
import { LeaderboardView } from './features/leaderboard/LeaderboardView';
import { AdminCmsView } from './features/admin/AdminCmsView';
import { AuthModal } from './features/auth/AuthModal';
import { CURRENT_USER, SUBJECTS } from './config/curriculumData';
import type { Subject, Game, User } from './types/gameTypes';

export function App() {
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'game' | 'leaderboard' | 'admin'>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(SUBJECTS[0]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('edugame_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
        setSelectedGrade(parsed.gradeLevel || 4);
      } catch (e) {
        console.error('Error loading saved session:', e);
      }
    }
  }, []);

  const handleAuthSuccess = (authUser: User, token: string) => {
    setUser(authUser);
    setIsLoggedIn(true);
    setSelectedGrade(authUser.gradeLevel || 4);
    localStorage.setItem('edugame_user', JSON.stringify(authUser));
    if (token) {
      localStorage.setItem('edugame_token', token);
    }
  };

  const handleLogout = () => {
    setUser(CURRENT_USER);
    setIsLoggedIn(false);
    localStorage.removeItem('edugame_user');
    localStorage.removeItem('edugame_token');
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setActiveTab('map');
  };

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setActiveTab('game');
  };

  const handleBackToMap = () => {
    setSelectedGame(null);
    setActiveTab('map');
  };

  const handleBackToHome = () => {
    setSelectedGame(null);
    setSelectedSubject(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* HEADER NAVBAR */}
      <Header
        user={user}
        activeTab={activeTab === 'game' ? 'map' : activeTab}
        setActiveTab={(tab) => {
          if (tab === 'home') handleBackToHome();
          else setActiveTab(tab);
        }}
        selectedGrade={selectedGrade}
        setSelectedGrade={(g) => {
          setSelectedGrade(g);
          if (activeTab === 'game') setActiveTab('map');
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'home' && (
          <SubjectHub
            selectedGrade={selectedGrade}
            onSelectSubject={handleSelectSubject}
          />
        )}

        {activeTab === 'map' && selectedSubject && (
          <AdventureMap
            subject={selectedSubject}
            selectedGrade={selectedGrade}
            onBack={handleBackToHome}
            onSelectGame={handleSelectGame}
          />
        )}

        {activeTab === 'game' && selectedGame && (
          <GameEngineContainer
            game={selectedGame}
            onBackToMap={handleBackToMap}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView />
        )}

        {activeTab === 'admin' && (
          (user.email === 'nguyenthanhduocathy@gmail.com' || user.role === 'admin') ? (
            <AdminCmsView />
          ) : (
            <div className="py-20 text-center space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="text-6xl">🔒</div>
              <h3 className="text-2xl font-black text-rose-600">KHU VỰC HẠN CHẾ TRUY CẬP</h3>
              <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-relaxed">
                Chỉ tài khoản Quản trị viên <strong className="text-indigo-600">nguyenthanhduocathy@gmail.com</strong> mới có quyền xem và chỉnh sửa dữ liệu hệ thống này.
              </p>
            </div>
          )
        )}
      </main>

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;
