/**
 * Google Sheets lead helpers
 *
 * Tổng hợp + định dạng lead từ chatbot trước khi ghi vào Google Sheets.
 * Tách riêng để dễ test và để route.ts chỉ lo HTTP plumbing.
 */

export interface LeadPayload {
  name: string
  phone: string
  email: string
  childAge: string
  program: string
  campus: string
  topicsInterested: string[]
  conversationSummary: string
  conversationCount: number
  locale: string
  source: string
}

/**
 * Thứ tự cột trong Google Sheet – giữ stable vì nó phải khớp với
 * header row đã ghi ra sheet.
 */
/**
 * Thứ tự cột trong Google Sheet – giữ stable vì nó phải khớp với
 * header row đã ghi ra sheet.
 *
 * Lưu ý: KHÔNG dùng `as const` ở đây vì googleapis yêu cầu mutable `any[]`.
 * Nếu thêm/sửa cột nhớ cập nhật cả 2 chỗ: `columns` và `buildLeadRow`.
 */
export const LeadRow = {
  columns: [
    'Timestamp',
    'Họ tên',
    'Số điện thoại',
    'Email',
    'Độ tuổi của con',
    'Chương trình quan tâm',
    'Cơ sở',
    'Chủ đề đã hỏi',
    'Số câu đã hỏi',
    'Tóm tắt hội thoại',
    'Ngôn ngữ',
    'Nguồn',
    'Trạng thái',
  ] as string[],
}

export function buildLeadRow(payload: LeadPayload): string[] {
  const timestamp = new Date().toISOString()

  return [
    timestamp,
    payload.name.trim(),
    payload.phone.trim(),
    payload.email.trim(),
    payload.childAge.trim(),
    payload.program.trim(),
    payload.campus.trim(),
    payload.topicsInterested.join(', '),
    String(payload.conversationCount),
    payload.conversationSummary.trim(),
    payload.locale,
    payload.source,
    'Mới',
  ]
}

/**
 * Trích gọn các câu user đã hỏi trong hội thoại thành 1 chuỗi ngắn
 * gọn để team tư vấn nắm nhanh nhu cầu trước khi gọi lại.
 */
export function summarizeConversation(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): { summary: string; userQuestionCount: number } {
  const userMessages = messages.filter((m) => m.role === 'user')

  // Lấy tối đa 8 câu gần nhất, mỗi câu cắt còn ~120 ký tự để summary
  // đọc nhanh trong Google Sheet.
  const recent = userMessages.slice(-8).map((m) => {
    const trimmed = m.content.trim().replace(/\s+/g, ' ')
    return trimmed.length > 120 ? trimmed.slice(0, 117) + '...' : trimmed
  })

  return {
    summary: recent.join(' | '),
    userQuestionCount: userMessages.length,
  }
}

/**
 * Heuristic nhẹ để extract chủ đề dựa trên các keyword có trong
 * câu hỏi của user. Mục tiêu không cần chính xác tuyệt đối – chỉ
 * cần đủ thông tin để team sales lọc lead theo nhu cầu.
 */
export function extractTopics(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): string[] {
  const text = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content.toLowerCase())
    .join(' ')

  const topicKeywords: Record<string, string[]> = {
    'Giới thiệu EPath': ['epath là gì', 'giới thiệu', 'epath'],
    'Học phí': ['học phí', 'chi phí', 'giá', 'phí', 'ưu đãi', 'tăng phí', 'hoàn phí'],
    'Độ tuổi & Lộ trình': ['độ tuổi', 'tuổi', 'mầm non', 'tiểu học', 'trung học', 'lộ trình', 'khai giảng', 'lịch học'],
    'Homeschool / Semi-Homeschool': ['homeschool', 'semi', 'song bằng', 'dual diploma'],
    'Chất lượng & Giáo viên': ['giáo viên', 'gv ', 'tutor', 'sĩ số', 'chất lượng', 'bằng cấp'],
    'Chứng chỉ quốc tế (SAT/ACT/IELTS/AP)': ['sat', 'act', 'ielts', 'toefl', 'ap '],
    'Cơ sở vật chất / Địa điểm': ['cơ sở', 'địa điểm', 'học ở đâu', 'ở đâu', 'trường'],
    'Đăng ký nhập học': ['đăng ký', 'nhập học', 'tuyển sinh', 'đầu vào', 'kiểm tra'],
  }

  const matched: string[] = []
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      matched.push(topic)
    }
  }
  return matched
}
