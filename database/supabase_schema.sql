-- =============================================================================
-- EDUGAME PRIMARY - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Chạy script này trực tiếp trong "SQL Editor" trên Bảng điều khiển Supabase
-- =============================================================================

-- 1. KÍCH HOẠT EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TẠO BẢNG PROFILES (Liên kết với Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
    role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    grade_level INT CHECK (grade_level BETWEEN 1 AND 5) DEFAULT 4,
    total_xp INT DEFAULT 0,
    streak_days INT DEFAULT 1,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MA TRẬN SÁCH GIÁO KHOA (Curriculum Schema)
CREATE TABLE IF NOT EXISTS public.subjects (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL, -- 'MATH', 'VIETNAMESE', 'ENGLISH', 'SCIENCE'
    name TEXT NOT NULL,
    icon_name TEXT,
    color_theme TEXT DEFAULT 'blue',
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.chapters (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES public.subjects(id) ON DELETE CASCADE,
    grade_level INT CHECK (grade_level BETWEEN 1 AND 5) DEFAULT 4,
    publisher_name TEXT DEFAULT 'Kết nối tri thức với cuộc sống',
    title TEXT NOT NULL,
    order_index INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id SERIAL PRIMARY KEY,
    chapter_id INT REFERENCES public.chapters(id) ON DELETE CASCADE,
    lesson_number INT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    order_index INT DEFAULT 1
);

-- 4. TRÒ CHƠI & CƠ CHẾ GAME
CREATE TABLE IF NOT EXISTS public.game_types (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL, -- 'SPEED_RACE', 'BALANCE_SCALE', 'PIZZA_FRACTION'
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.games (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES public.lessons(id) ON DELETE CASCADE,
    game_type_id INT REFERENCES public.game_types(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT DEFAULT 'MEDIUM',
    max_score INT DEFAULT 100,
    time_limit_seconds INT DEFAULT 180
);

-- 5. NGÂN HÀNG CÂU HỎI & ĐÁP ÁN (Question Bank)
CREATE TABLE IF NOT EXISTS public.questions (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES public.lessons(id) ON DELETE CASCADE,
    game_id INT REFERENCES public.games(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    question_type TEXT DEFAULT 'MULTIPLE_CHOICE'
);

CREATE TABLE IF NOT EXISTS public.question_options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    explanation TEXT
);

-- 6. PHIÊN CHƠI & TIẾN TRÌNH HỌC TẬP (Sessions & Badges)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id INT REFERENCES public.games(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_badges (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_code TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    description TEXT,
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. SUPABASE AUTOMATIC USER PROFILE CREATION TRIGGER
-- Tự động tạo record trong bảng profiles khi có tài khoản mới đăng ký qua Auth
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role, grade_level, total_xp, streak_days)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', 'Học sinh mới'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    'student',
    4,
    0,
    1
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================================================
-- 8. BẢO MẬT BẢNG ROW LEVEL SECURITY (RLS POLICIES)
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- Đọc dữ liệu công khai (Read-only for public)
CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public read game_types" ON public.game_types FOR SELECT USING (true);
CREATE POLICY "Public read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public read question_options" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON public.student_badges FOR SELECT USING (true);
CREATE POLICY "Public read game_sessions" ON public.game_sessions FOR SELECT USING (true);

-- Cho phép người dùng ghi dữ liệu bản thân
CREATE POLICY "User insert game_sessions" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "User update profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================================================
-- 9. DỮ LIỆU MẪU SÁCH GIÁO KHOA (SEED DATA FOR SUPABASE)
-- =============================================================================
INSERT INTO public.subjects (id, code, name, icon_name, color_theme, description) VALUES
(1, 'MATH', 'Toán Học', 'Calculator', 'blue', 'Số học, Phép tính, Phân số, Hình học và Đo lường SGK'),
(2, 'VIETNAMESE', 'Tiếng Việt', 'BookOpen', 'red', 'Tập đọc, Luyện từ và câu, Chính tả, Tập làm văn SGK'),
(3, 'ENGLISH', 'Tiếng Anh', 'Languages', 'amber', 'Vocabulary, Grammar, Phonics & Communication SGK'),
(4, 'SCIENCE', 'Tự Nhiên & Xã Hội', 'Compass', 'emerald', 'Khám phá tự nhiên, Khoa học, Lịch sử và Địa lý SGK')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chapters (id, subject_id, grade_level, publisher_name, title, order_index) VALUES
(101, 1, 4, 'Kết nối tri thức với cuộc sống', 'Chủ đề 1: Ôn tập và bổ sung số tự nhiên & Phép tính', 1),
(102, 1, 4, 'Kết nối tri thức với cuộc sống', 'Chủ đề 2: Phân số & Phép tính với Phân số', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (id, chapter_id, lesson_number, title, summary, order_index) VALUES
(1001, 101, 1, 'Bài 1: Ôn tập các số tự nhiên đến 100.000', 'Đọc, viết, so sánh số tự nhiên, xác định hàng và lớp', 1),
(1002, 101, 2, 'Bài 2: Ôn tập các phép tính với số tự nhiên (Cộng, Trừ, Nhân, Chia)', 'Thực hiện phép tính nhẩm, đặt tính rồi tính', 2),
(1003, 102, 3, 'Bài 3: Ôn tập phân số và tính chất cơ bản của phân số', 'Khái niệm phân số, đọc viết tử số/mẫu số, phân số bằng nhau', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.game_types (id, code, name, description) VALUES
(1, 'SPEED_RACE', 'Săn Kho Báu Số Tự Nhiên', 'Chạy đua vượt chướng ngại vật tìm giá trị số'),
(2, 'BALANCE_SCALE', 'Cân Thăng Bằng Phép Tính', 'Kéo thả phép tính giữ đòn cân thăng bằng'),
(3, 'PIZZA_FRACTION', 'Bánh Pizza Phân Số', 'Cắt bánh Pizza ghép phân số tương ứng')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.games (id, lesson_id, game_type_id, title, description, difficulty, max_score, time_limit_seconds) VALUES
(2001, 1001, 1, 'Trò 1 - Săn Kho Báu Số Tự Nhiên', 'Chạy đua nhận diện hàng chục nghìn, so sánh số tự nhiên đến 100.000', 'MEDIUM', 100, 180),
(2002, 1002, 2, 'Trò 2 - Cân Thăng Bằng Phép Tính', 'Kéo thả biểu thức toán học (+ - * /) giữ đòn cân cân bằng', 'MEDIUM', 100, 180),
(2003, 1003, 3, 'Trò 3 - Bánh Pizza Phân Số Kỳ Diệu', 'Cắt bánh Pizza & Ghép thẻ phân số tương ứng trực quan', 'EASY', 100, 180)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.questions (id, lesson_id, game_id, content) VALUES
(3001, 1001, 2001, 'Trong số 85.421, chữ số 8 thuộc hàng nào?'),
(3002, 1001, 2001, 'Số gồm 5 chục nghìn, 3 trăm, 2 đơn vị viết là gì?'),
(3101, 1002, 2002, 'Tìm x sao cho đòn cân thăng bằng: x + 1.200 = 3.500'),
(3201, 1003, 2003, 'Bánh Pizza chia 8 miếng bằng nhau. Nam ăn 3 miếng. Phân số chỉ số miếng bánh Nam đã ăn là:')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_options (question_id, option_text, is_correct, explanation) VALUES
(3001, 'Hàng chục nghìn', TRUE, 'Số 8 đứng ở vị trí hàng chục nghìn'),
(3001, 'Hàng nghìn', FALSE, 'Sai rồi, số 5 mới là hàng nghìn'),
(3001, 'Hàng trăm', FALSE, 'Sai rồi, số 4 mới là hàng trăm'),

(3002, '50.302', TRUE, '5 chục nghìn = 50.000, 3 trăm = 300, 2 đơn vị = 2 => 50.302'),
(3002, '53.200', FALSE, 'Đây là 53 nghìn 2 trăm'),

(3101, 'x = 2.300', TRUE, 'x = 3.500 - 1.200 = 2.300'),
(3101, 'x = 4.700', FALSE, 'Chịu khó kiểm tra phép trừ'),

(3201, '3/8', TRUE, 'Tử số 3, Mẫu số 8 => 3/8'),
(3201, '8/3', FALSE, 'Nhầm tử số mẫu số rồi')
ON CONFLICT DO NOTHING;
