import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Supabase Client Setup on Backend
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder'))
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Fallback In-Memory Database Store
let dbStore = {
  users: [
    { id: 'u_admin', username: 'admin', fullName: 'Thầy Nguyễn Văn Được', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherDuoc', role: 'admin', gradeLevel: 4, totalXp: 1500, streakDays: 15 },
    { id: 'u_student1', username: 'hieu_lop4', fullName: 'Nguyễn Trung Hiếu', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hieu123', role: 'student', gradeLevel: 4, totalXp: 850, streakDays: 7 },
    { id: 'u_student2', username: 'lan_lop4', fullName: 'Trần Thị Mai Lan', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lan456', role: 'student', gradeLevel: 4, totalXp: 1120, streakDays: 12 },
    { id: 'u_student3', username: 'minh_lop4', fullName: 'Phạm Quang Minh', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Minh789', role: 'student', gradeLevel: 4, totalXp: 640, streakDays: 4 }
  ],
  subjects: [
    { id: 1, code: 'MATH', name: 'Toán Học', icon: 'Calculator', colorTheme: 'blue', description: 'Số học, Phép tính, Phân số, Hình học và Đo lường SGK' },
    { id: 2, code: 'VIETNAMESE', name: 'Tiếng Việt', icon: 'BookOpen', colorTheme: 'red', description: 'Tập đọc, Luyện từ và câu, Chính tả, Tập làm văn SGK' },
    { id: 3, code: 'ENGLISH', name: 'Tiếng Anh', icon: 'Languages', colorTheme: 'amber', description: 'Vocabulary, Grammar, Phonics & Communication SGK' },
    { id: 4, code: 'SCIENCE', name: 'Tự Nhiên & Xã Hội', icon: 'Compass', colorTheme: 'emerald', description: 'Khám phá tự nhiên, Khoa học, Lịch sử và Địa lý SGK' }
  ],
  chapters: [
    { id: 101, subjectId: 1, gradeLevel: 4, publisher: 'Kết nối tri thức', title: 'Chủ đề 1: Ôn tập và bổ sung số tự nhiên & Phép tính' },
    { id: 102, subjectId: 1, gradeLevel: 4, publisher: 'Kết nối tri thức', title: 'Chủ đề 2: Phân số & Phép tính với Phân số' }
  ],
  lessons: [
    { id: 1001, chapterId: 101, lessonNumber: 1, title: 'Bài 1: Ôn tập các số tự nhiên đến 100.000', summary: 'Đọc, viết, so sánh số tự nhiên, hàng và lớp' },
    { id: 1002, chapterId: 101, lessonNumber: 2, title: 'Bài 2: Ôn tập các phép tính với số tự nhiên (Cộng, Trừ, Nhân, Chia)', summary: 'Thực hiện phép tính nhẩm, đặt tính rồi tính' },
    { id: 1003, chapterId: 102, lessonNumber: 3, title: 'Bài 3: Ôn tập phân số và tính chất cơ bản của phân số', summary: 'Khái niệm phân số, đọc viết phân số, phân số bằng nhau' }
  ],
  games: [
    { id: 2001, lessonId: 1001, typeCode: 'SPEED_RACE', title: 'Trò 1 - Săn Kho Báu Số Tự Nhiên', description: 'Chạy đua vượt chướng ngại vật, nhận diện hàng chục nghìn, so sánh số', difficulty: 'MEDIUM', maxScore: 100, timeLimit: 180 },
    { id: 2002, lessonId: 1002, typeCode: 'BALANCE_SCALE', title: 'Trò 2 - Cân Thăng Bằng Phép Tính', description: 'Kéo thả biểu thức toán học giữ đòn cân cân bằng đúng', difficulty: 'MEDIUM', maxScore: 100, timeLimit: 180 },
    { id: 2003, lessonId: 1003, typeCode: 'PIZZA_FRACTION', title: 'Trò 3 - Bánh Pizza Phân Số Kỳ Diệu', description: 'Cắt bánh Pizza & Ghép thẻ phân số tương ứng trực quan', difficulty: 'EASY', maxScore: 100, timeLimit: 180 }
  ],
  questions: [
    {
      id: 3001, gameId: 2001, content: 'Trong số 85.421, chữ số 8 thuộc hàng nào?',
      options: [
        { id: 1, text: 'Hàng chục nghìn', isCorrect: true, explanation: 'Số 8 đứng ở vị trí hàng chục nghìn trong lớp nghìn' },
        { id: 2, text: 'Hàng nghìn', isCorrect: false, explanation: 'Số 5 mới là hàng nghìn' },
        { id: 3, text: 'Hàng trăm', isCorrect: false, explanation: 'Số 4 mới là hàng trăm' }
      ]
    },
    {
      id: 3101, gameId: 2002, content: 'Tìm x sao cho đòn cân thăng bằng: x + 1.200 = 3.500',
      options: [
        { id: 1, text: 'x = 2.300', isCorrect: true, explanation: 'x = 3.500 - 1.200 = 2.300' },
        { id: 2, text: 'x = 4.700', isCorrect: false, explanation: 'Tính lại phép trừ' }
      ]
    },
    {
      id: 3201, gameId: 2003, content: 'Bánh Pizza chia 8 miếng bằng nhau. Nam ăn 3 miếng. Phân số chỉ số miếng bánh Nam đã ăn là:',
      options: [
        { id: 1, text: '3/8', isCorrect: true, explanation: 'Tử số là số miếng đã ăn (3), Mẫu số là tổng miếng bánh (8)' },
        { id: 2, text: '8/3', isCorrect: false, explanation: 'Nhầm lẫn giữa tử số và mẫu số rồi' }
      ]
    }
  ]
};

// REST API ENDPOINTS WITH SUPABASE QUERY SUPPORT
app.get('/api/v1/subjects', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('subjects').select('*');
      if (!error && data && data.length > 0) {
        return res.json({ success: true, data, source: 'supabase' });
      }
    } catch (e) {
      console.error('Supabase Query Error:', e);
    }
  }
  res.json({ success: true, data: dbStore.subjects, source: 'memory' });
});

app.get('/api/v1/curriculum', async (req, res) => {
  const grade = parseInt(req.query.grade || '4');
  const subjectId = parseInt(req.query.subjectId || '1');

  if (supabase) {
    try {
      const { data: chapters, error } = await supabase
        .from('chapters')
        .select('*, lessons(*, games(*))')
        .eq('subject_id', subjectId)
        .eq('grade_level', grade);

      if (!error && chapters && chapters.length > 0) {
        return res.json({ success: true, data: chapters, source: 'supabase' });
      }
    } catch (e) {
      console.error('Supabase Query Error:', e);
    }
  }

  const filteredChapters = dbStore.chapters.filter(c => c.subjectId === subjectId && c.gradeLevel === grade);
  const mapData = filteredChapters.map(ch => {
    const chapterLessons = dbStore.lessons.filter(l => l.chapterId === ch.id).map(l => {
      const lessonGames = dbStore.games.filter(g => g.lessonId === l.id);
      return { ...l, games: lessonGames };
    });
    return { ...ch, lessons: chapterLessons };
  });

  res.json({ success: true, data: mapData, source: 'memory' });
});

app.get('/api/v1/leaderboard', async (req, res) => {
  if (supabase) {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, grade_level, total_xp, streak_days')
        .order('total_xp', { ascending: false })
        .limit(10);

      if (!error && profiles && profiles.length > 0) {
        const formatted = profiles.map((p, idx) => ({
          rank: idx + 1,
          id: p.id,
          fullName: p.full_name,
          avatarUrl: p.avatar_url,
          gradeLevel: p.grade_level,
          totalXp: p.total_xp,
          streakDays: p.streak_days
        }));
        return res.json({ success: true, data: formatted, source: 'supabase' });
      }
    } catch (e) {
      console.error('Supabase Query Error:', e);
    }
  }

  const sortedStudents = [...dbStore.users]
    .sort((a, b) => b.totalXp - a.totalXp)
    .map((st, index) => ({
      rank: index + 1,
      id: st.id,
      fullName: st.fullName,
      avatarUrl: st.avatarUrl,
      gradeLevel: st.gradeLevel,
      totalXp: st.totalXp,
      streakDays: st.streakDays
    }));

  res.json({ success: true, data: sortedStudents, source: 'memory' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    supabaseConnected: Boolean(supabase),
    supabaseUrl: supabaseUrl ? supabaseUrl.replace(/https:\/\/(.*)\.supabase\.co/, '$1') : null,
    serverTime: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`EduGame Backend API Server listening on http://localhost:${PORT}`);
  console.log(`Supabase Integration Status: ${supabase ? 'CONNECTED ✅ (' + supabaseUrl + ')' : 'NOT CONFIGURED'}`);
});
