/**
 * Centralized chatbot content — all UI strings, greeting messages,
 * form labels, and button text in both Vietnamese (vi) and English (en).
 *
 * Used by:
 *   - components/chatbot.tsx       (main chat interface)
 *   - components/chat-invite.tsx  (browsing invite card)
 *
 * The Q&A database stays in the chatbot itself since it contains
 * full-form Vietnamese answers that would blow up this file. The
 * chatbot picks locale-aware Q&A at runtime via `localeAwareQa()`.
 */

export type Locale = 'vi' | 'en'

// ---------------------------------------------------------------------------
// Core greeting — shown as the first assistant message when chat opens.
// ---------------------------------------------------------------------------
export const greeting = {
  vi: `Xin chào anh/chị! 👋 Em đến từ Bộ phận Học vụ tại EPath Education.

Em có thể hỗ trợ anh/chị tìm hiểu về:
• Giới thiệu EPath & các lộ trình học tập
• Độ tuổi & chương trình phù hợp cho con
• Lịch học, học phí & chính sách
• Đánh giá năng lực đầu vào & đăng ký tư vấn

Anh/chị muốn em hỗ trợ về vấn đề nào trước ạ? Cứ hỏi em bất cứ điều gì nhé! 😊`,

  en: `Hello! 👋 I'm from the Academic Department at EPath Education.

I can help you learn about:
• EPath introduction & learning pathways
• Age groups & suitable programs for your child
• Schedule, tuition & policies
• Entrance assessment & consultation registration

What would you like to know first? Feel free to ask me anything! 😊`,
} as const

// ---------------------------------------------------------------------------
// Pre-chat form labels & placeholders.
// ---------------------------------------------------------------------------
export const preChatForm = {
  vi: {
    title: 'Để lại thông tin, Bộ phận Học vụ sẽ tư vấn riêng cho anh/chị!',
    namePlaceholder: 'Họ và tên phụ huynh',
    phonePlaceholder: 'Số điện thoại (Zalo)',
    submitButton: 'Gửi thông tin',
    nameError: 'Vui lòng nhập họ tên ạ.',
    phoneError: 'Vui lòng nhập số điện thoại ạ.',
    phoneFormatError: 'Số điện thoại chưa đúng định dạng. Anh/chị kiểm tra lại giúp em nhé (VD: 0912 345 678).',
  },
  en: {
    title: 'Leave your contact and I\'ll give you personalized advice!',
    namePlaceholder: 'Parent\'s full name',
    phonePlaceholder: 'Phone number (Zalo)',
    submitButton: 'Submit',
    nameError: 'Please enter your name.',
    phoneError: 'Please enter your phone number.',
    phoneFormatError: 'Phone number format not recognized. Please check (e.g. 0912 345 678).',
  },
} as const

// ---------------------------------------------------------------------------
// Post-preChat greeting — after user submits name + phone.
// ---------------------------------------------------------------------------
export const preChatGreeting = {
  vi: (name: string) =>
    `Cảm ơn anh/chị ${name} đã để lại thông tin ạ! 🌷\n\nEm đến từ Bộ phận Học vụ tại EPath Education. Em sẵn sàng hỗ trợ anh/chị tìm hiểu về chương trình Tiểu học – THPT, lộ trình học tập, học phí, hoặc đăng ký tư vấn 1-1 với đội ngũ tư vấn viên.\n\nAnh/chị muốn em chia sẻ về vấn đề nào trước ạ?`,
  en: (name: string) =>
    `Thank you, ${name}! 🌷\n\nI'm from the Academic Department at EPath Education. I'm happy to help you explore Elementary – High School programs, learning pathways, tuition, or arrange a 1-on-1 consultation with our team.\n\nWhat would you like to know first?`,
} as const

// ---------------------------------------------------------------------------
// CTA nudge — shown after 3 user messages when phone not yet collected.
// ---------------------------------------------------------------------------
export const ctaReminder = {
  vi: 'Nếu anh/chị muốn được tư vấn chi tiết hơn về lộ trình cho con, có thể để lại SĐT — cô tư vấn viên sẽ gọi lại trong 24h ạ.',
  en: 'If you\'d like a detailed consultation on the right pathway for your child, feel free to leave your phone number — our advisor will call you back within 24 hours.',
} as const

