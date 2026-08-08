import React, { useState } from 'react';
import { Shield, Plus, BookOpen, CheckCircle2, Database, Users } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const AdminCmsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'question' | 'report'>('matrix');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionContent) return;

    soundManager.playCorrect();
    setToastMsg('Đã thêm câu hỏi SGK mới vào Ngân hàng câu hỏi thành công!');
    setNewQuestionContent('');

    setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* CMS HEADER */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase text-purple-200 border border-white/20">
            <Shield className="w-3.5 h-3.5 text-purple-300" /> Portal Giáo Viên / CMS Quản Trị
          </div>
          <h2 className="text-3xl font-black tracking-tight">QUẢN LÝ BÀI HỌC SGK & NGÂN HÀNG CÂU HỎI</h2>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            Thầy Nguyễn Văn Được • Quản trị viên môn Toán Tiểu Học Khối 1 - Khối 5
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('matrix'); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${activeSubTab === 'matrix' ? 'bg-white text-purple-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <BookOpen className="w-4 h-4" /> Ma Trận SGK
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('question'); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${activeSubTab === 'question' ? 'bg-white text-purple-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <Plus className="w-4 h-4" /> Soạn Câu Hỏi
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('report'); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${activeSubTab === 'report' ? 'bg-white text-purple-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <Users className="w-4 h-4" /> Báo Cáo Lớp
          </button>
        </div>
      </div>

      {/* TOAST SUCCESS NOTIFICATION */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {toastMsg}
        </div>
      )}

      {/* TAB 1: MA TRẬN CHƯƠNG TRÌNH SGK */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" /> Cấu Trúc Ma Trận Bài Học Toán Lớp 4 (SGK Kết Nối Tri Thức)
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              3 Chủ Đề • 4 Bài Học • 3 Trò Chơi
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-800">Chủ đề 1: Ôn tập và bổ sung số tự nhiên & Phép tính</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-black text-indigo-600">Bài 1: Ôn tập các số tự nhiên đến 100.000</p>
                  <p className="text-slate-500 font-medium">🎮 Trò 1 - Săn Kho Báu Số Tự Nhiên (3 câu hỏi)</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-black text-indigo-600">Bài 2: Ôn tập phép tính với số tự nhiên (+ - * /)</p>
                  <p className="text-slate-500 font-medium">🎮 Trò 2 - Cân Thăng Bằng Phép Tính (3 câu hỏi)</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-800">Chủ đề 2: Phân số & Phép tính với Phân số</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-black text-rose-600">Bài 3: Ôn tập phân số & Tính chất cơ bản</p>
                  <p className="text-slate-500 font-medium">🎮 Trò 3 - Bánh Pizza Phân Số Kỳ Diệu (3 câu hỏi)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOẠN CÂU HỎI MỚI */}
      {activeSubTab === 'question' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" /> Soạn Câu Hỏi Mới Cho Trò Chơi SGK
            </h3>
            <p className="text-xs font-bold text-slate-400">Tạo câu hỏi trắc nghiệm hoặc kéo thả trực quan cho bài học</p>
          </div>

          <form onSubmit={handleSaveQuestion} className="space-y-5 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase">Chọn Bài Học SGK:</label>
              <select className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Bài 1: Ôn tập các số tự nhiên đến 100.000</option>
                <option>Bài 2: Ôn tập các phép tính với số tự nhiên</option>
                <option>Bài 3: Ôn tập phân số và tính chất cơ bản</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase">Nội Dung Câu Hỏi SGK:</label>
              <textarea
                value={newQuestionContent}
                onChange={(e) => setNewQuestionContent(e.target.value)}
                placeholder="VD: Trong phân số 3/7, số 3 gọi là gì?"
                rows={3}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-emerald-700 uppercase">Đáp án Đúng (A):</label>
                <input type="text" defaultValue="Tử số" className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-900" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-rose-700 uppercase">Đáp án Sai (B):</label>
                <input type="text" defaultValue="Mẫu số" className="w-full p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-xs font-bold text-rose-900" />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
            >
              Lưu Vào Ngân Hàng Câu Hỏi
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: BÁO CÁO TIẾN ĐỘ HỌC SINH */}
      {activeSubTab === 'report' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Báo Cáo Tiến Độ Làm Bài Của Học Sinh Cả Lớp
            </h3>
            <p className="text-xs font-bold text-slate-400">Xem điểm trung bình và tỷ lệ hoàn thành các trò chơi bài dạy SGK</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <p className="text-xs font-bold text-blue-700 uppercase">Tổng Học Sinh Lớp 4A</p>
              <p className="text-2xl font-black text-blue-900">35 Học sinh</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <p className="text-xs font-bold text-emerald-700 uppercase">Tỷ Lệ Đã Hoàn Thành Game</p>
              <p className="text-2xl font-black text-emerald-900">92%</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <p className="text-xs font-bold text-amber-700 uppercase">Điểm Trung Bình Cả Lớp</p>
              <p className="text-2xl font-black text-amber-900">8.8 / 10 Điểm</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
