import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface GameVictoryModalProps {
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  gameTitle: string;
  onPlayAgain: () => void;
  onBackToMap: () => void;
}

export const GameVictoryModal: React.FC<GameVictoryModalProps> = ({
  score,
  maxScore,
  correctCount,
  totalQuestions,
  xpEarned,
  gameTitle,
  onPlayAgain,
  onBackToMap
}) => {

  useEffect(() => {
    soundManager.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const stars = correctCount === totalQuestions ? 3 : correctCount >= totalQuestions / 2 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl border-4 border-amber-400 relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* CELEBRATION HEADER */}
        <div className="space-y-2">
          <div className="inline-block p-3 rounded-full bg-amber-100 text-amber-600 mb-2">
            <Trophy className="w-12 h-12 animate-bounce" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">HOÀN THÀNH XUẤT SẮC!</h3>
          <p className="text-xs font-bold text-slate-500">{gameTitle}</p>
        </div>

        {/* STARS REWARD */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-12 h-12 ${s <= stars ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-md' : 'text-slate-200 fill-slate-100'} transition-all`}
            />
          ))}
        </div>

        {/* STATS SUMMARY CARD */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Điểm Số</p>
            <p className="text-xl font-black text-indigo-600">{score} / {maxScore}</p>
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Câu Đúng</p>
            <p className="text-xl font-black text-emerald-600">{correctCount} / {totalQuestions}</p>
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Thưởng XP</p>
            <p className="text-xl font-black text-amber-600">+{xpEarned} XP</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => { soundManager.playClick(); onPlayAgain(); }}
            className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" /> Chơi Lại
          </button>

          <button
            onClick={() => { soundManager.playClick(); onBackToMap(); }}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-300 transition-colors"
          >
            Về Bản Đồ Bài Học <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
