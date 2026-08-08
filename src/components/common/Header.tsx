import React from 'react';
import { Sparkles, Trophy, Volume2, VolumeX, Shield, Home, LogIn, LogOut } from 'lucide-react';
import type { User } from '../../types/gameTypes';
import { soundManager } from '../../utils/soundEffects';

interface HeaderProps {
  user: User;
  activeTab: 'home' | 'map' | 'leaderboard' | 'admin';
  setActiveTab: (tab: 'home' | 'map' | 'leaderboard' | 'admin') => void;
  selectedGrade: number;
  setSelectedGrade: (grade: number) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  selectedGrade,
  setSelectedGrade,
  onOpenAuth,
  onLogout,
  isLoggedIn
}) => {
  const [muted, setMuted] = React.useState(soundManager.getMuted());

  const handleToggleMute = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-indigo-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO BRAND */}
        <div 
          onClick={() => { soundManager.playClick(); setActiveTab('home'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              EDUGAME PRIMARY
            </h1>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              Học Mà Chơi • Chuẩn SGK <Sparkles className="w-3 h-3 text-amber-500 inline" />
            </p>
          </div>
        </div>

        {/* GRADE SELECTOR & NAVIGATION */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khối:</span>
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => { soundManager.playClick(); setSelectedGrade(g); }}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                  selectedGrade === g
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-300 scale-105'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('home'); }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'home'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/50'
            }`}
          >
            <Home className="w-4 h-4" /> Môn Học SGK
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('leaderboard'); }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-white text-amber-600 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-amber-600 hover:bg-slate-200/50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" /> Bảng Vàng
          </button>

          {(user.username === 'nguyenthanhduocathy@gmail.com' || user.role === 'admin') && (
            <button
              onClick={() => { soundManager.playClick(); setActiveTab('admin'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-purple-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-purple-600 hover:bg-slate-200/50'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-500" /> Giáo Viên / CMS
            </button>
          )}
        </nav>

        {/* STUDENT PROFILE & AUTH */}
        <div className="flex items-center gap-3">
          {/* MUTE AUDIO SOUND */}
          <button
            onClick={handleToggleMute}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200/80"
            title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {muted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* XP & STREAK BADGES */}
          <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-base animate-bounce">🔥</span>
            <span className="text-xs font-black text-amber-700">{user.streakDays} Ngày</span>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-base">⭐️</span>
            <span className="text-xs font-black text-indigo-700">{user.totalXp} XP</span>
          </div>

          {/* AVATAR OR AUTH BUTTON */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            {!isLoggedIn ? (
              <button
                onClick={() => { soundManager.playClick(); onOpenAuth(); }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" /> Đăng Nhập
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-xl bg-purple-100 border-2 border-purple-300 shadow-xs cursor-pointer"
                  onClick={onOpenAuth}
                  title="Thông tin tài khoản"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-black text-slate-800 leading-tight">{user.fullName}</p>
                  <p className="text-[10px] font-bold text-indigo-600">@{user.username}</p>
                </div>
                <button
                  onClick={() => { soundManager.playClick(); onLogout(); }}
                  className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors border border-rose-200 ml-1"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
