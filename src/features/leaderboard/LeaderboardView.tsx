import React from 'react';
import { Trophy, Award, Star, Sparkles } from 'lucide-react';
import { LEADERBOARD_SEED } from '../../config/curriculumData';

export const LeaderboardView: React.FC = () => {

  return (
    <div className="space-y-8 py-6">
      
      {/* HEADER BANNER BẢNG VÀNG */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 sm:p-10 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase text-amber-100 border border-white/20">
            <Trophy className="w-3.5 h-3.5 text-amber-200" /> Bảng Vinh Danh Tuần
          </div>
          <h2 className="text-3xl font-black tracking-tight">BẢNG VÀNG HỌC SINH XUẤT SẮC</h2>
          <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
            Tích lũy điểm thưởng XP qua các trò chơi tương tác SGK để leo lên vị trí dẫn đầu toàn trường!
          </p>
        </div>

        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-5xl shadow-lg shrink-0">
          🏆
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEADERBOARD LIST (TOP 5) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Top Học Sinh Điểm Cao Nhất
            </h3>
            <span className="text-xs font-bold text-slate-400">Cập nhật Real-time</span>
          </div>

          <div className="space-y-3">
            {LEADERBOARD_SEED.map((st) => {
              let rankBadge = <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center">{st.rank}</span>;

              if (st.rank === 1) {
                rankBadge = <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black text-base flex items-center justify-center shadow-md shadow-amber-200">🥇</span>;
              } else if (st.rank === 2) {
                rankBadge = <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-slate-300 to-slate-400 text-white font-black text-base flex items-center justify-center shadow-md">🥈</span>;
              } else if (st.rank === 3) {
                rankBadge = <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 text-white font-black text-base flex items-center justify-center shadow-md">🥉</span>;
              }

              return (
                <div
                  key={st.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${st.rank === 1 ? 'bg-amber-50/50 border-amber-200 shadow-xs' : 'bg-slate-50/60 border-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    {rankBadge}
                    <img
                      src={st.avatarUrl}
                      alt={st.fullName}
                      className="w-11 h-11 rounded-xl bg-purple-100 border-2 border-purple-200"
                    />
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{st.fullName}</h4>
                      <p className="text-[11px] font-semibold text-slate-500">Lớp {st.gradeLevel} • Chuỗi {st.streakDays} ngày 🔥</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-indigo-600 flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 inline" /> {st.totalXp} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STUDENT BADGES & REWARDS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Huy Hiệu Học Tập
            </h3>
            <p className="text-xs font-bold text-slate-400">Danh hiệu mở khóa sau các bài game SGK</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h4 className="text-xs font-black text-indigo-900">Thần Đồng Toán Học SGK</h4>
                <p className="text-[10px] font-semibold text-indigo-700">Đạt 100 điểm tuyệt đối trong 5 trò chơi Toán</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <h4 className="text-xs font-black text-amber-900">Chiến Sĩ Chăm Chỉ (7 Ngày)</h4>
                <p className="text-[10px] font-semibold text-amber-700">Chơi trò chơi học tập liên tục 7 ngày</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 flex items-center gap-3">
              <span className="text-3xl">🍕</span>
              <div>
                <h4 className="text-xs font-black text-rose-900">Vua Bánh Pizza Phân Số</h4>
                <p className="text-[10px] font-semibold text-rose-700">Hoàn thành bài phân số không sai câu nào</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
