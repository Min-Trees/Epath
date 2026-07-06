import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Knowledge base distilled from the EPath FAQ (chatbot.tsx qaDatabase).
// Kept compact so the LLM gets full context without burning tokens on
// formatting. Add new entries here when the FAQ grows.
const EPATH_KNOWLEDGE = `
# EPath Education - Knowledge Base

## Về EPath
- EPath Education là hệ thống giáo dục liên cấp từ Mầm non (3 tuổi) đến Trung học (lớp 12).
- Đối tác học thuật chính: Edmentum (Hoa Kỳ) - sử dụng Exact Path và Courseware.
- Chương trình được công nhận bởi Cognia và WASC.
- Đối tác cấp bằng THPT Mỹ: EdOptions Academy.
- Mô hình: Blended Learning (Online + Onsite).

## Các chương trình
1. **Chương trình Tiêu chuẩn (Semi-Homeschool)**: Học sinh học thêm tại EPath ngoài giờ học ở trường chính. Học các môn nền tảng (ELA, Toán, Science). Không có bảng điểm chính thức từ đối tác quốc tế.
2. **Chương trình Quốc tế (Homeschool)**: Học sinh theo học chính thức chương trình phổ thông Mỹ. EPath là cố vấn học tập. Có bảng điểm chính thức và bằng Tú Tài Mỹ khi tốt nghiệp.
3. **Song bằng / Dual Diploma**: Học đồng thời chương trình THPT Việt Nam và THPT Mỹ. Tốt nghiệp nhận 2 bằng (PTTH Việt Nam + PTTH Mỹ).

## Độ tuổi & tuyển sinh
- Mầm non: 3-6 tuổi. Mục tiêu: Phonics, Toán/Khoa học nền tảng, hướng đến Cambridge Starters trước lớp 1.
- Tiểu học & THCS: Học 4 buổi/tuần (02 Online 60' + 02 Onsite cuối tuần 90').
- THPT: Chương trình chuẩn bị đại học quốc tế.
- Tuyển sinh xuyên suốt năm.
- Có bài đánh giá đầu vào (Diagnostic Test) trên Exact Path để xếp lớp.

## Lịch học
- 3 học kỳ chính khóa + 1 học kỳ Hè.
- Mầm non: 3 buổi/tuần x 1 giờ (2 buổi GV nước ngoài + 1 buổi GV Việt Nam).
- Sĩ số tối đa 20 học sinh/lớp. Mỗi lớp có 1 GV chính + 1 cố vấn học tập.

## Giáo viên
- Có chứng chỉ TESOL/TEFL.
- Cấp cao hơn có giáo viên certified từ Hoa Kỳ.
- Đồng hành chuyên môn bởi Edmentum International.

## Học phí
- EPath công bố biểu phí hằng năm cho từng khối lớp.
- Đóng theo Tháng / Học kỳ / Năm (có ưu đãi khác nhau).
- Hạn chót đóng phí: trước ngày 27 của kỳ liền trước.
- Chưa áp dụng hoàn phí sau khi đăng ký/giữ chỗ.
- Mức tăng hằng năm: không quá 10% (nếu có).
- Có ưu đãi: thanh toán theo học kỳ/năm, anh/chị/em, học sinh Little People.
- Liên hệ bộ phận tư vấn để nhận báo giá chi tiết.

## Bằng cấp & chứng chỉ
- Hoàn thành cấp độ: Giấy chứng nhận của Edmentum International.
- Tốt nghiệp Homeschool: Bằng Tú Tài Mỹ (từ EdOptions Academy).
- Có thể thi: Cambridge English, IELTS, SAT, ACT, AP, Olympiad quốc tế.
- SAT/ACT dùng để xét tuyển đại học Mỹ và quốc tế. IELTS không thay thế SAT/ACT.
- Hồ sơ đại học quốc tế gồm: học bạ, bằng tốt nghiệp, IELTS/TOEFL, SAT/ACT (nếu yêu cầu), bài luận, thư giới thiệu, ngoại khóa.

## Cơ sở
1. **EPath Campus** (Tiểu học - THCS): Số 38 Trần Phú, phường Thủ Dầu Một, TP.HCM.
2. **Little People Lào Cai** (Mầm non): 178 Lào Cai, phường Thủ Dầu Một, TP.HCM.
3. **Little People Lái Thiêu** (Mầm non): 44B Nguyễn Văn Tiết, phường Lái Thiêu, TP.HCM.

## Hoạt động ngoại khóa
- Tổ chức định kỳ mỗi 6 tuần trong bán kính ~1 giờ di chuyển từ cơ sở.
- Phát triển kỹ năng xã hội, làm việc nhóm, xây dựng Student Profile (cho hồ sơ đại học).

## Hỗ trợ học tập
- Bài đánh giá định kỳ 2 lần/học kỳ.
- Nếu dưới 65%: sắp xếp buổi hỗ trợ học tập tập trung.
- Phụ huynh nhận report tổng hợp hằng tháng.
- Tutor: buổi học bổ trợ củng cố kiến thức sau mỗi chủ đề.

## Đăng ký nhập học
- Phụ huynh để lại thông tin qua form (họ tên, SĐT, email, độ tuổi con, chương trình quan tâm, cơ sở).
- Hoặc liên hệ trực tiếp bộ phận tư vấn EPath.
- Sau khi tiếp nhận, EPath sẽ liên hệ tư vấn trong vòng 24 giờ.
`

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn AI chính thức của EPath Education (tiếng Việt).

