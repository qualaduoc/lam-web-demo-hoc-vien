import React, { useState } from 'react';
import { ArrowLeft, Clock, Heart, Award } from 'lucide-react';
import type { Game, Question } from '../../types/gameTypes';
import { MathGame1_NumberTreasure } from './MathGame1_NumberTreasure';
import { MathGame2_BalanceScale } from './MathGame2_BalanceScale';
import { MathGame3_PizzaFraction } from './MathGame3_PizzaFraction';
import { GameVictoryModal } from './GameVictoryModal';
import { soundManager } from '../../utils/soundEffects';

interface GameEngineContainerProps {
  game: Game;
  onBackToMap: () => void;
}

export const GameEngineContainer: React.FC<GameEngineContainerProps> = ({ game, onBackToMap }) => {
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock question dataset based on Game ID
  const getQuestions = (): Question[] => {
    if (game.id === 2001) {
      return [
        {
          id: 3001,
          content: 'Trong số 85.421, chữ số 8 thuộc hàng nào?',
          options: [
            { id: 1, text: 'Hàng chục nghìn' },
            { id: 2, text: 'Hàng nghìn' },
            { id: 3, text: 'Hàng trăm' },
            { id: 4, text: 'Hàng chục' }
          ]
        },
        {
          id: 3002,
          content: 'Số gồm 5 chục nghìn, 3 trăm, 2 đơn vị viết là gì?',
          options: [
            { id: 1, text: '50.302' },
            { id: 2, text: '53.200' },
            { id: 3, text: '50.320' },
            { id: 4, text: '5.302' }
          ]
        },
        {
          id: 3003,
          content: 'So sánh hai số tự nhiên: 98.765 ... 98.756',
          options: [
            { id: 1, text: '>' },
            { id: 2, text: '<' },
            { id: 3, text: '=' }
          ]
        }
      ];
    } else if (game.id === 2002) {
      return [
        {
          id: 3101,
          content: 'Tìm x sao cho đòn cân thăng bằng: x + 1.200 = 3.500',
          options: [
            { id: 1, text: 'x = 2.300' },
            { id: 2, text: 'x = 4.700' },
            { id: 3, text: 'x = 2.500' }
          ]
        },
        {
          id: 3102,
          content: 'Tính nhẩm nhanh: 2.500 x 4 = ?',
          options: [
            { id: 1, text: '10.000' },
            { id: 2, text: '1.000' },
            { id: 3, text: '8.000' }
          ]
        }
      ];
    } else {
      return [
        {
          id: 3201,
          content: 'Bánh Pizza chia 8 miếng bằng nhau. Nam ăn 3 miếng. Phân số chỉ số miếng bánh Nam ăn là:',
          options: [
            { id: 1, text: '3/8' },
            { id: 2, text: '8/3' },
            { id: 3, text: '5/8' }
          ]
        },
        {
          id: 3202,
          content: 'Trong phân số 5/9, tử số và mẫu số lần lượt là:',
          options: [
            { id: 1, text: 'Tử số là 5, Mẫu số là 9' },
            { id: 2, text: 'Tử số là 9, Mẫu số là 5' },
            { id: 3, text: 'Cả hai đều là 5' }
          ]
        }
      ];
    }
  };

  const questions = getQuestions();

  const handleAnswerSubmit = async (questionId: number, optionId: number) => {
    let isCorrect = false;
    let explanation = '';

    if (questionId === 3001 && optionId === 1) { isCorrect = true; explanation = 'Số 8 đứng ở vị trí hàng chục nghìn'; }
    else if (questionId === 3002 && optionId === 1) { isCorrect = true; explanation = '5 chục nghìn = 50.000, 3 trăm = 300, 2 đơn vị = 2 => 50.302'; }
    else if (questionId === 3003 && optionId === 1) { isCorrect = true; explanation = 'Hàng chục 6 > 5 nên 98.765 > 98.756'; }
    else if (questionId === 3101 && optionId === 1) { isCorrect = true; explanation = 'x = 3.500 - 1.200 = 2.300'; }
    else if (questionId === 3102 && optionId === 1) { isCorrect = true; explanation = '2.500 x 4 = 10.000'; }
    else if (questionId === 3201 && optionId === 1) { isCorrect = true; explanation = 'Tử số 3, mẫu số 8 => 3/8'; }
    else if (questionId === 3202 && optionId === 1) { isCorrect = true; explanation = 'Tử số viết trên (5), Mẫu số viết dưới (9)'; }
    else {
      explanation = 'Rất tiếc! Hãy đọc kĩ lại đề bài bài học SGK nhé em!';
    }

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setScore(prev => prev + Math.round(100 / questions.length));
    }

    return {
      isCorrect,
      explanation,
      correctOptionId: 1
    };
  };

  const handleRestart = () => {
    setScore(0);
    setCorrectCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* HUD GAME BAR */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => { soundManager.playClick(); onBackToMap(); }}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-2 transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát Game
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
            <Heart className="w-4 h-4 fill-rose-500" /> 3/3 Mạng
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
            <Clock className="w-4 h-4 text-indigo-500" /> 03:00
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Award className="w-4 h-4 text-amber-500" /> {score} Điểm
          </div>
        </div>
      </div>

      {/* GAME PLAYER SPECIFIC MECHANIC */}
      {game.id === 2001 && (
        <MathGame1_NumberTreasure
          questions={questions}
          onAnswerSubmit={handleAnswerSubmit}
          onCompleteGame={() => setIsCompleted(true)}
        />
      )}

      {game.id === 2002 && (
        <MathGame2_BalanceScale
          questions={questions}
          onAnswerSubmit={handleAnswerSubmit}
          onCompleteGame={() => setIsCompleted(true)}
        />
      )}

      {game.id === 2003 && (
        <MathGame3_PizzaFraction
          questions={questions}
          onAnswerSubmit={handleAnswerSubmit}
          onCompleteGame={() => setIsCompleted(true)}
        />
      )}

      {/* VICTORY MODAL */}
      {isCompleted && (
        <GameVictoryModal
          score={score}
          maxScore={100}
          correctCount={correctCount}
          totalQuestions={questions.length}
          xpEarned={score * 2}
          gameTitle={game.title}
          onPlayAgain={handleRestart}
          onBackToMap={onBackToMap}
        />
      )}

    </div>
  );
};
