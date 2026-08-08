-- =============================================================================
-- EDUGAME PRIMARY - SUPABASE DATABASE INITIALIZATION SCRIPT (EMAIL-BASED AUTH)
-- Safe to re-run in Supabase SQL Editor
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG PROFILES (Đồng bộ với Supabase Auth bằng Email đăng nhập)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
    role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    grade_level INT CHECK (grade_level BETWEEN 1 AND 5) DEFAULT 4,
    total_xp INT DEFAULT 0,
    streak_days INT DEFAULT 1,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ EMAIL + MẬT KHẨU
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    input_email TEXT;
    input_fullname TEXT;
    input_grade INT;
    user_role TEXT;
BEGIN
    input_email := new.email;
    input_fullname := COALESCE(new.raw_user_meta_data->>'full_name', 'Học sinh mới');
    input_grade := COALESCE((new.raw_user_meta_data->>'grade_level')::INT, 4);

    -- PHÂN QUYỀN ĐẶC BIỆT: Chỉ nguyenthanhduocathy@gmail.com mới là admin
    IF input_email = 'nguyenthanhduocathy@gmail.com' THEN
        user_role := 'admin';
    ELSE
        user_role := 'student';
    END IF;

    INSERT INTO public.profiles (id, email, full_name, avatar_url, role, grade_level, total_xp, streak_days)
    VALUES (
        new.id,
        input_email,
        input_fullname,
        'https://api.dicebear.com/7.x/bottts/svg?seed=' || input_email,
        user_role,
        input_grade,
        0,
        1
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        grade_level = EXCLUDED.grade_level;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. BẢO MẬT RLS CHO PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "User update own profile" ON public.profiles;
DROP POLICY IF EXISTS "User insert own profile" ON public.profiles;

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "User insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);
