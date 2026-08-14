import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { isFirebaseAdminConfigured } from '@/lib/firebase-admin'
import type { Locale } from '@/lib/cms-types'

// Sample data for seeding CMS collections
const seedData = {
  coreValues: [
    {
      icon: 'Compass',
      title: { vi: 'Lộ trình liên tục', en: 'Continuous Pathway' },
      description: { vi: 'Học sinh được thiết kế lộ trình học tập cá nhân hóa, phù hợp với năng lực và mục tiêu của từng em.', en: 'Students receive personalized learning pathways tailored to their abilities and goals.' },
      order: 0,
      isActive: true,
    },
    {
      icon: 'Award',
      title: { vi: 'Chuẩn Hoa Kỳ', en: 'US Standards' },
      description: { vi: 'Chương trình giảng dạy theo chuẩn Common Core và các bài kiểm tra đạt chuẩn quốc tế.', en: 'Curriculum aligned with Common Core standards and internationally recognized assessments.' },
      order: 1,
      isActive: true,
    },
    {
      icon: 'Laptop',
      title: { vi: 'Học kết hợp', en: 'Blended Learning' },
      description: { vi: 'Kết hợp học trực tuyến linh hoạt với hướng dẫn trực tiếp từ giáo viên.', en: 'Flexible online learning combined with face-to-face teacher guidance.' },
      order: 2,
      isActive: true,
    },
    {
      icon: 'Shield',
      title: { vi: 'Phụ huynh an tâm', en: 'Parents Relax' },
      description: { vi: 'Theo dõi tiến độ học tập real-time, báo cáo chi tiết giúp phụ huynh yên tâm.', en: 'Real-time progress tracking and detailed reports give parents peace of mind.' },
      order: 3,
      isActive: true,
    },
    {
      icon: 'FileText',
      title: { vi: 'Hồ sơ năng lực', en: 'Portfolio' },
      description: { vi: 'Xây dựng hồ sơ năng lực toàn diện, chuẩn bị tốt cho việcapply vào các trường quốc tế.', en: 'Build comprehensive competency portfolios, well-prepared for international school applications.' },
      order: 4,
      isActive: true,
    },
    {
      icon: 'Network',
      title: { vi: 'Hệ sinh thái', en: 'Ecosystem' },
      description: { vi: 'Kết nối với hệ thống trường học, trung tâm đào tạo và đối tác giáo dục toàn cầu.', en: 'Connect with schools, training centers, and global education partners.' },
      order: 5,
      isActive: true,
    },
  ],
  statistics: [
    {
      value: '10',
      suffix: '+',
      label: { vi: 'Năm kinh nghiệm', en: 'Years Experience' },
      icon: 'TrendingUp',
      order: 0,
      isActive: true,
    },
    {
      value: '4',
      suffix: '',
      label: { vi: 'Cấp học', en: 'Education Levels' },
      icon: 'Layers',
      order: 1,
      isActive: true,
    },
    {
      value: '60',
      suffix: '+',
      label: { vi: 'Khóa học Edmentum', en: 'Edmentum Courses' },
      icon: 'BookOpen',
      order: 2,
      isActive: true,
    },
    {
      value: '3',
      suffix: '+',
      label: { vi: 'Đối tác quốc tế', en: 'International Partners' },
      icon: 'Globe',
      order: 3,
      isActive: true,
    },
    {
      value: '100',
      suffix: '%',
      label: { vi: 'Cá nhân hóa', en: 'Personalized' },
      icon: 'UserCheck',
      order: 4,
      isActive: true,
    },
  ],
  admissionSteps: [
    {
      title: { vi: 'Đánh giá năng lực', en: 'Assessment' },
      description: { vi: 'Bài đánh giá đầu vào để xác định trình độ và nhu cầu học tập của học sinh.', en: 'Entry assessment to determine student level and learning needs.' },
      icon: 'ClipboardCheck',
      order: 0,
      isActive: true,
    },
    {
      title: { vi: 'Thiết kế lộ trình', en: 'Pathway Design' },
      description: { vi: 'Xây dựng lộ trình học tập cá nhân hóa dựa trên kết quả đánh giá.', en: 'Create personalized learning pathway based on assessment results.' },
      icon: 'Map',
      order: 1,
      isActive: true,
    },
    {
      title: { vi: 'Học kết hợp', en: 'Blended Learning' },
      description: { vi: 'Kết hợp học trực tuyến và hướng dẫn trực tiếp theo lộ trình đã thiết kế.', en: 'Combine online learning with face-to-face guidance following the designed pathway.' },
      icon: 'Laptop',
      order: 2,
      isActive: true,
    },
    {
      title: { vi: 'Tư vấn định kỳ', en: 'Regular Advising' },
      description: { vi: 'Cuộc hẹn tư vấn định kỳ để theo dõi tiến độ và điều chỉnh kế hoạch.', en: 'Regular advising sessions to monitor progress and adjust plans.' },
      icon: 'MessageCircle',
      order: 3,
      isActive: true,
    },
    {
      title: { vi: 'Đạt thành tích', en: 'Achievement' },
      description: { vi: 'Đánh giá cuối khóa và cấp chứng chỉ hoàn thành chương trình.', en: 'End-of-course assessment and program completion certification.' },
      icon: 'Award',
      order: 4,
      isActive: true,
    },
  ],
  learningPathways: [
    {
      level: 'kindergarten',
      title: { vi: 'Mầm non', en: 'Kindergarten' },
      description: { vi: 'Chương trình mầm non phát triển toàn diện về ngôn ngữ, kỹ năng xã hội và tư duy sáng tạo.', en: 'Comprehensive kindergarten program developing language, social skills, and creative thinking.' },
      objectives: [
        { vi: 'Little People', en: 'Little People' },
        { vi: 'SpeedUp English', en: 'SpeedUp English' },
      ],
      order: 0,
      isActive: true,
    },
    {
      level: 'elementary',
      title: { vi: 'Tiểu học', en: 'Elementary' },
      description: { vi: 'Chương trình tiểu học theo chuẩn Common Core, xây dựng nền tảng vững chắc.', en: 'Elementary program aligned with Common Core standards, building a strong foundation.' },
      objectives: [
        { vi: 'Base Path', en: 'Base Path' },
        { vi: 'Prime Path', en: 'Prime Path' },
      ],
      order: 1,
      isActive: true,
    },
    {
      level: 'middle',
      title: { vi: 'THCS', en: 'Middle School' },
      description: { vi: 'Chương trình THCS chuẩn bị học sinh cho các bài kiểm tra quốc tế.', en: 'Middle school program preparing students for international assessments.' },
      objectives: [
        { vi: 'Base Path', en: 'Base Path' },
        { vi: 'Prime Path', en: 'Prime Path' },
        { vi: 'SpeedUp English', en: 'SpeedUp English' },
      ],
      order: 2,
      isActive: true,
    },
    {
      level: 'high',
      title: { vi: 'THPT', en: 'High School' },
      description: { vi: 'Chương trình THPT với các lựa chọn linh hoạt, chuẩn bị cho du học và đại học quốc tế.', en: 'Flexible high school program preparing for study abroad and international universities.' },
      objectives: [
        { vi: 'Dual Diploma', en: 'Dual Diploma' },
        { vi: 'Fulltime Homeschool', en: 'Fulltime Homeschool' },
      ],
      order: 3,
      isActive: true,
    },
  ],
  testimonials: [
    {
      name: 'Nguyễn Thị Minh Châu',
      role: 'Phụ huynh học sinh',
      avatarUrl: '',
      content: {
        vi: 'Con tôi đã cải thiện đáng kể kỹ năng tiếng Anh sau khi tham gia chương trình. Giáo viên rất tận tâm và chương trình học rất phù hợp.',
        en: 'My child has significantly improved English skills after joining the program. Teachers are very dedicated and the curriculum is very suitable.',
      },
      rating: 5,
      isFeatured: true,
      order: 0,
      isActive: true,
    },
    {
      name: 'Trần Văn Hùng',
      role: 'Phụ huynh học sinh',
      avatarUrl: '',
      content: {
        vi: 'Hệ thống báo cáo tiến độ rất chi tiết, giúp tôi theo dõi được việc học của con. Đội ngũ tư vấn luôn hỗ trợ kịp thời.',
        en: 'The progress reporting system is very detailed, helping me track my child\'s learning. The advisory team always supports promptly.',
      },
      rating: 5,
      isFeatured: true,
      order: 1,
      isActive: true,
    },
    {
      name: 'Lê Thị Mai Anh',
      role: 'Học sinh',
      avatarUrl: '',
      content: {
        vi: 'Tôi rất thích cách học kết hợp ở đây. Vừa học online thoải mái ở nhà, vừa có buổi học trực tiếp với giáo viên rất vui vẻ.',
        en: 'I really enjoy the blended learning approach here. I can study online comfortably at home and have face-to-face sessions with friendly teachers.',
      },
      rating: 5,
      isFeatured: false,
      order: 2,
      isActive: true,
    },
  ],
  siteSettings: [
    {
      address: { vi: 'Tầng 5, Tòa nhà EPath, 123 Nguyễn Trãi, Quận 1, TP.HCM', en: '5th Floor, EPath Building, 123 Nguyen Trai, District 1, HCMC' },
      phone: '028 1234 5678',
      email: 'contact@epath.edu.vn',
      hotline: '0901 234 567',
      zaloUrl: 'https://zalo.me/epath',
      facebookUrl: 'https://facebook.com/epatheducation',
      youtubeUrl: 'https://youtube.com/@epatheducation',
      workingHours: { vi: 'Thứ 2 - Thứ 6: 8:00 - 18:00', en: 'Mon - Fri: 8:00 AM - 6:00 PM' },
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.7!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzAwLjkiTiAxMDZCsDQyJzAwLjAiRQ!5e0!3m2!1sen!2s!4v1234567890',
      footerDescription: { vi: 'EPath Education - Nơi khơi nguồn tương lai. Đồng hành cùng học sinh Việt Nam trên con đường giáo dục quốc tế.', en: 'EPath Education - Igniting futures. Partnering with Vietnamese students on the path to international education.' },
      copyrightText: '© 2024 EPath Education. All rights reserved.',
    },
  ],
  aboutContent: [
    {
      introTitle: { vi: 'Về EPath Education', en: 'About EPath Education' },
      introContent: {
        vi: 'EPath Education là đơn vị giáo dục tiên phong trong việc đưa chương trình giáo dục chuẩn quốc tế đến với học sinh Việt Nam.\n\nChúng tôi tin rằng mỗi học sinh đều có tiềm năng đặc biệt và xứng đáng được tiếp cận với phương pháp giáo dục tốt nhất.\n\nVới đội ngũ giáo viên quốc tế và công nghệ học tập tiên tiến, EPath cam kết mang đến trải nghiệm giáo dục cá nhân hóa và hiệu quả.',
        en: 'EPath Education is a pioneering education provider bringing international standard programs to Vietnamese students.\n\nWe believe every student has unique potential and deserves access to the best educational methods.\n\nWith international teaching staff and advanced learning technology, EPath is committed to delivering personalized and effective educational experiences.',
      },
      visionTitle: { vi: 'Tầm nhìn', en: 'Our Vision' },
      visionContent: {
        vi: 'Trở thành hệ thống giáo dục hàng đầu Đông Nam Á, nơi mà mọi học sinh đều có thể phát triển toàn diện và đạt được ước mơ của mình thông qua giáo dục chất lượng quốc tế.',
        en: 'To become the leading education system in Southeast Asia, where every student can develop holistically and achieve their dreams through quality international education.',
      },
      missionTitle: { vi: 'Sứ mệnh', en: 'Our Mission' },
      missionContent: {
        vi: 'Cung cấp chương trình giáo dục chuẩn quốc tế, kết hợp với công nghệ học tập tiên tiến và đội ngũ giáo viên xuất sắc, giúp học sinh Việt Nam phát triển năng lực toàn cầu.',
        en: 'Deliver internationally accredited educational programs, combined with cutting-edge learning technology and outstanding faculty, helping Vietnamese students develop global competencies.',
      },
      milestones: JSON.stringify([
        { year: '2014', title: { vi: 'Thành lập', en: 'Founded' }, description: { vi: 'Khởi đầu với chương trình đào tạo tiếng Anh', en: 'Started with English training programs' } },
        { year: '2016', title: { vi: 'Hợp tác quốc tế', en: 'International Partnership' }, description: { vi: 'Ký kết hợp tác với Edmentum', en: 'Partnership with Edmentum' } },
        { year: '2018', title: { vi: 'Mở rộng quy mô', en: 'Scale Expansion' }, description: { vi: 'Mở chi nhánh tại Hà Nội và Đà Nẵng', en: 'Opened branches in Hanoi and Da Nang' } },
        { year: '2020', title: { vi: 'Chuyển đổi số', en: 'Digital Transformation' }, description: { vi: 'Ra mắt nền tảng học trực tuyến', en: 'Launched online learning platform' } },
        { year: '2024', title: { vi: 'Phát triển bền vững', en: 'Sustainable Growth' }, description: { vi: 'Đạt 5000+ học sinh toàn quốc', en: 'Reached 5000+ students nationwide' } },
      ]),
      heroImage: '',
    },
  ],
  heroContent: [
    {
      pageId: 'home',
      welcome: { vi: 'Chào mừng đến với', en: 'Welcome to' },
      title: { vi: 'EPath Education', en: 'EPath Education' },
      subtitle: { vi: 'Nơi khơi nguồn tương lai', en: 'Igniting Futures' },
      description: { vi: 'Chương trình giáo dục chuẩn quốc tế dành cho học sinh Việt Nam. Đồng hành cùng con trên con đường học tập quốc tế.', en: 'International standard education program for Vietnamese students. Partnering with your child on the path to international education.' },
      ctaLabel: { vi: 'Khám phá chương trình', en: 'Explore Programs' },
      ctaUrl: '#programs',
      secondaryCtaLabel: { vi: 'Liên hệ tư vấn', en: 'Contact Us' },
      secondaryCtaUrl: '#contact',
      videoUrl: '',
      videoThumbnail: '',
      backgroundImage: '',
      isActive: true,
    },
  ],
}

export async function POST() {
  if (!isFirebaseAdminConfigured) {
    return NextResponse.json(
      { error: 'Firebase Admin is not configured. Please set FIREBASE_ADMIN_* environment variables.' },
      { status: 500 }
    )
  }

  try {
    const db = getAdminDb()
    const results: Record<string, string[]> = { created: [], errors: [] }

    // Seed each collection
    for (const [collectionName, items] of Object.entries(seedData)) {
      try {
        for (const item of items as Record<string, unknown>[]) {
          const docRef = await db.collection(collectionName).add({
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          results.created.push(`${collectionName}: ${docRef.id}`)
        }
      } catch (err) {
        results.errors.push(`${collectionName}: ${(err as Error).message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed data created successfully',
      results,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed data', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed CMS data',
    collections: Object.keys(seedData),
  })
}
