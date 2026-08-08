import { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SubjectHub } from './features/curriculum/SubjectHub';
import { AdventureMap } from './features/curriculum/AdventureMap';
import { GameEngineContainer } from './features/games/GameEngineContainer';
import { LeaderboardView } from './features/leaderboard/LeaderboardView';
import { AdminCmsView } from './features/admin/AdminCmsView';
import { CURRENT_USER, SUBJECTS } from './config/curriculumData';
import type { Subject, Game } from './types/gameTypes';

export function App() {
  const [user] = useState(CURRENT_USER);
  const [selectedGrade, setSelectedGrade] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'game' | 'leaderboard' | 'admin'>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(SUBJECTS[0]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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
          <AdminCmsView />
        )}
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;
