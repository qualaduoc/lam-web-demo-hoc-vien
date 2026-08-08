import React, { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import type { Question, AnswerResult } from '../../types/gameTypes';
import { soundManager } from '../../utils/soundEffects';

interface MathGame1Props {
  questions: Question[];
  onAnswerSubmit: (questionId: number, optionId: number) => Promise<AnswerResult>;
  onCompleteGame: () => void;
}

export const MathGame1_NumberTreasure: React.FC<MathGame1Props> = ({
  questions,
  onAnswerSubmit,
  onCompleteGame
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionId: number) => {
    if (feedback || isSubmitting) return;
    soundManager.playClick();
    setSelectedOptionId(optionId);
  };

  const handleSubmit = async () => {
    if (selectedOptionId === null || feedback || isSubmitting) return;
    setIsSubmitting(true);

    const result = await onAnswerSubmit(currentQ.id, selectedOptionId);
    setFeedback(result);
    setIsSubmitting(false);

    if (result.isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    setSelectedOptionId(null);
    setFeedback(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onCompleteGame();
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* GAME HEADER */}
      <div className="flex items-center justify-between mb-8 relative z-10 border-b border-indigo-700/50 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚀</span>
          <div>
            <h3 className="text-xl font-extrabold text-amber-300">TRÒ 1: SĂN KHO BÁU SỐ TỰ NHIÊN</h3>
            <p className="text-xs text-indigo-200 font-semibold">Chủ đề SGK: Ôn tập số tự nhiên đến 100.000</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-indigo-800/80 border border-indigo-600 text-xs font-black text-indigo-200">
          Câu {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* GAME BOARD CANVAS WRAPPER */}
      <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
        
        {/* QUESTION BOX */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-inner">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Thử Thách Số Tự Nhiên
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {currentQ.content}
          </h4>
        </div>

        {/* OPTIONS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/20 text-white';

            if (isSelected) {
              btnStyle = 'bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-400/50 scale-102';
            }

            if (feedback) {
              if (opt.id === feedback.correctOptionId) {
                btnStyle = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-400/50';
              } else if (isSelected && !feedback.isCorrect) {
                btnStyle = 'bg-rose-600 border-rose-400 text-white ring-4 ring-rose-400/50';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={feedback !== null}
                className={`p-5 rounded-2xl border-2 text-left font-black text-base transition-all duration-200 flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt.text}</span>
                {feedback && opt.id === feedback.correctOptionId && (
                  <CheckCircle className="w-6 h-6 text-emerald-300 shrink-0" />
                )}
                {feedback && isSelected && !feedback.isCorrect && (
                  <XCircle className="w-6 h-6 text-rose-300 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK EXPLANATION BOX */}
        {feedback && (
          <div className={`p-5 rounded-2xl border ${feedback.isCorrect ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/80 border-rose-500/50 text-rose-200'} space-y-2`}>
            <div className="flex items-center gap-2 font-black text-sm">
              {feedback.isCorrect ? (
                <> <CheckCircle className="w-5 h-5 text-emerald-400" /> Chính xác rồi! Em giỏi lắm! </>
              ) : (
                <> <XCircle className="w-5 h-5 text-rose-400" /> Chưa chính xác em ơi! </>
              )}
            </div>
            <p className="text-xs font-semibold leading-relaxed pl-7">{feedback.explanation}</p>
          </div>
        )}

        {/* ACTION BUTTON */}
        <div className="pt-4 flex justify-end">
          {!feedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOptionId === null || isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang kiểm tra...' : 'Xác Nhận Đáp Án'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              {currentIndex < questions.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả Trò Chơi'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
