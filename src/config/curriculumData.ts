import type { Subject, Chapter, User, LeaderboardUser } from '../types/gameTypes';

export const CURRENT_USER: User = {
  id: 'u_student1',
  email: 'hieu_lop4@edugame.local',
  fullName: 'Nguyễn Trung Hiếu',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hieu123',
  role: 'student',
  gradeLevel: 4,
  totalXp: 850,
  streakDays: 7
};

export const SUBJECTS: Subject[] = [
  { id: 1, code: 'MATH', name: 'Toán Học', icon: 'Calculator', colorTheme: 'blue', description: 'Ôn tập số tự nhiên, phép tính, phân số và hình học SGK' },
  { id: 2, code: 'VIETNAMESE', name: 'Tiếng Việt', icon: 'BookOpen', colorTheme: 'red', description: 'Luyện từ và câu, chính tả, tập đọc và từ vựng SGK' },
  { id: 3, code: 'ENGLISH', name: 'Tiếng Anh', icon: 'Languages', colorTheme: 'amber', description: 'Primary English vocabulary, phonics and grammar' },
  { id: 4, code: 'SCIENCE', name: 'Tự Nhiên & Xã Hội', icon: 'Compass', colorTheme: 'emerald', description: 'Khám phá thiên nhiên, động thực vật, lịch sử & địa lý' }
];

export const MATH_GRADE4_CHAPTERS: Chapter[] = [
  {
    id: 101,
    subjectId: 1,
    gradeLevel: 4,
    publisher: 'Kết nối tri thức với cuộc sống',
    title: 'Chủ đề 1: Ôn tập và bổ sung số tự nhiên & Các phép tính',
    lessons: [
      {
        id: 1001,
        chapterId: 101,
        lessonNumber: 1,
        title: 'Bài 1: Ôn tập các số tự nhiên đến 100.000',
        summary: 'Đọc, viết, so sánh số tự nhiên, xác định hàng và lớp',
        games: [
          {
            id: 2001,
            lessonId: 1001,
            typeCode: 'SPEED_RACE',
            title: 'Trò 1 - Ôn tập số tự nhiên (Săn Kho Báu Số)',
            description: 'Chạy đua nhận diện hàng chục nghìn, so sánh các số tự nhiên đến 100.000',
            difficulty: 'MEDIUM',
            maxScore: 100,
            timeLimit: 180
          }
        ]
      },
      {
        id: 1002,
        chapterId: 101,
        lessonNumber: 2,
        title: 'Bài 2: Ôn tập các phép tính với số tự nhiên (Cộng, Trừ, Nhân, Chia)',
        summary: 'Thực hiện phép tính nhẩm, đặt tính rồi tính, tìm x biểu thức',
        games: [
          {
            id: 2002,
            lessonId: 1002,
            typeCode: 'BALANCE_SCALE',
            title: 'Trò 2 - Ôn tập các phép tính (Cân Thăng Bằng Kỳ Diệu)',
            description: 'Kéo thả các biểu thức toán học (+ - * /) để giữ đòn cân cân bằng',
            difficulty: 'MEDIUM',
            maxScore: 100,
            timeLimit: 180
          }
        ]
      }
    ]
  },
  {
    id: 102,
    subjectId: 1,
    gradeLevel: 4,
    publisher: 'Kết nối tri thức với cuộc sống',
    title: 'Chủ đề 2: Phân số & Phép tính với Phân số',
    lessons: [
      {
        id: 1003,
        chapterId: 102,
        lessonNumber: 3,
        title: 'Bài 3: Ôn tập phân số và tính chất cơ bản của phân số',
        summary: 'Khái niệm phân số, đọc viết tử số/mẫu số, phân số bằng nhau & rút gọn',
        games: [
          {
            id: 2003,
            lessonId: 1003,
            typeCode: 'PIZZA_FRACTION',
            title: 'Trò 3 - Ôn tập phân số (Bánh Pizza Phân Số)',
            description: 'Cắt bánh Pizza & Ghép thẻ phân số tương ứng trực quan',
            difficulty: 'EASY',
            maxScore: 100,
            timeLimit: 180
          }
        ]
      }
    ]
  }
];

export const LEADERBOARD_SEED: LeaderboardUser[] = [
  { rank: 1, id: 'u_student2', fullName: 'Trần Thị Mai Lan', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lan456', gradeLevel: 4, totalXp: 1120, streakDays: 12 },
  { rank: 2, id: 'u_student1', fullName: 'Nguyễn Trung Hiếu', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hieu123', gradeLevel: 4, totalXp: 850, streakDays: 7 },
  { rank: 3, id: 'u_student3', fullName: 'Phạm Quang Minh', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Minh789', gradeLevel: 4, totalXp: 640, streakDays: 4 },
  { rank: 4, id: 'u_student4', fullName: 'Lê Hoàng Yến', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Yen111', gradeLevel: 4, totalXp: 520, streakDays: 5 },
  { rank: 5, id: 'u_student5', fullName: 'Đỗ Đức Anh', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Anh222', gradeLevel: 4, totalXp: 480, streakDays: 3 }
];