// ---------------------------------------------------------------------------
// Contact form strings (the "Đăng ký tư vấn" step).
// ---------------------------------------------------------------------------
export const contactForm = {
  vi: {
    header: 'Đăng ký tư vấn 1-1',
    nameLabel: 'Họ tên',
    phoneLabel: 'SĐT',
    emailLabel: 'Email (không bắt buộc)',
    childAgeLabel: 'Độ tuổi của con',
    childAgePlaceholder: 'Chọn độ tuổi',
    programLabel: 'Chương trình quan tâm',
    programPlaceholder: 'Chọn chương trình',
    campusLabel: 'Cơ sở quan tâm',
    campusPlaceholder: 'Chọn cơ sở',
    noteLabel: 'Ghi chú thêm (không bắt buộc)',
    submitButton: 'Gửi thông tin',
    submittingButton: 'Đang gửi...',
    errorDefault: 'Không thể gửi thông tin lúc này. Quý phụ huynh vui lòng thử lại sau.',
    topicsLabel: 'Chủ đề đã hỏi:',
    topicAlreadySubmittedNote: 'Bộ phận Tư vấn đã nhận được thông tin từ buổi trò chuyện bên trên.',
    successTitle: (name: string) =>
      `Cảm ơn ${name}!\n\nThông tin của anh/chị đã được em ghi nhận. Bộ phận Tư vấn của EPath sẽ liên hệ qua số đã cung cấp trong vòng 24 giờ để hỗ trợ chi tiết ạ.\n\nTrong thời gian chờ, anh/chị có thể tiếp tục hỏi em bất kỳ điều gì về chương trình nhé.`,
    // Pre-chat lead present
    preChatAck: (name: string) =>
      `Dạ vâng ạ! Cô đã ghi nhận thông tin của anh/chị ${name} rồi. Anh/chị chỉ cần bổ sung thêm vài thông tin bên dưới để cô tư vấn viên gọi lại tư vấn chi tiết nhé ạ.`,
    // No pre-chat lead yet
    noPreChatAck:
      'Dạ, để EPath liên hệ tư vấn chi tiết cho anh/chị, em mời điền nhanh thông tin bên dưới nhé. Chỉ cần Họ tên, Số điện thoại và một vài thông tin cơ bản ạ.',
  },
  en: {
    header: 'Request a 1-on-1 Consultation',
    nameLabel: 'Full Name',
    phoneLabel: 'Phone',
    emailLabel: 'Email (optional)',
    childAgeLabel: 'Child\'s Age',
    childAgePlaceholder: 'Select age',
    programLabel: 'Program of Interest',
    programPlaceholder: 'Select program',
    campusLabel: 'Campus of Interest',
    campusPlaceholder: 'Select campus',
    noteLabel: 'Additional notes (optional)',
    submitButton: 'Submit',
    submittingButton: 'Sending...',
    errorDefault: 'Unable to submit right now. Please try again later.',
    topicsLabel: 'Topics asked about:',
    topicAlreadySubmittedNote: 'Our advisor has already received the context from your conversation above.',
    successTitle: (name: string) =>
      `Thank you, ${name}!\n\nYour information has been received. An EPath academic advisor will contact you at the number provided within 24 hours.\n\nWhile you wait, feel free to ask me anything else about our programs.`,
    preChatAck: (name: string) =>
      `Great! I've already noted your information, ${name}. Please fill in a few more details below so our advisor can give you a thorough consultation call.`,
    noPreChatAck:
      'To arrange a detailed consultation, please fill in the form below. We just need your name, phone number, and a few basic details.',
  },
} as const

// ---------------------------------------------------------------------------
// Topic quick-action label (shown when a topic card is clicked).
// ---------------------------------------------------------------------------
export const topicPrompt = {
  vi: (topicLabel: string) =>
    `📚 **${topicLabel}**\n\nEm gợi ý một số câu hỏi phổ biến về ${topicLabel.toLowerCase()}. Anh/chị chọn câu hỏi hoặc hỏi cô trực tiếp nhé!`,
  en: (topicLabel: string) =>
    `📚 **${topicLabel}**\n\nHere are some common questions about ${topicLabel.toLowerCase()}. Pick one or ask me directly!`,
} as const

// ---------------------------------------------------------------------------
// Footer / online status bar inside the chat panel.
// ---------------------------------------------------------------------------
export const chatFooter = {
  vi: {
    statusOnline: 'Bộ phận Học vụ đang online',
    statusOffline: 'Bộ phận Học vụ có thể không phản hồi chính xác 100%. Vui lòng liên hệ trực tiếp để được tư vấn chi tiết.',
  },
  en: {
    statusOnline: 'Academic Department is online',
    statusOffline: 'Academic Department responses may not always be 100% accurate. Please contact us directly for detailed advice.',
  },
} as const

// ---------------------------------------------------------------------------
// Header status line in the chat panel title bar.
// ---------------------------------------------------------------------------
export const chatHeaderStatus = {
  vi: {
    contact: 'Đăng ký tư vấn 1-1',
    welcomeBack: (name: string) => `Xin chào ${name} 👋`,
    default: 'EPath Education',
    advisor: 'Bộ phận Học vụ — EPath',
  },
  en: {
    contact: 'Request Consultation',
    welcomeBack: (name: string) => `Hello ${name} 👋`,
    default: 'EPath Education',
    advisor: 'Academic Department — EPath',
  },
} as const