Nhiệm vụ: trả lời câu hỏi của phụ huynh về EPath dựa trên knowledge base được cung cấp.

Quy tắc BẮT BUỘC:
- Trả lời bằng tiếng Việt, giọng thân thiện, chuyên nghiệp, xưng "em" - gọi phụ huynh là "anh/chị" hoặc "quý phụ huynh".
- Trả lời NGẮN GỌN tối đa 3-4 câu (khoảng 60-120 từ). KHÔNG liệt kê dài, KHÔNG đánh số 1,2,3 khi không cần thiết.
- Chỉ dùng thông tin từ knowledge base. Nếu không biết, nói thẳng là chưa có thông tin và hướng dẫn liên hệ tư vấn.
- TUYỆT ĐỐI KHÔNG liệt kê danh sách tất cả câu hỏi/câu trả lời. KHÔNG hỏi lại user "anh/chị muốn hỏi về vấn đề nào?" - user đã hỏi rồi, cứ trả lời trực tiếp.
- Nếu phụ huynh hỏi về giá cụ thể, học phí chính xác từng chương trình → nói sẽ được tư vấn viên báo giá chi tiết và mời để lại SĐT.
- Nếu phụ huynh nói muốn "đăng ký / nhập học / ghi danh / để lại thông tin / tư vấn" → mời để lại SĐT để bộ phận tư vấn liên hệ trong 24 giờ.
- Không bịa đặt thông tin không có trong knowledge base.
- Không trả lời câu hỏi ngoài phạm vi giáo dục/EPath.
- KHÔNG dùng markdown in đậm (**text**) - chỉ dùng text thuần và xuống dòng.

