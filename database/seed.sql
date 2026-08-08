-- =============================================================================
-- EDUGAME PRIMARY - SEED DATA FOR SGK LESSONS & GAMES
-- Dữ liệu mẫu bài học Sách Giáo Khoa Tiểu Học & Ngân Hàng Câu Hỏi Trò Chơi
-- =============================================================================

-- 1. NGUỜI DÙNG MẪU (Demo Users)
INSERT INTO users (id, username, password_hash, full_name, avatar_url, role_id, grade_level, total_xp, streak_days) VALUES
('u_admin', 'admin', 'admin123', 'Thầy Nguyễn Văn Được', 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherDuoc', 1, 4, 1500, 15),
('u_student1', 'hieu_lop4', '123456', 'Nguyễn Trung Hiếu', 'https://api.dicebear.com/7.x/bottts/svg?seed=Hieu123', 3, 4, 850, 7),
('u_student2', 'lan_lop4', '123456', 'Trần Thị Mai Lan', 'https://api.dicebear.com/7.x/bottts/svg?seed=Lan456', 3, 4, 1120, 12),
('u_student3', 'minh_lop4', '123456', 'Phạm Quang Minh', 'https://api.dicebear.com/7.x/bottts/svg?seed=Minh789', 3, 4, 640, 4);

-- 2. CHƯƠNG BÀI HỌC SGK TOÁN LỚP 4 (Bộ Kết Nối Tri Thức)
INSERT INTO chapters (id, subject_id, grade_level_id, publisher_id, title, order_index, summary) VALUES
(101, 1, 4, 1, 'Chủ đề 1: Ôn tập và bổ sung số tự nhiên & Phép tính', 1, 'Ôn tập số có nhiều chữ số, phép cộng, trừ, nhân, chia số tự nhiên'),
(102, 1, 4, 1, 'Chủ đề 2: Phân số & Phép tính với Phân số', 2, 'Khái niệm phân số, phân số bằng nhau, rút gọn, quy đồng và 4 phép tính phân số'),
(103, 1, 4, 1, 'Chủ đề 3: Hình học & Đo lường (Góc, Hai đường thẳng, Diện tích)', 3, 'Góc nhọn, góc tù, góc bẹt, hai đường thẳng vuông góc, song song, m², km²');

-- 3. CÁC BÀI HỌC CỤ THỂ CHUẨN SGK (Lessons)
INSERT INTO lessons (id, chapter_id, lesson_number, title, summary, order_index) VALUES
(1001, 101, 1, 'Bài 1: Ôn tập các số tự nhiên đến 100.000', 'Đọc, viết, so sánh số tự nhiên, hàng và lớp', 1),
(1002, 101, 2, 'Bài 2: Ôn tập các phép tính với số tự nhiên (Cộng, Trừ, Nhân, Chia)', 'Thực hiện phép tính nhẩm, đặt tính rồi tính, tính giá trị biểu thức', 2),
(1003, 102, 3, 'Bài 3: Ôn tập phân số và tính chất cơ bản của phân số', 'Khái niệm phân số, đọc viết phân số, phân số bằng nhau và tử số/mẫu số', 3),
(1004, 102, 4, 'Bài 4: Phép cộng và phép trừ phân số', 'Cộng trừ phân số cùng mẫu số và khác mẫu số', 4);

-- 4. TRÒ CHƠI CHO TỪNG BÀI HỌC (Games)
INSERT INTO games (id, lesson_id, game_type_id, title, description, difficulty, max_score, time_limit_seconds, order_in_lesson) VALUES
(2001, 1001, 1, 'Trò 1 - Săn Kho Báu Số Tự Nhiên', 'Chạy đua vượt ngại vật, tìm hàng chục nghìn, so sánh số tự nhiên đến 100.000', 'MEDIUM', 100, 180, 1),
(2002, 1002, 2, 'Trò 2 - Cân Thăng Bằng Phép Tính', 'Kảo thả các biểu thức và số thích hợp để thăng bằng đòn cân', 'MEDIUM', 100, 180, 2),
(2003, 1003, 3, 'Trò 3 - Bánh Pizza Phân Số Kỳ Diệu', 'Thử thách chia bánh Pizza & Ghép thẻ phân số tương ứng trực quan', 'EASY', 100, 180, 3);

-- 5. CÂU HỎI & ĐÁP ÁN CHO TRÒ 1: SĂN KHO BÁU SỐ TỰ NHIÊN
INSERT INTO questions (id, lesson_id, game_id, content, question_type) VALUES
(3001, 1001, 2001, 'Trong số 85.421, chữ số 8 thuộc hàng nào?', 'MULTIPLE_CHOICE'),
(3002, 1001, 2001, 'Số gồm 5 chục nghìn, 3 trăm, 2 đơn vị viết là gì?', 'MULTIPLE_CHOICE'),
(3003, 1001, 2001, 'So sánh hai số tự nhiên: 98.765 ... 98.756', 'MULTIPLE_CHOICE'),
(3004, 1001, 2001, 'Số liền sau của số 49.999 là số nào?', 'MULTIPLE_CHOICE');

INSERT INTO question_options (question_id, option_text, is_correct, explanation) VALUES
(3001, 'Hàng chục nghìn', TRUE, 'Chữ số 8 đứng ở vị trí hàng chục nghìn (lớp nghìn)'),
(3001, 'Hàng nghìn', FALSE, 'Sai rồi, số 5 mới là hàng nghìn'),
(3001, 'Hàng trăm', FALSE, 'Sai rồi, số 4 mới là hàng trăm'),
(3001, 'Hàng chục', FALSE, 'Sai rồi, số 2 mới là hàng chục'),

(3002, '50.302', TRUE, '5 chục nghìn = 50.000, 3 trăm = 300, 2 đơn vị = 2 => 50.302'),
(3002, '53.200', FALSE, 'Đây là 53 nghìn 2 trăm'),
(3002, '50.320', FALSE, 'Đây là 5 chục nghìn 3 trăm 2 chục'),
(3002, '5.302', FALSE, 'Thiếu hàng nghìn'),

(3003, '>', TRUE, 'Hàng chục nghìn, nghìn, trăm giống nhau (98.7..). Hàng chục 6 > 5 nên 98.765 > 98.756'),
(3003, '<', FALSE, 'Sai rồi, 6 chục lớn hơn 5 chục'),
(3003, '=', FALSE, 'Sai rồi, hai số có hàng chục khác nhau'),

(3004, '50.000', TRUE, 'Số liền sau bằng số đó cộng thêm 1: 49.999 + 1 = 50.000'),
(3004, '49.998', FALSE, 'Đây là số liền trước'),
(3004, '49.900', FALSE, 'Sai phép tính'),
(3004, '59.999', FALSE, 'Sai phép tính');

-- 6. CÂU HỎI & ĐÁP ÁN CHO TRÒ 2: CÂN THĂNG BẰNG PHÉP TÍNH
INSERT INTO questions (id, lesson_id, game_id, content, question_type) VALUES
(3101, 1002, 2002, 'Tìm x sao cho đòn cân thăng bằng: x + 1.200 = 3.500', 'MULTIPLE_CHOICE'),
(3102, 1002, 2002, 'Tính nhẩm nhanh: 2.500 x 4 = ?', 'MULTIPLE_CHOICE'),
(3103, 1002, 2002, 'Biểu thức nào có giá trị lớn nhất?', 'MULTIPLE_CHOICE'),
(3104, 1002, 2002, 'Tìm số bị chia x: x : 5 = 1.400', 'MULTIPLE_CHOICE');

INSERT INTO question_options (question_id, option_text, is_correct, explanation) VALUES
(3101, 'x = 2.300', TRUE, 'x = 3.500 - 1.200 = 2.300'),
(3101, 'x = 4.700', FALSE, 'Chịu khó kiểm tra lại phép trừ nha!'),
(3101, 'x = 2.500', FALSE, 'Sai kết quả rồi!'),
(3101, 'x = 1.300', FALSE, 'Sai kết quả rồi!'),

(3102, '10.000', TRUE, '2.500 x 4 = 10.000 (25 x 4 = 100 thêm 2 số 0)'),
(3102, '1.000', FALSE, 'Thiếu 1 số 0 rồi'),
(3102, '100.000', FALSE, 'Thừa số 0 rồi'),
(3102, '8.000', FALSE, 'Tính nhẩm chưa đúng'),

(3103, '40.000 - 15.000', TRUE, '40.000 - 15.000 = 25.000 (Lớn nhất trong các lựa chọn)'),
(3103, '5.000 x 4', FALSE, '5.000 x 4 = 20.000'),
(3103, '18.000 + 4.000', FALSE, '18.000 + 4.000 = 22.000'),
(3103, '80.000 : 4', FALSE, '80.000 : 4 = 20.000'),

(3104, 'x = 7.000', TRUE, 'Số bị chia = Thương x Số chia => 1.400 x 5 = 7.000'),
(3104, 'x = 280', FALSE, 'Đây là phép chia 1.400 : 5'),
(3104, 'x = 6.000', FALSE, 'Sai kết quả nhẩm'),
(3104, 'x = 70.000', FALSE, 'Nhân dư số 0');

-- 7. CÂU HỎI & ĐÁP ÁN CHO TRÒ 3: BÁNH PIZZA PHÂN SỐ
INSERT INTO questions (id, lesson_id, game_id, content, question_type) VALUES
(3201, 1003, 2003, 'Một chiếc bánh Pizza được chia làm 8 miếng bằng nhau. Nam ăn 3 miếng. Phân số chỉ số miếng bánh Nam đã ăn là:', 'MULTIPLE_CHOICE'),
(3202, 1003, 2003, 'Trong phân số 5/9, tử số và mẫu số lần lượt là:', 'MULTIPLE_CHOICE'),
(3203, 1003, 2003, 'Phân số nào sau đây bằng phân số 1/2?', 'MULTIPLE_CHOICE'),
(3204, 1003, 2003, 'Rút gọn phân số 6/18 về phân số tối giản:', 'MULTIPLE_CHOICE');

INSERT INTO question_options (question_id, option_text, is_correct, explanation) VALUES
(3201, '3/8', TRUE, 'Tử số là số miếng đã ăn (3), Mẫu số là tổng số miếng (8) => 3/8'),
(3201, '8/3', FALSE, 'Mẫu số mới là tổng số miếng bánh'),
(3201, '5/8', FALSE, 'Đây là phân số chỉ số miếng bánh còn lại'),
(3201, '3/5', FALSE, 'Sai mẫu số'),

(3202, 'Tử số là 5, mẫu số là 9', TRUE, 'Số viết trên gạch ngang là tử số (5), số viết dưới gạch ngang là mẫu số (9)'),
(3202, 'Tử số là 9, mẫu số là 5', FALSE, 'Nhầm lẫn giữa tử số và mẫu số rồi!'),
(3202, 'Cả hai đều là 5', FALSE, 'Sai rồi!'),
(3202, 'Tử số là 14, mẫu số là 5', FALSE, 'Sai rồi!'),

(3203, '4/8', TRUE, 'Chia cả tử số và mẫu số của 4/8 cho 4 ta được 1/2'),
(3203, '2/5', FALSE, '2/5 không bằng 1/2'),
(3203, '3/9', FALSE, '3/9 = 1/3'),
(3203, '4/6', FALSE, '4/6 = 2/3'),

(3204, '1/3', TRUE, 'Chia cả tử và mẫu cho 6: 6:6=1 và 18:6=3 => 1/3'),
(3204, '2/6', FALSE, 'Chưa phải phân số tối giản'),
(3204, '3/9', FALSE, 'Chưa phải phân số tối giản'),
(3204, '1/2', FALSE, 'Rút gọn chưa đúng');

-- 8. HUY HIỆU BẢNG VÀNG (Badges Seed Data)
INSERT INTO student_badges (user_id, badge_code, badge_name, badge_icon, description) VALUES
('u_student2', 'MATH_GENIUS', 'Thần Đồng Toán Học SGK', '🏆', 'Đạt 100 điểm tuyệt đối trong 5 trò chơi Toán học'),
('u_student2', 'STREAK_7', 'Chiến Sĩ Chăm Chỉ (7 Ngày)', '🔥', 'Duy trì chuỗi đăng nhập và học tập liên tục 7 ngày'),
('u_student1', 'FRACTION_MASTER', 'Vua Bánh Pizza Phân Số', '🍕', 'Hoàn thành trò chơi phân số xuất sắc không sai câu nào');
