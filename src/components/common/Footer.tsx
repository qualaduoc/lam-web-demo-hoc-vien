import React from 'react';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎮</span>
              <span className="font-black text-lg text-white tracking-wide">EDUGAME PRIMARY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng Web Game Học Tập Tương Tác Tiểu Học theo sát chương trình Sách Giáo Khoa (Kết nối tri thức, Cánh diều, Chân trời sáng tạo).
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Các Môn Học SGK
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>• Môn Toán (Số tự nhiên, Phép tính, Phân số)</li>
              <li>• Môn Tiếng Việt (Chính tả, Từ & Câu, Luyện đọc)</li>
              <li>• Môn Tiếng Anh (Vocabulary & Communication)</li>
              <li>• Môn Tự Nhiên & Xã Hội (Lịch sử & Địa lý)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Tính Năng Nổi Bật
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>• Game Engine 2D Canvas Tương Tác Trực Quan</li>
              <li>• Chấm Điểm Server-Side & Tính Điểm Thưởng XP</li>
              <li>• Bản Đồ Chinh Phục Bài Học SGK Khối 1-5</li>
              <li>• Bảng Vàng Vinh Danh & Bộ Huy Hiệu Độc Quyền</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">Dành Cho Giáo Viên</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Quản trị ngân hàng câu hỏi SGK, xem báo cáo tiến trình học tập của học sinh cả lớp.
            </p>
            <span className="inline-block px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold">
              Phiên Bản 2.5 • Chuẩn Bộ Giáo Dục
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© 2026 EduGame Primary Platform. Phát triển với <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> cho Giáo dục Tiểu học Việt Nam.</p>
          <p>Thiết kế độc quyền bởi Antigravity AI Engine</p>
        </div>
      </div>
    </footer>
  );
};
