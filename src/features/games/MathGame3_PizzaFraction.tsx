import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import type { Question, AnswerResult } from '../../types/gameTypes';
import { soundManager } from '../../utils/soundEffects';

interface MathGame3Props {
  questions: Question[];
  onAnswerSubmit: (questionId: number, optionId: number) => Promise<AnswerResult>;
  onCompleteGame: () => void;
}

export const MathGame3_PizzaFraction: React.FC<MathGame3Props> = ({
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
    <div className="bg-gradient-to-b from-rose-900 via-pink-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-rose-500/30">
      
      {/* GAME HEADER */}
      <div className="flex items-center justify-between mb-8 border-b border-rose-700/50 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍕</span>
          <div>
            <h3 className="text-xl font-extrabold text-amber-300">TRÒ 3: BÁNH PIZZA PHÂN SỐ KỲ DIỆU</h3>
            <p className="text-xs text-rose-200 font-semibold">Chủ đề SGK: Khái niệm phân số, tử số & mẫu số</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-rose-800/80 border border-rose-600 text-xs font-black text-rose-200">
          Câu {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* PIZZA VISUAL RENDER */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/15 text-center space-y-4 shadow-inner">
        <div className="flex justify-center items-center my-3">
          <div className="relative w-32 h-32 rounded-full border-4 border-amber-500 bg-amber-100 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-5xl">🍕</span>
          </div>
        </div>

        <h4 className="text-xl font-black text-white leading-snug">
          {currentQ.content}
        </h4>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/20 text-white';

          if (isSelected) {
            btnStyle = 'bg-rose-600 border-rose-400 text-white ring-4 ring-rose-400/50';
          }

          if (feedback) {
            if (opt.id === feedback.correctOptionId) {
              btnStyle = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-400/50';
            } else if (isSelected && !feedback.isCorrect) {
              btnStyle = 'bg-rose-700 border-rose-500 text-white ring-4 ring-rose-500/50';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              disabled={feedback !== null}
              className={`p-5 rounded-2xl border-2 text-left font-black text-base transition-all flex items-center justify-between ${btnStyle}`}
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
        <div className={`p-5 rounded-2xl border mb-6 ${feedback.isCorrect ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/80 border-rose-500/50 text-rose-200'} space-y-2`}>
          <div className="flex items-center gap-2 font-black text-sm">
            {feedback.isCorrect ? (
              <> <CheckCircle className="w-5 h-5 text-emerald-400" /> Bánh Pizza đã được ghép đúng phân số! </>
            ) : (
              <> <XCircle className="w-5 h-5 text-rose-400" /> Chưa đúng phân số rồi em ơi! </>
            )}
          </div>
          <p className="text-xs font-semibold leading-relaxed pl-7">{feedback.explanation}</p>
        </div>
      )}

      {/* ACTION BUTTON */}
      <div className="flex justify-end">
        {!feedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOptionId === null || isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer"
          >
            {isSubmitting ? 'Đang kiểm tra...' : 'Chọn Phân Số Này'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer"
          >
            {currentIndex < questions.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả Trò Chơi'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
