import React from 'react';
import { ArrowLeft, Play, CheckCircle2, Star, BookOpen, Layers } from 'lucide-react';
import type { Subject, Chapter, Game } from '../../types/gameTypes';
import { MATH_GRADE4_CHAPTERS } from '../../config/curriculumData';
import { soundManager } from '../../utils/soundEffects';

interface AdventureMapProps {
  subject: Subject;
  selectedGrade: number;
  onBack: () => void;
  onSelectGame: (game: Game) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  subject,
  selectedGrade,
  onBack,
  onSelectGame
}) => {

  const chapters: Chapter[] = MATH_GRADE4_CHAPTERS;

  return (
    <div className="space-y-8 py-4">
      
      {/* MAP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { soundManager.playClick(); onBack(); }}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-extrabold uppercase tracking-wide">
                Môn {subject.name} • Lớp {selectedGrade}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-extrabold">
                SGK Kết nối tri thức
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bản Đồ Bài Học & Trò Chơi SGK</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs font-black text-xs flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-white" /> Tích lũy 3/3 Sao
          </div>
        </div>
      </div>

      {/* CHAPTERS & LESSONS MAP ROADMAP */}
      <div className="space-y-10">
        {chapters.map((chapter, cIdx) => (
          <div key={chapter.id} className="relative bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200">
            
            {/* CHAPTER HEADER */}
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center shadow-xs text-sm">
                {cIdx + 1}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">{chapter.title}</h3>
                <p className="text-xs font-semibold text-slate-500">Bộ sách {chapter.publisher}</p>
              </div>
            </div>

            {/* LESSONS LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chapter.lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-500 shrink-0" />
                      <h4 className="font-extrabold text-slate-800 text-base">{lesson.title}</h4>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã mở
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-500 leading-relaxed pl-7">{lesson.summary}</p>

                  {/* GAMES INSIDE LESSON */}
                  <div className="space-y-3 pt-2 pl-7">
                    <p className="text-[11px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> Danh sách trò chơi bài dạy:
                    </p>

                    <div className="space-y-2.5">
                      {lesson.games.map((game) => (
                        <div
                          key={game.id}
                          onClick={() => { soundManager.playClick(); onSelectGame(game); }}
                          className="group cursor-pointer bg-slate-50 hover:bg-indigo-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-600 group-hover:scale-110 text-white flex items-center justify-center shadow-xs transition-transform">
                              <Play className="w-4 h-4 fill-white translate-x-0.5" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800 group-hover:text-indigo-700 transition-colors">
                                {game.title}
                              </p>
                              <p className="text-[10px] font-semibold text-slate-500">{game.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-amber-400" /> 100đ
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