// ---------------------------------------------------------------------------
// Input placeholder.
// ---------------------------------------------------------------------------
export const inputPlaceholder = {
  vi: 'Nhập câu hỏi cho Bộ phận Học vụ...',
  en: 'Ask the Academic Department anything...',
} as const

// ---------------------------------------------------------------------------
// Reset session button.
// ---------------------------------------------------------------------------
export const resetSession = {
  vi: 'Làm mới cuộc trò chuyện',
  en: 'Start a new conversation',
} as const

// ---------------------------------------------------------------------------
// Select options — child age.
// ---------------------------------------------------------------------------
export const childAgeOptions = {
  vi: [
    '3-5 tuổi (Mầm non)',
    '6-10 tuổi (Tiểu học)',
    '11-14 tuổi (THCS)',
    '15-17 tuổi (THPT)',
    'Trên 18 tuổi',
  ],
  en: [
    '3-5 years (Kindergarten)',
    '6-10 years (Elementary)',
    '11-14 years (Middle School)',
    '15-17 years (High School)',
    'Over 18 years',
  ],
} as const

// ---------------------------------------------------------------------------
// Select options — program.
// ---------------------------------------------------------------------------
export const programOptions = {
  vi: [
    { label: 'Chương trình tiêu chuẩn (Semi-Homeschool)', value: 'Chương trình tiêu chuẩn (Semi-Homeschool)' },
    { label: 'Chương trình Quốc tế (Homeschool)', value: 'Chương trình Quốc tế (Homeschool)' },
    { label: 'Chương trình Song bằng', value: 'Chương trình Song bằng' },
  ],
  en: [
    { label: 'Standard Program (Semi-Homeschool)', value: 'Standard Program (Semi-Homeschool)' },
    { label: 'International Program (Homeschool)', value: 'International Program (Homeschool)' },
    { label: 'Dual Diploma Program', value: 'Dual Diploma Program' },
  ],
} as const

// ---------------------------------------------------------------------------
// Select options — campus.
// ---------------------------------------------------------------------------
export const campusOptions = {
  vi: [
    { label: 'EPath Campus (Trần Phú, Thủ Dầu Một)', value: 'EPath Campus (Trần Phú, Thủ Dầu Một)' },
    { label: 'Little People Lào Cai', value: 'Little People Lào Cai' },
    { label: 'Little People Lái Thiêu', value: 'Little People Lái Thiêu' },
  ],
  en: [
    { label: 'EPath Campus (Tran Phu, Thu Dau Mot)', value: 'EPath Campus (Tran Phu, Thu Dau Mot)' },
    { label: 'Little People Lao Cai', value: 'Little People Lao Cai' },
    { label: 'Little People Lai Thieu', value: 'Little People Lai Thieu' },
  ],
} as const

// ---------------------------------------------------------------------------
// Quick-action buttons shown after pre-chat form.
// ---------------------------------------------------------------------------
export const quickActions = {
  vi: {
    bookConsultation: 'Đăng ký tư vấn',
    explorePrograms: 'Tìm hiểu chương trình',
    viewTuition: 'Xem học phí',
  },
  en: {
    bookConsultation: 'Book Consultation',
    explorePrograms: 'Explore Programs',
    viewTuition: 'View Tuition',
  },
} as const

// ---------------------------------------------------------------------------
// Chat invite card (the center-screen browsing invite).
// ---------------------------------------------------------------------------
export const chatInviteContent = {
  vi: {
    title: 'Bộ phận Học vụ — EPath',
    subtitle: 'Chào anh/chị! 👋 Em đến từ Bộ phận Học vụ tại EPath.\nNếu anh/chị có câu hỏi về chương trình, học phí hay lộ trình phù hợp cho con, em sẵn sàng tư vấn ngay ạ.',
    online: 'Đang trực tuyến',
    cta: 'Bắt đầu trò chuyện',
    dismiss: 'Để sau',
  },
  en: {
    title: 'Academic Department — EPath',
    subtitle: `Hello! 👋 I'm from the Academic Department at EPath.\nIf you have questions about our programs, tuition, or the right pathway for your child, I'm here to help!`,
    online: 'Online now',
    cta: 'Start a conversation',
    dismiss: 'Maybe later',
  },
} as const

// ---------------------------------------------------------------------------
// Helper: pick the right content given a locale string.
// ---------------------------------------------------------------------------
export function pickLocale(locale: string): Locale {
  return locale === 'en' ? 'en' : 'vi'
}
