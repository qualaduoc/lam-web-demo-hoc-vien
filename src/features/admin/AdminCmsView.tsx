import React, { useState, useEffect } from 'react';
import { Shield, Plus, BookOpen, CheckCircle2, Database, Users, Trash2, Edit2, BarChart2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Chapter, Lesson, User } from '../../types/gameTypes';

interface StudentProfile extends User {
  created_at?: string;
}

export const AdminCmsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'question' | 'students' | 'report'>('matrix');
  const [toastMsg, setToastMsg] = useState('');
  
  // Real database states
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  // Question Form States
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1001);
  const [selectedGameId, setSelectedGameId] = useState<number>(2001);
  const [correctOption, setCorrectOption] = useState('Tử số');
  const [wrongOption1, setWrongOption1] = useState('Mẫu số');
  const [wrongOption2, setWrongOption2] = useState('Phân số');

  // Student Form / Edit States
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editXp, setEditXp] = useState<number>(0);
  const [editGrade, setEditGrade] = useState<number>(4);

  // Load live data from Supabase
  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
    try {
      // 1. Fetch Students
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('total_xp', { ascending: false });
      
      if (profilesData) {
        setStudents(profilesData.map(p => ({
          id: p.id,
          email: p.email,
          fullName: p.full_name,
          avatarUrl: p.avatar_url,
          role: p.role,
          gradeLevel: p.grade_level,
          totalXp: p.total_xp,
          streakDays: p.streak_days,
          created_at: p.created_at
        })));
      }

      // 2. Fetch Chapters & Lessons
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('*, lessons(*)');
      
      if (chaptersData) {
        setChapters(chaptersData);
      }

      // 3. Fetch Questions
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*, question_options(*)');
      
      if (questionsData) {
        setQuestions(questionsData);
      }
    } catch (e) {
      console.error('Error fetching Supabase data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerToast = (msg: string) => {
    soundManager.playCorrect();
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // 1. CRUD: Thêm câu hỏi mới vào database
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionContent.trim()) return;

    if (isSupabaseConfigured) {
      try {
        // Insert question to Supabase
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .insert({
            lesson_id: selectedLessonId,
            game_id: selectedGameId,
            content: newQuestionContent.trim(),
            question_type: 'MULTIPLE_CHOICE'
          })
          .select()
          .single();

        if (qError) throw qError;

        // Insert options
        const optionsToInsert = [
          { question_id: qData.id, option_text: correctOption, is_correct: true, explanation: 'Đáp án chính xác!' },
          { question_id: qData.id, option_text: wrongOption1, is_correct: false, explanation: 'Chưa đúng, thử lại nha!' },
          { question_id: qData.id, option_text: wrongOption2, is_correct: false, explanation: 'Hãy đọc kĩ lại bài học SGK!' }
        ];

        const { error: optError } = await supabase
          .from('question_options')
          .insert(optionsToInsert);

        if (optError) throw optError;

        triggerToast('Đã soạn và lưu câu hỏi mới vào Supabase thành công!');
        setNewQuestionContent('');
        fetchData();
      } catch (err: any) {
        soundManager.playWrong();
        alert('Lỗi thêm câu hỏi: ' + err.message);
      }
    } else {
      // Fallback local simulation
      triggerToast('Đã thêm câu hỏi SGK mới vào Ngân hàng câu hỏi (Simulated)!');
      setNewQuestionContent('');
    }
  };

  // 2. CRUD: Xóa câu hỏi
  const handleDeleteQuestion = async (qId: number) => {
    if (!window.confirm('Khầy có chắc chắn muốn xóa câu hỏi này không?')) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', qId);

        if (error) throw error;
        triggerToast('Đã xóa câu hỏi khỏi Supabase thành công!');
        fetchData();
      } catch (err: any) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    } else {
      triggerToast('Đã xóa câu hỏi (Simulated)!');
    }
  };

  // 3. CRUD: Cập nhật thông tin học sinh
  const handleUpdateStudent = async (studentId: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            total_xp: editXp,
            grade_level: editGrade
          })
          .eq('id', studentId);

        if (error) throw error;
        triggerToast('Đã cập nhật thông tin học sinh thành công!');
        setEditingStudentId(null);
        fetchData();
      } catch (err: any) {
        alert('Lỗi cập nhật: ' + err.message);
      }
    } else {
      triggerToast('Đã cập nhật thông tin học sinh (Simulated)!');
      setEditingStudentId(null);
    }
  };

  // 4. CRUD: Xóa học sinh
  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Khầy có chắc chắn muốn xóa tài khoản học sinh này?')) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', studentId);

        if (error) throw error;
        triggerToast('Đã xóa tài khoản học sinh thành công!');
        fetchData();
      } catch (err: any) {
        alert('Lỗi khi xóa học sinh: ' + err.message);
      }
    } else {
      triggerToast('Đã xóa học sinh (Simulated)!');
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* CMS HEADER */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase text-purple-200 border border-white/20">
            <Shield className="w-3.5 h-3.5 text-purple-300" /> Portal Quản Trị / Hệ Thống Admin CMS
          </div>
          <h2 className="text-3xl font-black tracking-tight">QUẢN TRỊ TOÀN DIỆN HỆ THỐNG</h2>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            Supabase DB: {isSupabaseConfigured ? 'KẾT NỐI LIVE ✅' : 'CHẾ ĐỘ MÔ PHỎNG (MOCK)'}
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('matrix'); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${activeSubTab === 'matrix' ? 'bg-white text-purple-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <BookOpen className="w-4 h-4" /> Ma Trận SGK
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('question'); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${activeSubTab === 'question' ? 'bg-white text-purple-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <Plus className="w-4 h-4" /> Soạn Câu Hỏi
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('students'); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${activeSubTab === 'students' ? 'bg-white text-purple-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <Users className="w-4 h-4" /> Quản Lý Học Sinh
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('report'); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${activeSubTab === 'report' ? 'bg-white text-purple-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <BarChart2 className="w-4 h-4" /> Thống Kê & Báo Cáo
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-pulse" /> {toastMsg}
        </div>
      )}

      {/* TAB 1: MA TRẬN BÀI HỌC SGK */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" /> Cấu Trúc Bài Học SGK Hiện Có
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {chapters.length || 3} Chương/Chủ Đề
            </span>
          </div>

          <div className="space-y-4">
            {chapters.length > 0 ? (
              chapters.map((ch, idx) => (
                <div key={ch.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-800">Chủ đề {idx + 1}: {ch.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                    {ch.lessons?.map((l: Lesson) => (
                      <div key={l.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                        <p className="font-black text-indigo-600">{l.title}</p>
                        <p className="text-slate-500 font-semibold">{l.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 font-bold text-xs">
                Chưa có dữ liệu bài học SGK trên Supabase. Khầy vui lòng chạy script SQL seed để khởi tạo!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SOẠN & CẬP NHẬT CÂU HỎI */}
      {activeSubTab === 'question' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM THÊM CÂU HỎI */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h4 className="font-black text-base text-slate-800 border-b pb-3">Soạn Câu Hỏi SGK</h4>
            
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Chọn Bài Học:</label>
                <select 
                  value={selectedLessonId} 
                  onChange={(e) => setSelectedLessonId(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value={1001}>Bài 1: Ôn tập số tự nhiên đến 100.000</option>
                  <option value={1002}>Bài 2: Ôn tập các phép tính số tự nhiên</option>
                  <option value={1003}>Bài 3: Ôn tập phân số</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Chọn Trò Chơi:</label>
                <select 
                  value={selectedGameId} 
                  onChange={(e) => setSelectedGameId(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value={2001}>Trò 1 - Săn Kho Báu Số</option>
                  <option value={2002}>Trò 2 - Cân Thăng Bằng</option>
                  <option value={2003}>Trò 3 - Bánh Pizza Phân Số</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Câu hỏi:</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  placeholder="VD: Phân số 4/5 có mẫu số là?"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-600 uppercase">Đáp án Đúng (A):</label>
                <input type="text" required value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-rose-600 uppercase">Đáp án Sai 1 (B):</label>
                <input type="text" required value={wrongOption1} onChange={(e) => setWrongOption1(e.target.value)} className="w-full p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-xs font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-rose-600 uppercase">Đáp án Sai 2 (C):</label>
                <input type="text" required value={wrongOption2} onChange={(e) => setWrongOption2(e.target.value)} className="w-full p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-xs font-bold" />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs cursor-pointer">
                Lưu Câu Hỏi Lên Supabase
              </button>
            </form>
          </div>

          {/* DANH SÁCH CÂU HỎI HIỆN CÓ */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-black text-base text-slate-800 border-b pb-3 flex justify-between items-center">
              <span>Ngân Hàng Câu Hỏi ({questions.length})</span>
              <button onClick={fetchData} className="text-xs font-bold text-indigo-600 hover:underline">Tải lại</button>
            </h4>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {questions.length > 0 ? (
                questions.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      <p className="font-extrabold text-xs text-slate-800">{q.content}</p>
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                        {q.question_options?.map((opt: any) => (
                          <span key={opt.id} className={`px-2 py-0.5 rounded-md ${opt.is_correct ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'}`}>
                            {opt.option_text}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 font-bold text-xs">Chưa có câu hỏi nào.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUẢN LÝ TÀI KHOẢN HỌC SINH */}
      {activeSubTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Danh Sách Tài Khoản Học Sinh Đăng Ký
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Tổng số: {students.length} Học sinh
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50">
                  <th className="p-3.5">Học Sinh</th>
                  <th className="p-3.5">Username</th>
                  <th className="p-3.5">Khối Lớp</th>
                  <th className="p-3.5">Điểm Tích Lũy</th>
                  <th className="p-3.5">Ngày Hoạt Động (Streak)</th>
                  <th className="p-3.5 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={st.avatarUrl} alt="" className="w-8 h-8 rounded-lg bg-purple-50" />
                      <span className="font-extrabold text-slate-800">{st.fullName}</span>
                    </td>
                    <td className="p-3.5">{st.email}</td>
                    <td className="p-3.5">
                      {editingStudentId === st.id ? (
                        <select 
                          value={editGrade} 
                          onChange={(e) => setEditGrade(parseInt(e.target.value))}
                          className="p-1 rounded-md border text-xs"
                        >
                          <option value={1}>Lớp 1</option>
                          <option value={2}>Lớp 2</option>
                          <option value={3}>Lớp 3</option>
                          <option value={4}>Lớp 4</option>
                          <option value={5}>Lớp 5</option>
                        </select>
                      ) : (
                        `Lớp ${st.gradeLevel}`
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-indigo-600">
                      {editingStudentId === st.id ? (
                        <input 
                          type="number" 
                          value={editXp} 
                          onChange={(e) => setEditXp(parseInt(e.target.value))} 
                          className="w-16 p-1 border rounded-md text-xs"
                        />
                      ) : (
                        `${st.totalXp} XP`
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-amber-600">{st.streakDays} ngày 🔥</td>
                    <td className="p-3.5 text-center">
                      {editingStudentId === st.id ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleUpdateStudent(st.id)} className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]">Lưu</button>
                          <button onClick={() => setEditingStudentId(null)} className="px-2 py-1 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">Hủy</button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingStudentId(st.id);
                              setEditXp(st.totalXp);
                              setEditGrade(st.gradeLevel);
                            }}
                            className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors border border-indigo-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(st.id)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: THỐNG KÊ & BÁO CÁO TIẾN ĐỘ */}
      {activeSubTab === 'report' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" /> Báo Cáo Thống Kê Tiến Độ Học Lớp
            </h3>
            <p className="text-xs font-bold text-slate-400">Xem tổng điểm trung bình và các chỉ số hoạt động</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <p className="text-xs font-bold text-blue-700 uppercase">Tổng Học Sinh</p>
              <p className="text-2xl font-black text-blue-900">{students.length} Bạn</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <p className="text-xs font-bold text-emerald-700 uppercase">Điểm XP Cao Nhất</p>
              <p className="text-2xl font-black text-emerald-900">
                {students.length > 0 ? `${students[0].fullName} (${students[0].totalXp} XP)` : '0 XP'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <p className="text-xs font-bold text-amber-700 uppercase">Chuỗi Streak Lớn Nhất</p>
              <p className="text-2xl font-black text-amber-900">
                {students.length > 0 ? `${students.reduce((max, s) => s.streakDays > max ? s.streakDays : max, 0)} Ngày 🔥` : '0 Ngày'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
