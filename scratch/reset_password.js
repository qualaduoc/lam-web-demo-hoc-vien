import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('placeholder')) {
  console.error("Lỗi: Không tìm thấy Supabase URL hoặc Service Role Key hợp lệ trong .env.local!");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function resetPassword() {
  const targetEmail = 'nguyenthanhduocathy@gmail.com';
  const newPassword = '123456';

  console.log(`Đang tìm tài khoản: ${targetEmail}...`);

  // 1. Lấy danh sách users từ Supabase Auth
  const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error("Lỗi liệt kê tài khoản từ Supabase Auth:", listError.message);
    process.exit(1);
  }

  // Tìm theo email hoặc username trong metadata
  const user = authUsers.users.find(u => 
    u.email === targetEmail || 
    u.user_metadata?.username === targetEmail
  );

  if (!user) {
    console.error(`Lỗi: Không tìm thấy tài khoản "${targetEmail}" trên Supabase Auth!`);
    process.exit(1);
  }

  console.log(`Đã tìm thấy User ID: ${user.id}. Tiến hành đặt mật khẩu thành: ${newPassword}...`);

  // 2. Cập nhật mật khẩu mới bằng ID
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error("Lỗi cập nhật mật khẩu mới:", updateError.message);
    process.exit(1);
  }

  console.log(`Chúc mừng! Đặt lại mật khẩu thành công cho tài khoản "${targetEmail}" thành "123456"!`);
}

resetPassword();