Knowledge base:
${EPATH_KNOWLEDGE}
`

async function callGroq(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured')
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.4,
      max_tokens: 350,
      top_p: 0.9,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error: ${res.status} - ${err}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) {
    throw new Error('Empty response from Groq')
  }
  return text
}

// Fallback rule-based answers when Groq is unavailable.
// Matches common question patterns with short, friendly Vietnamese replies.
function fallbackAnswer(question: string): string {
  const q = question.toLowerCase().trim()

  if (!q) {
    return 'Em chưa nhận được câu hỏi của anh/chị. Anh/chị muốn hỏi về vấn đề gì ạ?'
  }

  // Greetings
  if (/^(xin chào|chào|hi|hello|hey)/i.test(q)) {
    return 'Xin chào anh/chị! 👋 Em là trợ lý tư vấn của EPath Education. Em có thể hỗ trợ thông tin về chương trình học, học phí, độ tuổi tuyển sinh, hoặc đăng ký tư vấn. Anh/chị muốn tìm hiểu về vấn đề nào ạ?'
  }

  if (q.includes('cảm ơn') || q.includes('thank')) {
    return 'Dạ không có gì ạ! Nếu anh/chị cần thêm thông tin hoặc muốn đăng ký tư vấn, em luôn sẵn sàng hỗ trợ. 😊'
  }

  if (q.includes('đăng ký') || q.includes('nhập học') || q.includes('ghi danh')) {
    return 'Để đăng ký nhập học tại EPath, anh/chị có thể:\n\n1. Để lại thông tin qua form "Đăng ký tư vấn" trong chatbot\n2. Hoặc liên hệ trực tiếp bộ phận tư vấn EPath\n\nSau khi tiếp nhận, đội ngũ tư vấn sẽ liên hệ trong vòng 24 giờ để hỗ trợ chi tiết ạ.'
  }

  if (q.includes('học phí') || q.includes('chi phí') || q.includes('giá') || q.includes('bao nhiêu tiền') || q.includes('phí')) {
    return 'EPath công bố biểu phí hằng năm cho từng khối lớp (Mầm non → Trung học). Mức phí phụ thuộc vào chương trình (Tiêu chuẩn, Quốc tế, Song bằng) và cơ sở đăng ký.\n\nĐể nhận báo giá chi tiết, anh/chị vui lòng để lại SĐT qua form "Đăng ký tư vấn" hoặc liên hệ trực tiếp EPath ạ.'
  }

  if (q.includes('địa chỉ') || q.includes('cơ sở') || q.includes('ở đâu') || q.includes('học ở đâu')) {
    return 'EPath hiện có 3 cơ sở:\n\n1. EPath Campus (Tiểu học - THCS): 38 Trần Phú, Thủ Dầu Một, TP.HCM\n2. Little People Lào Cai (Mầm non): 178 Lào Cai, Thủ Dầu Một\n3. Little People Lái Thiêu (Mầm non): 44B Nguyễn Văn Tiết, Lái Thiêu'
  }

  if (q.includes('tuyển sinh') || q.includes('độ tuổi') || q.includes('mấy tuổi')) {
    return 'EPath tuyển sinh từ Mầm non (3 tuổi) đến Trung học, xuyên suốt năm. Sau bài đánh giá đầu vào (Diagnostic Test trên Exact Path), học sinh được xếp lớp phù hợp với năng lực.'
  }

  // Default
  return 'Cảm ơn câu hỏi của anh/chị! Em đang gặp chút khó khăn trong việc trả lời tự động. Để được tư vấn chính xác nhất, anh/chị vui lòng:\n\n• Nhấn "Chủ đề" để xem các câu hỏi phổ biến\n• Hoặc để lại SĐT qua "Đăng ký tư vấn" để đội ngũ EPath liên hệ hỗ trợ trong 24 giờ ạ.'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { message, history } = body as {
      message?: string
      history?: { role: 'user' | 'assistant'; content: string }[]
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tin nhắn không hợp lệ' },
        { status: 400 }
      )
    }

    // Sanitize history (keep last 6 turns to control tokens)
    const safeHistory: ChatMessage[] = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              (m.role === 'user' || m.role === 'assistant') &&
              typeof m.content === 'string' &&
              m.content.trim()
          )
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }))
      : []

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeHistory,
      { role: 'user', content: message.trim().slice(0, 1000) },
    ]

    try {
      const answer = await callGroq(messages)
      return NextResponse.json({ success: true, answer, source: 'groq' })
    } catch (groqErr) {
      console.error('[chatbot] Groq failed, using fallback:', groqErr)
      const answer = fallbackAnswer(message)
      return NextResponse.json({ success: true, answer, source: 'fallback' })
    }
  } catch (err) {
    console.error('[chatbot] error:', err)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    info: 'EPath chatbot API. POST { message, history } to get a reply.',
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
  })
}