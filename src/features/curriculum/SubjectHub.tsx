import React from 'react';
import { Calculator, BookOpen, Languages, Compass, ArrowRight, Award, Star, Sparkles } from 'lucide-react';
import { SUBJECTS } from '../../config/curriculumData';
import type { Subject } from '../../types/gameTypes';
import { soundManager } from '../../utils/soundEffects';

interface SubjectHubProps {
  selectedGrade: number;
  onSelectSubject: (subject: Subject) => void;
}

export const SubjectHub: React.FC<SubjectHubProps> = ({ selectedGrade, onSelectSubject }) => {

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-8 h-8 text-blue-500" />;
      case 'BookOpen': return <BookOpen className="w-8 h-8 text-rose-500" />;
      case 'Languages': return <Languages className="w-8 h-8 text-amber-500" />;
      case 'Compass': return <Compass className="w-8 h-8 text-emerald-500" />;
      default: return <Calculator className="w-8 h-8 text-indigo-500" />;
    }
  };

  const getGradientTheme = (theme: string) => {
    switch (theme) {
      case 'blue': return 'from-blue-500/10 via-indigo-500/5 to-cyan-500/10 border-blue-200 hover:border-blue-400 text-blue-900';
      case 'red': return 'from-rose-500/10 via-pink-500/5 to-red-500/10 border-rose-200 hover:border-rose-400 text-rose-900';
      case 'amber': return 'from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-amber-200 hover:border-amber-400 text-amber-900';
      case 'emerald': return 'from-emerald-500/10 via-teal-500/5 to-green-500/10 border-emerald-200 hover:border-emerald-400 text-emerald-900';
      default: return 'from-indigo-500/10 via-purple-500/5 to-pink-500/10 border-indigo-200 hover:border-indigo-400 text-indigo-900';
    }
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* HERO BANNER TIỂU HỌC */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 sm:p-12 text-white shadow-xl shadow-indigo-200/50">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-200 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" /> Khối Lớp {selectedGrade} • Sách Giáo Khoa Mới
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Vừa Học Vừa Chơi • Chinh Phục Tri Thức Lớp {selectedGrade}!
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed">
            Hàng trăm trò chơi tương tác thú vị được biên soạn chuẩn theo các bài dạy trong Sách Giáo Khoa (Toán, Tiếng Việt, Tiếng Anh, Tự Nhiên & Xã Hội).
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl border border-white/20">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" /> Trò Chơi Chuẩn SGK
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl border border-white/20">
              <Award className="w-4 h-4 text-emerald-300" /> Thưởng Điểm XP & Huy Hiệu
            </div>
          </div>
        </div>
      </div>

      {/* CHỌN MÔN HỌC (SUBJECT GRID) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Danh Sách Môn Học Lớp {selectedGrade}</h3>
            <p className="text-xs font-bold text-slate-500">Chọn môn học để khám phá bản đồ bài học SGK tương ứng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBJECTS.map((sub) => (
            <div
              key={sub.id}
              onClick={() => { soundManager.playClick(); onSelectSubject(sub); }}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 bg-gradient-to-b ${getGradientTheme(sub.colorTheme)} p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getSubjectIcon(sub.icon)}
                </div>
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight mb-1">{sub.name}</h4>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">{sub.description}</p>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-slate-200/50 mt-4">
                <span className="text-xs font-extrabold text-indigo-600 group-hover:underline flex items-center gap-1">
                  Vào bài học <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                  SGK Lớp {selectedGrade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
