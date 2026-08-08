-- =============================================================================
-- EDUGAME PRIMARY (HỆ THỐNG WEB GAME HỌC TẬP TIỂU HỌC THEO CHƯƠNG TRÌNH SGK)
-- Database DDL Schema (PostgreSQL / MySQL Compatible)
-- Author: Antigravity AI Engine
-- =============================================================================

-- 1. XÓA BẢNG NẾU TỒN TẠI (Cleanup old tables)
DROP TABLE IF EXISTS session_details CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS student_badges CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_types CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS sgk_publishers CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS grade_levels CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 2. VAI TRÒ VÀ NGƯỜI DÙNG (Roles & Users)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'admin', 'teacher', 'student'
    description TEXT
);

INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Quản trị viên hệ thống'),
(2, 'teacher', 'Giáo viên chủ nhiệm / Bộ môn'),
(3, 'student', 'Học sinh tiểu học');

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY, -- User ID (UUID hoặc String)
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
    role_id INT REFERENCES roles(id) ON DELETE RESTRICT,
    grade_level INT CHECK (grade_level BETWEEN 1 AND 5) DEFAULT 4, -- Lớp 1-5
    total_xp INT DEFAULT 0,
    streak_days INT DEFAULT 1,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. MA TRẬN CHƯƠNG TRÌNH SÁCH GIÁO KHOA (Curriculum & SGK Structure)
CREATE TABLE grade_levels (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- Lớp 1, Lớp 2, Lớp 3, Lớp 4, Lớp 5
    description TEXT
);

INSERT INTO grade_levels (id, name, description) VALUES
(1, 'Lớp 1', 'Chương trình Tiểu học Khối 1'),
(2, 'Lớp 2', 'Chương trình Tiểu học Khối 2'),
(3, 'Lớp 3', 'Chương trình Tiểu học Khối 3'),
(4, 'Lớp 4', 'Chương trình Tiểu học Khối 4'),
(5, 'Lớp 5', 'Chương trình Tiểu học Khối 5');

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- 'MATH', 'VIETNAMESE', 'ENGLISH', 'SCIENCE'
    name VARCHAR(100) NOT NULL,       -- Toán, Tiếng Việt, Tiếng Anh, Tự nhiên & Xã hội
    icon_name VARCHAR(50),            -- Icon identifier
    color_theme VARCHAR(50) DEFAULT 'blue', -- Theme nhận diện màu sắc
    description TEXT
);

INSERT INTO subjects (id, code, name, icon_name, color_theme, description) VALUES
(1, 'MATH', 'Toán Học', 'Calculator', 'blue', 'Số học, Phép tính, Phân số, Hình học và Đo lường'),
(2, 'VIETNAMESE', 'Tiếng Việt', 'BookOpen', 'red', 'Tập đọc, Luyện từ và câu, Chính tả, Tập làm văn'),
(3, 'ENGLISH', 'Tiếng Anh', 'Languages', 'orange', 'Vocabulary, Grammar, Phonics & Communication'),
(4, 'SCIENCE', 'Tự Nhiên & Xã Hội', 'Compass', 'emerald', 'Khám phá tự nhiên, Khoa học, Lịch sử và Địa lý');

CREATE TABLE sgk_publishers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- 'KNTT', 'CD', 'CTST'
    name VARCHAR(100) NOT NULL,       -- Kết nối tri thức với cuộc sống, Cánh diều, Chân trời sáng tạo
    description TEXT
);

INSERT INTO sgk_publishers (id, code, name, description) VALUES
(1, 'KNTT', 'Kết nối tri thức với cuộc sống', 'Bộ sách Kết nối tri thức NXB Giáo dục'),
(2, 'CD', 'Cánh diều', 'Bộ sách Cánh diều NXB ĐH Sư phạm'),
(3, 'CTST', 'Chân trời sáng tạo', 'Bộ sách Chân trời sáng tạo NXB Giáo dục');

CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    grade_level_id INT REFERENCES grade_levels(id) ON DELETE CASCADE,
    publisher_id INT REFERENCES sgk_publishers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL, -- Chủ đề 1: Ôn tập và bổ sung
    order_index INT NOT NULL DEFAULT 1,
    summary TEXT
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
    lesson_number INT NOT NULL,  -- Bài 1, Bài 2...
    title VARCHAR(255) NOT NULL, -- Bài 1: Ôn tập các số tự nhiên đến 100.000
    summary TEXT,
    order_index INT NOT NULL DEFAULT 1
);

-- 4. TRÒ CHƠI & CƠ CHẾ GAME (Games & Mechanics)
CREATE TABLE game_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- 'SPEED_RACE', 'BALANCE_SCALE', 'PIZZA_FRACTION', 'WORD_MATCH'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    mechanic_json TEXT                -- Cấu hình mặc định của dạng game
);

INSERT INTO game_types (id, code, name, description) VALUES
(1, 'SPEED_RACE', 'Săn Kho Báu Số Tự Nhiên', 'Chạy xe / Bắn bóng tìm giá trị số tự nhiên đúng'),
(2, 'BALANCE_SCALE', 'Cân Thăng Bằng Phép Tính', 'Kéo thả các phép tính để giữ cân cân bằng đúng'),
(3, 'PIZZA_FRACTION', 'Bánh Pizza Phân Số', 'Cắt bánh & Ghép thẻ phân số tương ứng trực quan'),
(4, 'WORD_MATCH', 'Vua Tiếng Việt & Từ Vựng', 'Ghép chữ & Chọn câu đúng ngữ pháp');

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    game_type_id INT REFERENCES game_types(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,      -- Ví dụ: "Trò 1 - Ôn tập số tự nhiên"
    description TEXT,
    thumbnail_url VARCHAR(255),
    difficulty VARCHAR(20) DEFAULT 'MEDIUM', -- 'EASY', 'MEDIUM', 'HARD'
    max_score INT DEFAULT 100,
    time_limit_seconds INT DEFAULT 180,
    order_in_lesson INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. NGÂN HÀNG CÂU HỎI (Question Bank & Options)
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE SET NULL,
    content TEXT NOT NULL,           -- Lệnh câu hỏi (VD: "Số 54.321 gồm mấy chục nghìn?")
    image_url VARCHAR(255),
    audio_url VARCHAR(255),
    question_type VARCHAR(30) DEFAULT 'MULTIPLE_CHOICE' -- 'MULTIPLE_CHOICE', 'DRAG_DROP', 'FILL_BLANK'
);

CREATE TABLE question_options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_image_url VARCHAR(255),
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    explanation TEXT
);

-- 6. TIẾN TRÌNH HỌC TẬP & PHIÊN CHƠI (Progress & Leaderboard)
CREATE TABLE game_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'COMPLETED', -- 'IN_PROGRESS', 'COMPLETED', 'ABANDONED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_details (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) REFERENCES game_sessions(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id INT REFERENCES question_options(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_seconds INT DEFAULT 0
);

CREATE TABLE student_badges (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    badge_code VARCHAR(50) NOT NULL,  -- 'MATH_GENIUS', 'STREAK_7', 'FRACTION_MASTER'
    badge_name VARCHAR(100) NOT NULL,
    badge_icon VARCHAR(255),
    description TEXT,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES TỐI ƯU TRUY VẤN
CREATE INDEX idx_chapters_subject_grade ON chapters(subject_id, grade_level_id);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_games_lesson ON games(lesson_id);
CREATE INDEX idx_questions_lesson ON questions(lesson_id);
CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_users_xp ON users(total_xp DESC);
