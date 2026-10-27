import type { PromoPopupInput } from './cms-types'

export const DEFAULT_PROMO_POPUP_DATA: PromoPopupInput = {
  isActive: true,
  delaySeconds: 15,
  cooldownHours: 12,
  imageUrl: '/images/admissions/admissions-consultation.jpg',
  tag: {
    vi: 'Tư Vấn Miễn Phí',
    en: 'Free Assessment',
  },
  tagDescription: {
    vi: 'Đánh giá năng lực chuẩn Cambridge & Lộ trình Tú tài Mỹ',
    en: 'Cambridge assessment & US High School Diploma pathways',
  },
  badge: {
    vi: 'Định Hướng Lộ Trình 2026',
    en: 'Academic Roadmap 2026',
  },
  title: {
    vi: 'Bạn đang tìm lộ trình học chuẩn Quốc tế tối ưu cho con?',
    en: 'Looking for the optimal International pathway for your child?',
  },
  description: {
    vi: 'Nhận ngay bài kiểm tra năng lực tiếng Anh chuẩn Cambridge, phân tích hồ sơ học thuật và dự toán học phí tiết kiệm đến 70% so với trường quốc tế truyền thống.',
    en: 'Get a complimentary Cambridge placement test, personalized academic evaluation, and save up to 70% compared to traditional international schools.',
  },
  benefits: {
    vi: [
      'Cố vấn chuyên môn 1 kèm 1 theo sát',
      'Bằng Tú tài Mỹ Cognia & WASC công nhận toàn cầu',
    ],
    en: [
      '1:1 dedicated Academic Advisor',
      'Cognia & WASC accredited US High School Diploma',
    ],
  },
  showChatbotButton: true,
  chatbotButtonText: {
    vi: 'Hỏi nhanh qua Trợ lý AI (24/7)',
    en: 'Chat with AI Academic Advisor',
  },
  ctaText: {
    vi: 'Đăng ký tư vấn 1 kèm 1 với Cố vấn',
    en: 'Book a 1:1 Consultation',
  },
  ctaLink: '/admissions#contact',
  dismissText: {
    vi: 'Để sau, tôi muốn tiếp tục xem',
    en: 'Maybe later, continue browsing',
  },
}
