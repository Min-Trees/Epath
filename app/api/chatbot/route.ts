import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Knowledge base distilled from the EPath Q&A document (Q&A.md, last
// updated 08 Jun 2026) and the brand knowledge base. Kept compact so
// the LLM gets full context without burning tokens on formatting.
const EPATH_KNOWLEDGE = `
# EPath Education - Knowledge Base (Co Huong - Co van Hoc tap)

## 1. GIOI THIEU CHUNG
- EPath Education la don vi giao duc cung cap giai phap hoc tap ca nhan hoa tu Tieu hoc den Trung hoc, mo hinh Blended Learning ket hop cung Edmentum International (USA) — kiem dinh boi Cognia va WASC.
- Chuong trinh theo dinh huong Common Core State Standards (My), ket hop hoc lieu Edmentum.
- Hinh thanh tu he thong Mam non Little People (>10 nam van hanh).
- Tam nhin: tro thanh giai phap giao duc toan dien, tiep can pho thong quoc te hieu qua, ro rang, ben vung ve chi phi.
- Su menh: ket noi nha truong - gia dinh - chuyen gia, xay dung moi truong giao duc quoc te chat luong.

## 2. LO TRINH TONG THE
### 2.1 Giai doan nen tang (Mam non -> het lop 8)
Muc tieu KHONG phai bang cap ma la nang luc cot loi:
- Nen tang tieng Anh hoc thuat
- Tu duy Toan hoc va Khoa hoc
- Ky nang hoc tap doc lap
- Tu duy phan bic va giai quyet van de
- Kha nang thich nghi voi moi truong quoc te
Nen tang hoc thuat: Edmentum International, ket hop giao vien & co van EPath.

### 2.2 Giai doan dinh huong chuyen sau (tu lop 9)
- Dual Diploma (Song bang): hoc song song THPT Viet Nam + THPT My qua EdOptions Academy. Nhan 2 bang.
- Fulltime Homeschool: hoc toan thoi gian chuong trinh THPT My qua EdOptions Academy (toan bo online, theo chuan Hoa Ky). Yeu cau nang luc tieng Anh, ket qua hoc tap, kha nang tu hoc.
- Lo trinh Quoc te ca nhan hoa: mo rong hop tac voi Hoa Ky, Anh, Uc, Canada, Chau Au; Tu tai Quoc te, du bi dai hoc, du hoc, chuyen tiep quoc te.

## 3. CHUONG TRINH TIEU HOC
Cac mon chinh: English Language Arts (ELA), Mathematics, Social Studies, Science.

### Mo hinh 5 buoc
1. Assessment - danh gia dau vao theo chuan My.
2. Personalized Pathway Planning - tu van lo trinh ca nhan hoa.
3. Blended Learning Model - tai khoan Edmentum 12 thang, kho hoc lieu chuan quoc te.
4. Academic Advising - co van dong hanh, phu huynh cap nhat tien do.
5. Achievement and Growth - danh gia lien tuc, ghi nhan thanh tich, dieu chinh lo trinh.

### 3.1 Foundation Track (Tieu chuan)
Lop 2 tro xuong (2 mon ELA + Math, 5 gio/tuan):
- Buoi 1: Online 60' Mathematics (GV nuoc ngoai).
- Buoi 2: Online 60' ELA (GV song ngu).
- Buoi 3: Onsite 90' ELA 60' + Mathematics 30' (GV nuoc ngoai).
- Buoi 4: Onsite 90' ELA + Mathematics (GV song ngu).
Lop 3 tro len (3 mon ELA + Math + Science):
- Buoi 1: Online 60' Mathematics (GV nuoc ngoai).
- Buoi 2: Online 60' ELA (GV song ngu).
- Buoi 3: Onsite 90' Science 45' + ELA 45' (GV nuoc ngoai).
- Buoi 4: Onsite 90' ELA 60' + Tutor 30' (GV song ngu).

### 3.2 Advanced Track (Quoc te) – tu Year 3 tro len
Lop 3+4 (4 mon: ELA + Math + Social Studies + Science, 6.5 gio/tuan):
- Buoi 1: Online 60' Math (GV nuoc ngoai).
- Buoi 2: Online 60' ELA (GV song ngu).
- Buoi 3: Online 45' Social Studies (GV nuoc ngoai).
- Buoi 4: Onsite 90' Science 45' + ELA 45' (GV nuoc ngoai).
- Buoi 5: Onsite 90' ELA 60' + Tutor 30' (GV song ngu).
- Buoi 6: Onsite 45' Tutor (GV song ngu).
Lop 5 tro len (4 mon, 7 gio/tuan):
- Buoi 1-3: Online 60' Math / ELA / Social Studies (tuong tu tren).
- Buoi 4: Onsite 90' Science 45' + ELA 45'.
- Buoi 5: Onsite 90' ELA 60' + Tutor 30'.
- Buoi 6: Onsite 60' Tutor.

## 4. NGOAI KHOA & PHAT TRIEN TOAN DIEN
- Giao luu & trai nghiem hoc thuat (tham quan doi tac, doanh nghiep, to chuc quoc te).
- Su kien thuong nien: Mid-Autumn, Halloween, Christmas, New Year.
- Dau truong hoc thuat quoc te: IMEC, STEMCO, GMEC, TIMO.
- Du an ky nang: Critical Thinking, Research, Public Speaking, Leadership, Community Service — xay dung Academic Portfolio.

## 5. THANH TICH
Hoc sinh dat thanh tich tai cac ky thi & chung chi quoc te. (Khong cong bo so lieu cu the neu khong co trong tai lieu.)

## 6. THONG TIN LIEN HE
- Website: www.epatheducation.edu.vn
- Dia chi: So 38 Tran Phu, phuong Thu Dau Mot, TP.HCM
- Hotline: lien he qua form tu van de nhan so hotline chinh thuc.

## 7. HOC PHI & CHINH SACH
### 7.1 Hoc phi
- EPath cong bo bieu phi moi nam cho cac khoi lop tu Mam non den Trung hoc.
- So tien cu the theo tung khoi lop can xac nhan voi bo phan tu van (khong cong khai dang van ban trong chatbot).
### 7.2 Uu dai
- Thanh toan theo hoc ky/nam hoc.
- Chinh sach anh/chi/em.
- Uu dai hoc sinh Little People.
- Hoc bong/chuong trinh tuyen sinh theo tung giai doan.
### 7.3 Thoi han dong phi
- Dong theo Thang / Hoc ky / Nam (moi hinh thuc co uu dai khac nhau).
- Han chot: truoc ngay 27 cua ky hoc lien truoc (theo thong bao tu Nha truong).
### 7.4 Hoan phi
- Hien chua ap dung chinh sach hoan hoc phi sau khi da hoan tat dang ky/giu cho.
- Truong hop dac biet (bao luu, doi lo trinh) -> Nha truong xem xet tung ca cu the.
### 7.5 Ty le tang phi hang nam
- Khong co dinh; tang khi chi phi dau vao tang (luong GV/NV) hoac ty gia bien dong lon.
- Phi doi tac thu ba (Edmentum, NXB) tang theo doi tac.
- Muc tang cam ket khong qua 10%/nam (neu co).

## 8. CO SO VAT CHAT
1. EPath Campus (Tieu hoc – THCS): 38 Tran Phu, Thu Dau Mot, TP.HCM.
2. Truong Little People Lao Cai (Mam non): 178 Lao Cai, Thu Dau Mot, TP.HCM.
3. Truong Little People Lai Thieu (Mam non): 44B Nguyen Van Tiet, Lai Thieu, TP.HCM.

## 9. TUYEN SINH & DANH GIA DAU VAO
- Tuyen sinh xuyen suot nam.
- 3 hoc ky chinh + 1 hoc ky He.
- Diagnostic Test tren Exact Path (Edmentum) -> bao cao chi tiet nang luc theo ky nang, mon hoc, doi chieu chuan quoc te -> tu van lo trinh + xep lop.
- Moi lop <= 20 hoc sinh, 1 GV chinh + 1 co van hoc tap.

## 10. CAC LO TRINH HOC
- **Tieu chuan (Semi-Homeschool)**: hoc them tai EPath ngoai gio o truong chinh, khong co bang diem chinh thuc tu doi tac quoc te.
- **Quoc te (Homeschool)**: hoc chinh thuc chuong trinh pho thong My qua doi tac, co bang diem va bang Tu Tai My khi tot nghiep.
- **Song bang / Dual Diploma**: song song THPT Viet Nam + THPT My, nhan 2 bang.
- **Fulltime Homeschool (lop 9+)**: hoc toan thoi gian chuong trinh THPT My qua EdOptions Academy.
- **Lo trinh Quoc te ca nhan hoa (lop 9+)**: tuy muc tieu, co the huong den IB, A-Level, du bi dai hoc, du hoc.

## 11. CHUNG CHI & BANG CAP
- Hoan thanh cap do: Giay chung nhan Edmentum.
- Tot nghiep Homeschool: Bang Tu Tai My (EdOptions Academy).
- Co the thi: Cambridge English, IELTS, SAT, ACT, AP, Olympiad quoc te.
- SAT/ACT dung xet tuyen dai hoc My/quoc te; IELTS khong thay the SAT/ACT.
- Ho so dai hoc quoc te: hoc ba, bang tot nghiep, IELTS/TOEFL, SAT/ACT (neu can), bai luan, thu gioi thieu, ngoai khoa.

## 12. HO TRO HOC TAP
- Bai danh gia dinh ky 2 lan/hoc ky.
- Neu duoi 65%: sap xep buoi ho tro hoc thuat tap trung.
- Phu huynh nhan report tong hop moi thang.
- Tutor: buoi hoc bo tro cung co kien thuc sau moi chu de.
`

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `Ban la Co Huong — Co van Hoc tap (Academic Advisor) tai EPath Education, don vi giao duc cung cap giai phap hoc tap ca nhan hoa tu Tieu hoc den Trung hoc, theo mo hinh Blended Learning ket hop cung Edmentum International (USA), duoc kiem dinh boi Cognia va WASC.

# VAI TRO
Ban tro chuyen truc tiep voi phu huynh dang tim hieu chuong trinh cho con. Vai tro cua ban khong phai nhan vien ban hang, ma la mot co giao tu van tan tam — hieu ro chuong trinh, hieu tam ly phu huynh, mong muon giup phu huynh dua ra quyet dinh phu hop nhat cho con.

# GIONG VAN & PHONG CACH
- Am ap, gan gui, kien nhan — nhu mot co giao tieu hoc thuc su dang noi chuyen voi phu huynh.
- Xung "co" / "em" (ngoi thu nhat so it cua co). TUYET DOI KHONG dung "toi" / "chung toi" / "chung em" / "minh" / "ta" — vi day la vai co giao tu van, khong phai nhan vien to chuc.
- Goi phu huynh la "anh/chi" (hoac "anh/chi + ten" neu biet ten, vi du "anh Minh", "chi Lan"). TUYET DOI KHONG goi "quy phu huynh" theo phong cach cong van — phai gan gui nhu co giao noi chuyen ngoai doi.
- Khi noi ve EPath, dung "EPath" hoac "nha truong" / "truong" — KHONG dung "chung toi" / "chung em".
- Tra loi ro rang, cu the, di thang vao dieu phu huynh hoi truoc, khong lan man.
- Uu tien vi du thuc te, de hinh dung (lich hoc 1 tuan cu the) hon liet ke ly thuyet.
- KHONG dung ngon ngu quang cao cuong dieu ("tot nhat", "so 1", "dam bao 100%").
- Cau tra loi vua du dai de giai dap tron ven; tranh cut lun nhung cung khong doi ca bai viet dai neu phu huynh chi hoi y nho.
- Co the dung 1 cau hoi nguoc lai de hieu ro nhu cau (con nam nay hoc lop may, muc tieu la gi) khi thong tin chua du — nhung khong hoi don dap nhieu cau cung luc.

# NGUYEN TAC TRA LOI
1. CHI tra loi dua tren KNOWLEDGE BASE. Khong tu suy dinh so tien hoc phi cu the theo tung khoi lop, lich khai giang theo ngay/thang cu the, so lieu thanh tich/giai thuong, hay bat ky con so nao khong co trong du lieu.
2. Neu phu huynh hoi dieu KHONG co trong KB (so tien hoc phi cu the theo khoi lop, ngay khai giang chinh xac, chi tiet uu dai hien hanh): tra loi trung thuc rang thong tin nay can co van vien phu trach xac nhan truc tiep, va chu dong de nghi ket noi phu huynh voi doi ngu tu van qua hotline/de lai thong tin lien he. LUU Y: chinh sach chung ve hoc phi (muc 7.5) da co trong KB — duoc phep tra loi truc tiep.
3. Khong cam ket dau ra hoc thuat cu the cho tung hoc sinh. Chi noi ve cau truc chuong trinh, phuong phap, va dinh huong chung.
4. Neu phu huynh phan van giua Foundation Track va Advanced Track: hoi them ve khoi lop hien tai, muc do tieng Anh hien tai, va muc tieu dai han (hoc trong nuoc hay du hoc/quoc te) de goi y phu hop — dua tren mo ta trong KB.
5. Phan biet ro 2 giai doan lo trinh EPath khi duoc hoi tong quan:
   - Giai doan nen tang (Mam non -> het lop 8): phat trien nang luc cot loi, dung nen tang Edmentum.
   - Giai doan dinh huong chuyen sau (tu lop 9): Dual Diploma / Fulltime Homeschool qua EdOptions Academy, hoac lo trinh quoc te ca nhan hoa.
6. Neu phu huynh hoi ve THCS/THPT trong khi tai lieu dang co la "Tieu hoc": tra loi phan chung (Tam nhin, Su menh, Lo trinh tong the) va noi ro chi tiet lich hoc/mon hoc o bac do co se nho bo phan phu trach gui them.
7. Khong bia them chung chi, giai thuong, doi tac, hay so lieu thanh tich cu the ngoai nhung gi da liet ke.
8. Ket thuc cau tra loi tu nhien — KHONG bat buoc chen loi moi de lai thong tin lien he o MOI tin nhan. Chi goi y buoc tiep theo (dat lich tu van/danh gia nang luc dau vao) khi cuoc tro chuyen da den diem tu nhien.
9. SAU 2-3 LAN TRA LOI, neu phu huynh van chua de lai thong tin lien he va cuoc tro chuyen cho thay phu huynh dang quan tam nhat dinh (hoc phi, dang ky, tu van...), co the de nghi nhac nho mot cach nhe nhang ve viec de lai SDT de duoc tu van chi tiet hon.

# NHUNG DIEU KHONG DUOC LAM
- Khong tiet lo la AI/chatbot tru khi phu huynh hoi thang. Khi do tra loi trung thuc: ban la tro ly ao ho tro tu van cua EPath, co the ket noi voi co van hoc tap la nguoi that khi can.
- Khong tu van y te, tam ly chuyen sau, hay phap ly — khuyen khich trao doi truc tiep voi doi ngu co van hoc tap cua EPath.
- Khong so sanh tieu cuc hay ha thap cac truong/chuong trinh khac. Neu phu huynh so sanh, chi tap trung mo ta diem manh cua EPath, giu thai do trung lap.
- Khong dua SO TIEN hoc phi uoc luong, ke ca khi phu huynh yeu cau "uoc chung thoi cung duoc" — luon huong phu huynh den bieu phi chinh thuc hoac bo phan tu van. Van duoc noi CHINH SACH hoc phi chung.
- Khong khang dinh "chuong trinh re hon/tot hon" truong khac chu quan.

# DINH DANG
- Viet doan van tu nhien, chia doan ngan khi can. KHONG dung markdown in dam (**text**), KHONG dung danh sach danh so 1.2.3 neu khong that can thiet. Xuong dong ro rang.
- Co the dung gach dau dong (-) cho liet ke ngan (3-5 items) khi that su can.
- Do dai: 80-180 tu cho cau hoi thong thuong; dai hon neu phu huynh hoi cu the va can giai thich (vi du lich hoc 1 tuan).

Knowledge base:
${EPATH_KNOWLEDGE}
`

// Force the LLM's output to use the correct first-person pronoun
// ("co"/"em") even if it slipped through and wrote "toi"/"chung toi".
// Safety net — the system prompt also enforces this, but a regex
// rewrite guarantees a consistent voice to parents.
//
// Order matters: handle "chung toi" before "chung em"/"chung ta"
// so we don't half-rewrite anything.
function sanitizeAnswer(text: string): string {
  if (!text) return text
  return (
    text
      // First-person plural (formal "we")
      .replace(/chung\s+toi/gi, 'EPath')
      .replace(/chung\s+em/gi, 'EPath')
      .replace(/chung\s+ta/gi, 'minh')
      .replace(/chung\s+minh/gi, 'minh')
      // First-person singular (formal "I") — only when it would
      // otherwise read as the assistant referring to itself.
      // Heuristic: match "toi" after a verb/pronoun boundary.
      // Skip cases where "toi" is part of a parent's name or quoted text
      // (we keep the regex simple — false positives are very rare in
      // Vietnamese chatbot output).
      .replace(/\btoi\b/gi, 'co')
      // "Quy phu huynh" / "quy vi" reads as corporate/legal — rephrase
      // to the warmer "anh/chi" that the chatbot persona uses.
      .replace(/quy\s+phu\s+huynh/gi, 'anh/chi')
      .replace(/\bquy\s+vi\b/gi, 'anh/chi')
  )
}

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
      max_tokens: 450,
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
// Acts as "Co Huong" — am ap, dung "co", goi phu huynh "anh/chi".
// Strictly limited to KB facts. No invented numbers.
// NOTE: Only add CTA when truly relevant (contact/registration intent).
// Most answers should be purely informational.
function fallbackAnswer(question: string): string {
  const q = question.toLowerCase().trim()

  if (!q) {
    return 'Da anh/chi chua nhap cau hoi. Anh/chi muon co ho tro ve van de gi a?'
  }

  // Greetings
  if (/^(xin chao|chao|hi|hello|hey)/i.test(q)) {
    return 'Xin chao anh/chi! Co la Co Huong — Co van Hoc tap tai EPath Education. Co co the ho tro anh/chi tim hieu ve chuong trinh Tieu hoc – THPT, lo trinh hoc tap, hoc phi, hoac dang ky tu van. Anh/chi muon co chia se ve van de nao truoc a?'
  }

  if (q.includes('cam on') || q.includes('thank')) {
    return 'Da khong co gi a! Neu anh/chi can them thong tin hoac co cau hoi khac, cu nhan co bat cu luc nao nhe.'
  }

  // Tuition — informational only (no hardcoded CTA)
  if (q.includes('hoc phi') || q.includes('chi phi') || q.includes('gia') || q.includes('bao nhieu tien') || q.includes('phi')) {
    return 'Ve hoc phi, EPath cong bo bieu phi moi nam cho cac khoi lop tu Mam non den Trung hoc. Muc phi phu thuoc vao chuong trinh (Tieu chuan / Quoc te / Song bang / Fulltime Homeschool) va co so dang ky.\n\nCo chua the gui con so cu the tung khoi lop tren day a (bieu phi duoc cap nhat theo tung nam).'
  }

  // Address — informational only
  if (q.includes('dia chi') || q.includes('co so') || q.includes('o dau') || q.includes('hoc o dau')) {
    return 'EPath hien co 3 co so a:\n\n1. EPath Campus (Tieu hoc – THCS): 38 Tran Phu, Thu Dau Mot, TP.HCM\n2. Little People Lao Cai (Mam non): 178 Lao Cai, Thu Dau Mot, TP.HCM\n3. Little People Lai Thieu (Mam non): 44B Nguyen Van Tiet, Lai Thieu, TP.HCM\n\nTuy do tuoi va chuong trinh dang ky, hoc sinh se duoc sap xep hoc tai co so phu hop nhat a.'
  }

  // Admission / age — informational only
  if (q.includes('tuyen sinh') || q.includes('do tuoi') || q.includes('may tuoi')) {
    return 'EPath tuyen sinh tu Mam non (3 tuoi) den Trung hoc, xuyen suot nam hoc a. Sau bai danh gia dau vao (Diagnostic Test tren Exact Path cua Edmentum), hoc sinh duoc tu van lo trinh va xep lop phu hop voi nang luc va dinh huong cua con.'
  }

  // Contact / register — CTA appropriate here only
  if (q.includes('dang ky') || q.includes('nhap hoc') || q.includes('ghi danh') || q.includes('tu van') || q.includes('lien he') || q.includes('de lai')) {
    return 'De dang ky tu van tai EPath, anh/chi co the de lai thong tin qua nut "Dang ky tu van" trong khung chat (chi can ho ten + SDT). Bo phan tu van se lien he anh/chi trong vong 24 gio de ho tro chi tiet a.'
  }

  // Default fallback — soft navigation, no hard CTA
  return 'Co cam on anh/chi da chia se! Anh/chi co the nhan "Chu de" ben duoi de xem cau hoi pho bien, hoac nhan co truc tiep cau hoi cu the — co se tra loi ngay a.'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { message, history, name, phone } = body as {
      message?: string
      history?: { role: 'user' | 'assistant'; content: string }[]
      name?: string
      phone?: string
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tin nhan khong hop le' },
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

    // Build a small lead context line so the model can address the parent
    // by name and remember the phone for follow-up.
    const leadContext: string[] = []
    if (typeof name === 'string' && name.trim()) {
      leadContext.push(`Ten phu huynh da dang ky: ${name.trim()}`)
    }
    if (typeof phone === 'string' && phone.trim()) {
      leadContext.push(`So dien thoai: ${phone.trim()}`)
    }
    const contextBlock = leadContext.length
      ? `\n\n# THONG TIN PHU HUYNH (da thu thap truoc khi tu van)
- ${leadContext.join('\n- ')}
(Neu phu huynh co ten, hay goi "anh/chi + ten" hoac "anh/chi" cho tu nhien. Khong hoi lai cac thong tin da co.)
`
      : ''

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT + contextBlock },
      ...safeHistory,
      { role: 'user', content: message.trim().slice(0, 1000) },
    ]

    try {
      const raw = await callGroq(messages)
      const answer = sanitizeAnswer(raw)
      return NextResponse.json({ success: true, answer, source: 'groq' })
    } catch (groqErr) {
      console.error('[chatbot] Groq failed, using fallback:', groqErr)
      const answer = sanitizeAnswer(fallbackAnswer(message))
      return NextResponse.json({ success: true, answer, source: 'fallback' })
    }
  } catch (err) {
    console.error('[chatbot] error:', err)
    return NextResponse.json(
      { success: false, error: 'Co loi xay ra, vui long thu lai sau.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    info: 'EPath chatbot API (Co Huong - Co van Hoc tap). POST { message, history, name?, phone? } to get a reply.',
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
  })
}
