import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import type { User } from '../../types/gameTypes';
import { soundManager } from '../../utils/soundEffects';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(4);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanInput = email.trim().toLowerCase();
    
    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự!');
      setLoading(false);
      soundManager.playWrong();
      return;
    }

    // Đảm bảo định dạng email hợp lệ (nếu học sinh nhập tên thường, tự động thêm @edugame.local)
    const finalEmail = cleanInput.includes('@')
      ? cleanInput
      : `${cleanInput.replace(/[^a-z0-9._-]/g, '')}@edugame.local`;

    try {
      // 1. TRƯỜNG HỢP REGISTER (Ưu tiên dùng Backend API để bỏ qua Rate Limit)
      if (mode === 'register') {
        const endpoint = '/api/v1/auth/register';
        const payload = { username: finalEmail, password, fullName, gradeLevel }; // Backend API nhận username và ánh xạ làm email đăng nhập

        let res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.status === 404) {
          res = await fetch(`http://localhost:3001${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        const responseText = await res.text();
        let json;
        try {
          json = JSON.parse(responseText);
        } catch {
          throw new Error('Máy chủ Backend phản hồi không đúng định dạng!');
        }

        if (res.ok && json.success) {
          const studentUser: User = {
            id: json.data.user.id,
            email: json.data.user.email || json.data.user.username || finalEmail,
            fullName: json.data.user.fullName,
            avatarUrl: json.data.user.avatarUrl,
            role: json.data.user.role,
            gradeLevel: json.data.user.gradeLevel,
            totalXp: json.data.user.totalXp,
            streakDays: json.data.user.streakDays
          };

          soundManager.playVictory();
          onAuthSuccess(studentUser, json.data.token || '');
          onClose();
          return;
        }

        if (json && json.error) {
          throw new Error(json.error);
        }
      }

      // 2. SUPABASE DIRECT AUTH (Dành cho Login hoặc Fallback)
      if (isSupabaseConfigured) {
        if (mode === 'register') {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: finalEmail,
            password: password,
            options: {
              data: {
                username: finalEmail,
                full_name: fullName,
                grade_level: gradeLevel
              }
            }
          });

          if (authError) {
            if (authError.message.includes('rate limit')) {
              throw new Error('Supabase đang giới hạn tần suất đăng ký. Vui lòng thử lại sau hoặc cấu hình Dashboard!');
            }
            throw new Error(authError.message);
          }

          const authUser = authData.user;
          if (!authUser) {
            throw new Error('Đăng ký thất bại!');
          }

          const profileRole = finalEmail === 'nguyenthanhduocathy@gmail.com' ? 'admin' : 'student';
          const profileData = {
            id: authUser.id,
            email: finalEmail,
            full_name: fullName,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalEmail)}`,
            role: profileRole,
            grade_level: gradeLevel,
            total_xp: 0,
            streak_days: 1
          };

          await supabase.from('profiles').upsert(profileData);

          const studentUser: User = {
            id: authUser.id,
            email: finalEmail,
            fullName: fullName,
            avatarUrl: profileData.avatar_url,
            role: profileRole,
            gradeLevel: gradeLevel,
            totalXp: 0,
            streakDays: 1
          };

          soundManager.playVictory();
          onAuthSuccess(studentUser, authData.session?.access_token || 'supabase_token');
          onClose();
          return;
        } else {
          // Đăng nhập
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: finalEmail,
            password: password
          });

          if (authError) {
            throw new Error('Email đăng nhập hoặc mật khẩu không chính xác!');
          }

          // Lấy profile từ public.profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          const studentUser: User = {
            id: authData.user.id,
            email: profile?.email || finalEmail,
            fullName: profile?.full_name || authData.user.user_metadata?.full_name || finalEmail,
            avatarUrl: profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalEmail)}`,
            role: profile?.role || 'student',
            gradeLevel: profile?.grade_level || 4,
            totalXp: profile?.total_xp || 0,
            streakDays: profile?.streak_days || 1
          };

          soundManager.playVictory();
          onAuthSuccess(studentUser, authData.session?.access_token || 'supabase_token');
          onClose();
          return;
        }
      }

      throw new Error('Thao tác thất bại. Vui lòng thử lại!');
    } catch (err: unknown) {
      soundManager.playWrong();
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Lỗi không xác định!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl border-4 border-indigo-200 animate-in fade-in zoom-in duration-200">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => { soundManager.playClick(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl mx-auto shadow-md shadow-indigo-200">
            🎮
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {mode === 'login' ? 'ĐĂNG NHẬP TÀI KHOẢN' : 'ĐĂNG KÝ HỌC SINH MỚI'}
          </h3>
          <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
            Đồng bộ CSDL Supabase Realtime <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
          </p>
        </div>

        {/* MODE TABS */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            onClick={() => { soundManager.playClick(); setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <LogIn className="w-4 h-4 inline mr-1" /> Đăng Nhập
          </button>
          <button
            onClick={() => { soundManager.playClick(); setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${mode === 'register' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <UserPlus className="w-4 h-4 inline mr-1" /> Đăng Ký
          </button>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" /> {errorMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 uppercase">Email đăng nhập:</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="VD: nguyenthanhduocathy@gmail.com"
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 uppercase">Mật khẩu (ít nhất 6 ký tự):</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase">Họ và Tên Học Sinh:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="VD: Nguyễn Trung Hiếu"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase">Khối Lớp Học:</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>Học sinh Lớp 1</option>
                  <option value={2}>Học sinh Lớp 2</option>
                  <option value={3}>Học sinh Lớp 3</option>
                  <option value={4}>Học sinh Lớp 4</option>
                  <option value={5}>Học sinh Lớp 5</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm shadow-lg shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Đang xử lý đồng bộ Supabase...' : mode === 'login' ? 'ĐĂNG NHẬP NGAY 🚀' : 'ĐĂNG KÝ TÀI KHOẢN ⭐️'}
          </button>

        </form>

      </div>
    </div>
  );
};
