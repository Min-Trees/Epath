/**
 * Seed script: đọc content.md và đẩy nội dung ban đầu vào Firestore.
 *
 * Cách chạy:
 *   1. Cấu hình FIREBASE_ADMIN_* trong .env.local
 *   2. npx tsx scripts/seed-cms.ts
 *
 * Script này an toàn để chạy nhiều lần: nó chỉ thêm khi collection rỗng.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { getAdminDb } from '../lib/firebase-admin'
import { CollectionNames } from '../lib/cms-types'

interface Localized {
  vi: string
  en: string
}
function t(vi: string, en: string): Localized {
  return { vi, en }
}

async function seedCollection<T extends Record<string, unknown>>(
  name: string,
  rows: T[]
) {
  const db = getAdminDb()
  const existing = await db.collection(name).limit(1).get()
  if (!existing.empty) {
    console.log(`[seed] ${name} already has data, skip.`)
    return
  }
  const batch = db.batch()
  rows.forEach((row, i) => {
    const ref = db.collection(name).doc()
    batch.set(ref, { ...row, order: i, createdAt: new Date(), updatedAt: new Date() })
  })
  await batch.commit()
  console.log(`[seed] inserted ${rows.length} rows into ${name}.`)
}

async function seedHomeSections() {
  const db = getAdminDb()
  const homeRef = db.collection(CollectionNames.pages).doc('home')
  const existing = await homeRef.collection('sections').limit(1).get()
  if (!existing.empty) {
    console.log('[seed] home sections already exist, skip.')
    return
  }
  const sections = [
    { id: 'hero', type: 'hero', order: 0, data: {} },
    { id: 'intro', type: 'intro', order: 1, data: {} },
    { id: 'vision', type: 'vision', order: 2, data: {} },
    { id: 'mission', type: 'mission', order: 3, data: {} },
    { id: 'core-values', type: 'coreValues', order: 4, data: {} },
    { id: 'pathways', type: 'learningPathways', order: 5, data: {} },
    { id: 'achievements', type: 'achievements', order: 6, data: {} },
    { id: 'faqs', type: 'faqs', order: 7, data: {} },
    { id: 'cta', type: 'cta', order: 8, data: {} },
  ]
  const batch = db.batch()
  sections.forEach((s) => {
    batch.set(homeRef.collection('sections').doc(s.id), {
      pageId: 'home',
      type: s.type,
      order: s.order,
      isActive: true,
      data: s.data,
      updatedAt: new Date(),
    })
  })
  await batch.commit()
  console.log(`[seed] inserted ${sections.length} sections into pages/home.`)
}

async function main() {
  // ============ Core Values ============
  await seedCollection(CollectionNames.coreValues, [
    {
      icon: 'Route',
      title: t('Lộ trình học tập xuyên suốt', 'Continuous learning pathway'),
      description: t(
        'Xây dựng hành trình học tập liền mạch từ nền tảng Mầm non (Little People) đến Trung học Phổ thông, đảm bảo tính liên tục và nhất quán trong phát triển học thuật.',
        'A seamless learning journey from kindergarten (Little People) through high school, ensuring continuity in academic development.'
      ),
      isActive: true,
    },
    {
      icon: 'BadgeCheck',
      title: t('Chuẩn học thuật quốc tế được kiểm định', 'Accredited international academic standards'),
      description: t(
        'Triển khai chương trình hợp tác với tổ chức giáo dục Edmentum International (USA), được kiểm định bởi Cognia và WASC.',
        'Delivering a programme in partnership with Edmentum International (USA), accredited by Cognia and WASC.'
      ),
      isActive: true,
    },
    {
      icon: 'Layers',
      title: t('Mô hình học tập kết hợp (Blended Learning)', 'Blended learning model'),
      description: t(
        'Tích hợp linh hoạt giữa học trực tuyến và trực tiếp, tối ưu hiệu quả tiếp thu và cá nhân hoá trải nghiệm học tập.',
        'Flexibly combining online and in-person learning to maximise outcomes and personalise the experience.'
      ),
      isActive: true,
    },
    {
      icon: 'Compass',
      title: t('Cá nhân hoá lộ trình học tập', 'Personalised learning pathway'),
      description: t(
        'Thiết kế lộ trình dựa trên năng lực, mục tiêu và định hướng của từng học sinh thông qua hệ thống đánh giá học thuật và tư vấn chuyên sâu.',
        'Pathways designed around each student’s ability, goals and aspirations, with rigorous academic assessment and advisory support.'
      ),
      isActive: true,
    },
    {
      icon: 'Sparkles',
      title: t('Phát triển năng lực toàn diện & hồ sơ cá nhân', 'Holistic development and student profile'),
      description: t(
        'Kết hợp học thuật với hoạt động ngoại khoá, kỹ năng và trải nghiệm thực tiễn nhằm xây dựng student profile chuẩn quốc tế.',
        'Combining academics with activities, skills and real-world experience to build an international-standard student profile.'
      ),
      isActive: true,
    },
    {
      icon: 'Network',
      title: t('Hệ sinh thái kết nối giáo dục', 'Connected education ecosystem'),
      description: t(
        'Phát triển môi trường học tập mở, kết nối nhà trường – gia đình – chuyên gia – đối tác quốc tế.',
        'An open learning environment connecting school, family, experts and international partners.'
      ),
      isActive: true,
    },
  ])

  // ============ Programs ============
  await seedCollection(CollectionNames.programs, [
    {
      slug: 'kindergarten',
      level: 'kindergarten',
      title: t('Chương trình Mầm non', 'Kindergarten programme'),
      shortDescription: t(
        'Nền tảng đầu đời từ Little People.',
        'Early foundations with Little People.'
      ),
      content: t(
        'Chương trình Mầm non từ Little People xây dựng nền tảng vững chắc cho hành trình học tập tiếp theo.',
        'The Little People kindergarten programme builds a strong foundation for the next learning journey.'
      ),
      ageRange: '3–5 tuổi',
      objectives: [],
      highlights: [],
      imageUrl: '',
      ctaUrl: '/vi/admissions',
      status: 'published',
      isActive: true,
    },
    {
      slug: 'elementary',
      level: 'elementary',
      title: t('Chương trình Tiểu học', 'Elementary programme'),
      shortDescription: t(
        'Xây dựng nền tảng học thuật quốc tế từ lớp 1 đến lớp 5.',
        'Building an international academic foundation from grade 1 to grade 5.'
      ),
      content: t(
        'Học sinh Tiểu học tại EPath được học theo chương trình Edmentum International, kết hợp cùng đội ngũ giáo viên và cố vấn học tập.',
        'Elementary students at EPath follow the Edmentum International curriculum, supported by qualified teachers and academic advisors.'
      ),
      ageRange: '6–10 tuổi',
      objectives: [],
      highlights: [],
      imageUrl: '',
      ctaUrl: '/vi/admissions',
      status: 'published',
      isActive: true,
    },
    {
      slug: 'middle',
      level: 'middle',
      title: t('Chương trình Trung học cơ sở', 'Middle school programme'),
      shortDescription: t(
        'Phát triển tư duy Toán – Khoa học và tiếng Anh học thuật từ lớp 6 đến lớp 8.',
        'Developing STEM thinking and academic English from grade 6 to grade 8.'
      ),
      content: t(
        'Giai đoạn Trung học cơ sở tập trung vào nền tảng tiếng Anh học thuật, tư duy Toán – Khoa học và kỹ năng tự học.',
        'The middle school phase focuses on academic English, STEM thinking and independent learning skills.'
      ),
      ageRange: '11–14 tuổi',
      objectives: [],
      highlights: [],
      imageUrl: '',
      ctaUrl: '/vi/admissions',
      status: 'published',
      isActive: true,
    },
    {
      slug: 'dual-diploma',
      level: 'high',
      title: t('Dual Diploma (Song bằng)', 'Dual Diploma'),
      shortDescription: t(
        'Học song song chương trình Việt Nam và Hoa Kỳ qua EdOptions Academy.',
        'Study both Vietnamese and US curricula via EdOptions Academy.'
      ),
      content: t(
        'Học sinh theo học đồng thời chương trình THPT Việt Nam và THPT Hoa Kỳ để nhận hai văn bằng tốt nghiệp.',
        'Students pursue both Vietnamese and US high school diplomas simultaneously.'
      ),
      ageRange: 'Lớp 9–12',
      objectives: [],
      highlights: [],
      imageUrl: '',
      ctaUrl: '/vi/admissions',
      status: 'published',
      isActive: true,
    },
    {
      slug: 'fulltime-homeschool',
      level: 'high',
      title: t('Fulltime Homeschool', 'Fulltime Homeschool'),
      shortDescription: t(
        'Học toàn thời gian chương trình THPT Hoa Kỳ qua EdOptions Academy.',
        'Full-time study of the US high school programme via EdOptions Academy.'
      ),
      content: t(
        'Lộ trình dành cho học sinh mong muốn theo học toàn thời gian chương trình Hoa Kỳ thay vì học song song.',
        'A pathway for students who want to study the US programme full-time.'
      ),
      ageRange: 'Lớp 9–12',
      objectives: [],
      highlights: [],
      imageUrl: '',
      ctaUrl: '/vi/admissions',
      status: 'published',
      isActive: true,
    },
    {
      slug: 'international-personalised',
      level: 'high',
      title: t('Lộ trình Quốc tế cá nhân hoá', 'Personalised international pathway'),
      shortDescription: t(
        'Kết nối các chương trình quốc tế uy tín cho giai đoạn THPT và chuẩn bị đại học.',
        'Connecting reputable international programmes for high school and university preparation.'
      ),
      content: t(
        'EPath đang mở rộng mạng lưới đối tác học thuật để mang đến nhiều lựa chọn hơn cho giai đoạn THPT và chuẩn bị đại học.',
        'EPath is expanding its academic network to bring more options for high school and university preparation.'
      ),
      ageRange: 'Lớp 9–12',
      objectives: [],
      highlights: [],
      imageUrl: '',
      ctaUrl: '/vi/admissions',
      status: 'published',
      isActive: true,
    },
  ])

  // ============ Partners ============
  await seedCollection(CollectionNames.partners, [
    {
      name: 'Edmentum International',
      logoUrl: '',
      website: 'https://www.edmentum.com',
      category: 'curriculum',
      description: t(
        'Đối tác chiến lược cung cấp nền tảng học thuật cho học sinh EPath.',
        'Strategic partner providing the academic platform for EPath students.'
      ),
      features: [],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Cambridge Assessment',
      logoUrl: '',
      website: 'https://www.cambridge.org',
      category: 'certification',
      description: t(
        'Chứng chỉ học thuật được công nhận toàn cầu.',
        'Globally recognised academic certifications.'
      ),
      features: [],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Cognia',
      logoUrl: '',
      website: 'https://www.cognia.org',
      category: 'certification',
      description: t(
        'Tổ chức kiểm định chất lượng giáo dục hàng đầu.',
        'Leading education quality accreditation body.'
      ),
      features: [],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'WASC',
      logoUrl: '',
      website: 'https://www.acswasc.org',
      category: 'certification',
      description: t(
        'Hiệp hội các trường và đại học phía Tây Hoa Kỳ.',
        'Western Association of Schools and Colleges.'
      ),
      features: [],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'FabLab',
      logoUrl: '',
      website: '',
      category: 'lab',
      description: t(
        'Phòng thí nghiệm sáng tạo và trải nghiệm công nghệ.',
        'Creative lab for hands-on technology experiences.'
      ),
      features: [],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'EdOptions Academy',
      logoUrl: '',
      website: '',
      category: 'curriculum',
      description: t(
        'Trường trực tuyến Hoa Kỳ cung cấp chương trình Dual Diploma và Fulltime Homeschool.',
        'US online school providing Dual Diploma and Fulltime Homeschool.'
      ),
      features: [],
      isFeatured: true,
      isActive: true,
    },
  ])

  // ============ FAQs ============
  await seedCollection(CollectionNames.faqs, [
    {
      question: t(
        'Chương trình EPath phù hợp với học sinh ở độ tuổi nào?',
        'What age group is EPath suitable for?'
      ),
      answer: t(
        'EPath cung cấp chương trình học từ Mầm non (3–5 tuổi) đến THPT (15–18 tuổi).',
        'EPath offers programmes from kindergarten (3–5) through high school (15–18).'
      ),
      category: 'general',
      isActive: true,
    },
    {
      question: t(
        'Con tôi đang học trường công/tư — có học EPath song song được không?',
        'My child attends a public/private school — can they study EPath in parallel?'
      ),
      answer: t(
        'Hoàn toàn có thể! EPath được thiết kế theo mô hình Blended Learning nên học sinh có thể học song song.',
        'Absolutely! EPath is built on a blended learning model that supports parallel study.'
      ),
      category: 'program',
      isActive: true,
    },
    {
      question: t(
        'Học phí và chính sách tài chính như thế nào?',
        'What about tuition and financial policies?'
      ),
      answer: t(
        'Học phí tại EPath được chia theo từng gói chương trình và cấp học. Vui lòng liên hệ để được tư vấn chi tiết.',
        'Tuition depends on the programme and level. Please contact us for details.'
      ),
      category: 'admissions',
      isActive: true,
    },
  ])

  // ============ Home sections ============
  await seedHomeSections()

  console.log('[seed] Done.')
}

main().catch((err) => {
  console.error('[seed] failed:', err)
  process.exit(1)
})