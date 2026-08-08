import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Supabase Client Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Supabase Admin Client (dùng Service Role Key để BỎ QUA HOÀN TOÀN EMAIL RATE LIMIT)
const supabaseAdmin = (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('placeholder'))
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : supabase;

// Fallback In-Memory Database Store
let dbStore = {
  users: [
    { id: 'u_admin', username: 'admin', fullName: 'Thầy Nguyễn Văn Được', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherDuoc', role: 'admin', gradeLevel: 4, totalXp: 1500, streakDays: 15 },
    { id: 'u_student1', username: 'hieu_lop4', fullName: 'Nguyễn Trung Hiếu', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hieu123', role: 'student', gradeLevel: 4, totalXp: 850, streakDays: 7 }
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
  ]
};

// -----------------------------------------------------------------------------
// AUTH ENDPOINTS WITH ADMIN RATE LIMIT BYPASS
// -----------------------------------------------------------------------------

// 1. ĐĂNG KÝ TÀI KHOẢN HỌC SINH MỚI (BỎ QUA RATE LIMIT)
app.post('/api/v1/auth/register', async (req, res) => {
  const { username, password, fullName, gradeLevel } = req.body;

  if (!username || !password || !fullName) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ Tên đăng nhập, Mật khẩu và Họ tên!' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự!' });
  }

  const cleanInput = username.trim().toLowerCase();
  const syntheticEmail = cleanInput.includes('@')
    ? cleanInput
    : `${cleanInput.replace(/[^a-z0-9._-]/g, '')}@edugame.local`;
  const finalUsername = cleanInput;

  if (supabaseAdmin) {
    try {
      const { data: existingUser } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('username', finalUsername)
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Tên đăng nhập / Email này đã được sử dụng!' });
      }

      // Dùng Supabase Admin API để BỎ QUA RATE LIMIT & BỎ QUA GỬI EMAIL XÁC NHẬN
      let authUser;
      let sessionToken = null;

      if (supabaseAdmin.auth && supabaseAdmin.auth.admin) {
        const { data: adminAuth, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email: syntheticEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            username: finalUsername,
            full_name: fullName,
            grade_level: parseInt(gradeLevel || '4')
          }
        });

        if (adminError) {
          return res.status(400).json({ success: false, error: adminError.message });
        }

        authUser = adminAuth.user;

        // Đăng nhập lấy session token
        if (supabase) {
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email: syntheticEmail,
            password: password
          });
          sessionToken = signInData?.session?.access_token || null;
        }
      } else {
        // Fallback SignUp thông thường
        const { data: normalAuth, error: normalError } = await supabase.auth.signUp({
          email: syntheticEmail,
          password: password,
          options: {
            data: {
              username: finalUsername,
              full_name: fullName,
              grade_level: parseInt(gradeLevel || '4')
            }
          }
        });

        if (normalError) {
          return res.status(400).json({ success: false, error: normalError.message });
        }
        authUser = normalAuth.user;
        sessionToken = normalAuth.session?.access_token || null;
      }

      // Tạo record public.profiles
      const profileRole = finalUsername === 'nguyenthanhduocathy@gmail.com' ? 'admin' : 'student';
      const profileData = {
        id: authUser.id,
        username: finalUsername,
        full_name: fullName,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalUsername)}`,
        role: profileRole,
        grade_level: parseInt(gradeLevel || '4'),
        total_xp: 0,
        streak_days: 1
      };

      await supabaseAdmin.from('profiles').upsert(profileData);

      return res.json({
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        data: {
          user: {
            id: authUser.id,
            username: finalUsername,
            fullName: fullName,
            avatarUrl: profileData.avatar_url,
            role: profileRole,
            gradeLevel: parseInt(gradeLevel || '4'),
            totalXp: 0,
            streakDays: 1
          },
          token: sessionToken
        }
      });

    } catch (e) {
      console.error('Supabase Auth Register Error:', e);
      return res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng ký tài khoản' });
    }
  }

  // Memory Fallback
  const existing = dbStore.users.find(u => u.username === finalUsername);
  if (existing) {
    return res.status(400).json({ success: false, error: 'Tên đăng nhập này đã tồn tại!' });
  }

  const mockRole = finalUsername === 'nguyenthanhduocathy@gmail.com' ? 'admin' : 'student';
  const newUser = {
    id: 'u_' + Date.now(),
    username: finalUsername,
    fullName,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalUsername)}`,
    role: mockRole,
    gradeLevel: parseInt(gradeLevel || '4'),
    totalXp: 0,
    streakDays: 1
  };

  dbStore.users.push(newUser);

  res.json({
    success: true,
    message: 'Đăng ký tài khoản thành công!',
    data: { user: newUser, token: 'mock_token_' + Date.now() }
  });
});

// 2. ĐĂNG NHẬP
app.post('/api/v1/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập Tên đăng nhập và Mật khẩu!' });
  }

  const cleanInput = username.trim().toLowerCase();
  const syntheticEmail = cleanInput.includes('@')
    ? cleanInput
    : `${cleanInput.replace(/[^a-z0-9._-]/g, '')}@edugame.local`;
  const finalUsername = cleanInput;

  if (supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password
      });

      if (authError) {
        return res.status(400).json({ success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      const user = profile || {
        id: authData.user.id,
        username: finalUsername,
        full_name: authData.user.user_metadata.full_name || finalUsername,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalUsername)}`,
        role: 'student',
        grade_level: 4,
        total_xp: 0,
        streak_days: 1
      };

      return res.json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: {
          user: {
            id: user.id,
            username: user.username,
            fullName: user.full_name,
            avatarUrl: user.avatar_url,
            role: user.role,
            gradeLevel: user.grade_level,
            totalXp: user.total_xp,
            streakDays: user.streak_days
          },
          token: authData.session?.access_token || null
        }
      });

    } catch (e) {
      console.error('Supabase Auth Login Error:', e);
      return res.status(500).json({ success: false, error: 'Lỗi đăng nhập hệ thống' });
    }
  }

  // Memory Fallback
  const user = dbStore.users.find(u => u.username === finalUsername);
  if (!user) {
    return res.status(400).json({ success: false, error: 'Tài khoản không tồn tại!' });
  }

  res.json({
    success: true,
    message: 'Đăng nhập thành công!',
    data: { user, token: 'mock_token_' + Date.now() }
  });
});

// REST API ENDPOINTS
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
    supabaseAdminConnected: Boolean(supabaseAdmin && supabaseAdmin.auth && supabaseAdmin.auth.admin),
    serverTime: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`EduGame Backend API Server listening on http://localhost:${PORT}`);
  console.log(`Supabase Integration Status: ${supabase ? 'CONNECTED ✅' : 'NOT CONFIGURED'}`);
  console.log(`Supabase Admin Bypass Status: ${supabaseAdmin && supabaseAdmin.auth && supabaseAdmin.auth.admin ? 'ACTIVE ✅ (Email Rate Limit Bypassed)' : 'INACTIVE'}`);
});
