import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `Bạn là trợ lý tư vấn giáo dục của EPath Education - một trung tâm giáo dục quốc tế tại Việt Nam.
            
EPath Education cung cấp:
- Chương trình từ Mầm non (Little People) đến THPT
- Chương trình chuẩn Mỹ với kiểm định Cognia & WASC
- Edmentum International - hơn 60 năm kinh nghiệm
- Blended Learning (Online + Onsite)
- Dual Diploma / Song bằng Mỹ

Hãy trả lời thân thiện bằng tiếng Việt, ngắn gọn và hữu ích. Nếu câu hỏi nằm ngoài phạm vi giáo dục, hãy gợi ý liên hệ trực tiếp với EPath qua hotline 0912 345 678.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: 'Groq API error', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.'

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
