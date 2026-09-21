import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { isFirebaseAdminConfigured } from '@/lib/firebase-admin'
import { CollectionNames } from '@/lib/cms-types'

// ============================================================
// Seed data – built from the canonical `data-content/` documents:
//   - Sitemap.html       (site information architecture)
//   - Nội dung website.html (full bilingual copy per section)
//   - Nội dung Brochure.html (Curriculum + admission details)
//   - Sheet2.html        (Extras / Hoạt động Ngoại khoá)
//
// Every collection provides both `vi` and `en` strings so the
// website stays consistent in either locale.
// ============================================================

type PageSectionSeed = {
  id: string
  type: string
  title: { vi: string; en: string }
  subtitle?: { vi: string; en: string }
  body?: { vi: string; en: string }
  order: number
  isActive: boolean
}

const pageSectionsSeed: Record<string, PageSectionSeed[]> = {
  home: [
    {
      id: 'home-hero',
      type: 'hero',
      title: { vi: 'EPath Education', en: 'EPath Education' },
      subtitle: {
        vi: 'Đưa giáo dục quốc tế chất lượng cao đến gần hơn với gia đình Việt',
        en: 'Bringing high-quality international education closer to Vietnamese families',
      },
      body: {
        vi: 'Chương trình học cá nhân hóa theo chuẩn Common Core (Mỹ) thông qua hệ sinh thái Edmentum International — được kiểm định bởi Cognia & WASC. Học sinh được tiếp cận Cambridge ESOL, FabLab EIU và lộ trình Dual Diploma toàn diện từ Mầm non đến THPT.',
        en: 'Personalised learning aligned with US Common Core standards via the Edmentum International ecosystem — accredited by Cognia & WASC. Students can also access Cambridge ESOL, FabLab EIU and the Dual Diploma pathway from Kindergarten through Grade 12.',
      },
      order: 0,
      isActive: true,
    },
    {
      id: 'home-intro',
      type: 'intro',
      title: { vi: 'Về EPath Education', en: 'About EPath Education' },
      subtitle: {
        vi: 'Lời mở đầu',
        en: 'Our story',
      },
      order: 1,
      isActive: true,
    },
    {
      id: 'home-featuredCourses',
      type: 'featuredCourses',
      title: { vi: 'Các khóa học nổi bật', en: 'Featured Programs' },
      order: 2,
      isActive: true,
    },
    {
      id: 'home-coreValues',
      type: 'coreValues',
      title: { vi: 'Giá trị cốt lõi', en: 'Core Values' },
      order: 3,
      isActive: true,
    },
    {
      id: 'home-testimonials',
      type: 'testimonials',
      title: { vi: 'Chia sẻ từ phụ huynh & học sinh', en: 'Testimonials' },
      order: 4,
      isActive: true,
    },
    {
      id: 'home-faqs',
      type: 'faqs',
      title: { vi: 'Câu hỏi thường gặp', en: 'FAQs' },
      order: 5,
      isActive: true,
    },
  ],
  about: [
    {
      id: 'about-hero',
      type: 'hero',
      title: { vi: 'EPath Education', en: 'EPath Education' },
      subtitle: {
        vi: 'Hành trình đồng hành cùng gia đình Việt',
        en: 'A journey alongside Vietnamese families',
      },
      body: {
        vi: 'Tầm nhìn, sứ mệnh và giá trị cốt lõi định hình cách chúng tôi xây dựng lộ trình học tập cá nhân hóa cho mỗi học sinh.',
        en: 'Our vision, mission and core values define how we build personalised learning pathways for every student.',
      },
      order: 0,
      isActive: true,
    },
    {
      id: 'about-intro',
      type: 'intro',
      title: { vi: 'Về EPath Education', en: 'About EPath Education' },
      subtitle: {
        vi: 'Lời mở đầu',
        en: 'Our story',
      },
      body: {
        vi: '<strong>Lời mở đầu:</strong> EPath Education được hình thành từ một câu hỏi rất thực của phụ huynh tại hệ thống Mầm non Little People sau hơn 10 năm vận hành: <em>"Sau Mầm non, con sẽ tiếp tục học theo lộ trình nào để không bị đứt gãy?"</em><br/><br/>Từ nhu cầu đó, EPath ra đời như một lời giải có hệ thống — không chỉ là một chương trình học, mà là một lộ trình giáo dục xuyên suốt từ Tiểu học đến Trung học, giúp học sinh tiếp cận sớm với nền tảng học thuật quốc tế.<br/><br/>EPath được xây dựng trên niềm tin rằng: Một nền giáo dục hiệu quả không chỉ dừng lại ở việc truyền đạt kiến thức, mà cần tạo ra một hệ sinh thái học tập — nơi nhà trường, gia đình và các chuyên gia cùng đồng hành.<br/><br/>Thông qua mô hình học tập Blended Learning (kết hợp Trực tuyến và Trực tiếp), cùng Tổ chức giáo dục Edmentum International (USA) – được kiểm định bởi Cognia và WASC, EPath triển khai chương trình chuẩn hóa theo tiêu chuẩn quốc tế, đồng thời xây dựng cộng đồng phụ huynh có cùng định hướng & mục tiêu giáo dục.<br/><br/>Với đội ngũ giáo viên và cố vấn học tập chuyên môn cao, EPath tập trung phát triển năng lực học thuật, kỹ năng tự học và tư duy thế kỷ 21, giúp học sinh sẵn sàng chinh phục các chương trình quốc tế, đạt các chứng chỉ học thuật và hướng đến mục tiêu dài hạn là hội nhập vào môi trường giáo dục toàn cầu.',
        en: '<strong>Opening:</strong> EPath Education was born from a real question asked by parents at the Little People Kindergarten system after 10+ years of operation: <em>"After Kindergarten, what pathway should our child follow so it doesn\'t break?"</em><br/><br/>From that need, EPath was created as a systematic answer — not just a curriculum but a continuous educational journey from Elementary through High School.<br/><br/>EPath is built on the belief that an effective education is not only about knowledge transfer — it must create a learning ecosystem where school, family and experts walk together.<br/><br/>Through the Blended Learning model (online + on-site) and in partnership with Edmentum International (USA) — accredited by Cognia and WASC — EPath delivers internationally standardised programmes and a community of families with shared educational direction.<br/><br/>With a highly qualified teaching team and academic advisors, EPath focuses on academic competency, self-learning skills and 21st-century thinking — preparing students for international programmes, academic certifications and long-term global integration.',
      },
      order: 1,
      isActive: true,
    },
    {
      id: 'about-vision',
      type: 'vision',
      title: { vi: 'Tầm nhìn (Vision)', en: 'Our Vision' },
      body: {
        vi: 'EPath hướng đến trở thành một giải pháp giáo dục toàn diện, nơi học sinh và phụ huynh được tiếp cận với định hướng giáo dục Phổ thông quốc tế một cách hiệu quả, rõ ràng và bền vững về chi phí.<br/><br/>EPath không chỉ cung cấp chương trình học, mà xây dựng một hành trình giáo dục xuyên suốt, kết nối giữa nhà trường, gia đình và các nguồn lực giáo dục trong và ngoài nước.<br/><br/><strong>Định hướng của EPath là: Đưa giáo dục quốc tế chất lượng cao trở nên dễ tiếp cận hơn với nhiều gia đình Việt Nam.</strong>',
        en: 'EPath strives to become a holistic education solution that gives students and families efficient, transparent and cost-sustainable access to international-standard schooling — connecting school, family and educational resources at home and abroad.<br/><br/><strong>Our direction: Making high-quality international education more accessible to many Vietnamese families.</strong>',
      },
      order: 2,
      isActive: true,
    },
    {
      id: 'about-mission',
      type: 'mission',
      title: { vi: 'Sứ mệnh (Mission)', en: 'Our Mission' },
      body: {
        vi: 'Xây dựng một môi trường giáo dục kết nối giữa nhà trường – gia đình – chuyên gia, nơi học sinh được tiếp cận chương trình học chuẩn quốc tế, đồng thời tham gia các hoạt động học thuật, trải nghiệm và định hướng kỹ năng.<br/><br/>EPath cam kết đồng hành cùng phụ huynh trong việc phát triển toàn diện cho học sinh, không chỉ trong học tập mà còn trong năng lực tự học, tư duy và kỹ năng sống.',
        en: 'Build an educational environment that connects school – family – experts, where every student accesses international-standard curricula and engages in academic, experiential and skill-oriented programmes.<br/><br/>EPath partners with families to develop the whole learner — academically, intellectually and in life skills.',
      },
      order: 3,
      isActive: true,
    },
    {
      id: 'about-coreValues',
      type: 'coreValues',
      title: { vi: 'Giá trị cốt lõi', en: 'Our Core Values' },
      order: 4,
      isActive: true,
    },
    {
      id: 'about-learningPathways',
      type: 'learningPathways',
      title: { vi: 'Lộ trình học tập tại EPath', en: 'EPath Learning Pathway' },
      body: {
        vi: '<strong>Giai đoạn nền tảng: Mầm non đến hết lớp 8.</strong> Trong những năm đầu đời và giai đoạn Tiểu học – Trung học cơ sở, mục tiêu quan trọng nhất không phải là bằng cấp mà là xây dựng những năng lực cốt lõi giúp học sinh sẵn sàng cho các môi trường học tập quốc tế trong tương lai.<br/><br/>Tại EPath, học sinh được tập trung phát triển: Nền tảng tiếng Anh học thuật · Tư duy Toán học và Khoa học · Kỹ năng học tập độc lập · Tư duy phản biện và giải quyết vấn đề · Khả năng thích nghi với môi trường quốc tế.<br/><br/><strong>Giai đoạn định hướng chuyên sâu: Từ lớp 9 trở lên.</strong> Từ lớp 9, các yêu cầu về tín chỉ, bằng cấp, hồ sơ học thuật và định hướng đại học bắt đầu trở nên chuyên sâu hơn. Đây cũng là giai đoạn EPath phối hợp cùng gia đình đánh giá năng lực, mục tiêu học tập và định hướng tương lai của từng học sinh để lựa chọn lộ trình phù hợp.',
        en: '<strong>Foundation stage: Kindergarten through Grade 8.</strong> The most important goal in the early years and Elementary–Middle School years is not a diploma but building core competencies that prepare students for future international learning environments.<br/><br/>At EPath, learners develop: Academic English foundations · Mathematical and scientific thinking · Independent learning skills · Critical thinking and problem solving · Adaptability to international environments.<br/><br/><strong>Specialised stage: From Grade 9 upwards.</strong> From Grade 9, credit, diploma, academic portfolio and university-orientation requirements become more specialised. EPath cooperates with each family to assess ability, learning goals and future plans so the right pathway can be selected.',
      },
      order: 5,
      isActive: true,
    },
    {
      id: 'about-statistics',
      type: 'statistics',
      title: { vi: 'EPath qua những con số', en: 'EPath at a Glance' },
      order: 6,
      isActive: true,
    },
    {
      id: 'about-achievements',
      type: 'achievements',
      title: { vi: 'Thành tích vượt trội', en: 'Achievements' },
      body: {
        vi: 'Trong suốt quá trình học tập tại EPath, học sinh đã đạt được nhiều thành tích nổi bật trong các kỳ thi và chứng chỉ quốc tế, qua đó khẳng định năng lực học thuật và khả năng thích ứng trong môi trường giáo dục toàn cầu. Những kết quả này là minh chứng cho sự phát triển toàn diện về tư duy, kỹ năng học tập và mức độ sẵn sàng trong môi trường giáo dục quốc tế.',
        en: 'Throughout their learning journey at EPath, students have achieved notable results in international exams and certifications — confirming academic competency and adaptability in a global education environment.',
      },
      order: 7,
      isActive: true,
    },
    {
      id: 'about-cta',
      type: 'cta',
      title: { vi: 'Cùng EPath xây dựng lộ trình cho con', en: 'Build your child\'s pathway with EPath' },
      order: 8,
      isActive: true,
    },
  ],
  programs: [
    {
      id: 'programs-hero',
      type: 'hero',
      title: { vi: 'Lộ trình học tập K–12', en: 'K–12 Learning Pathways' },
      subtitle: {
        vi: 'Chương trình cá nhân hóa cho mọi cấp học',
        en: 'Personalised programmes for every grade level',
      },
      body: {
        vi: 'Khám phá các chương trình từ Mầm non đến THPT theo chuẩn Common Core & Cambridge.',
        en: 'Discover programmes from Kindergarten to Grade 12 aligned with US Common Core and Cambridge standards.',
      },
      order: 0,
      isActive: true,
    },
    {
      id: 'programs-intro',
      type: 'intro',
      title: { vi: 'Lộ trình học tập', en: 'Learning Pathway' },
      body: {
        vi: '<strong>Tại EPath Education,</strong> chúng tôi hiểu rằng nhiều gia đình mong muốn con được tiếp cận nền giáo dục quốc tế chất lượng cao nhưng vẫn còn những rào cản về chi phí, khoảng cách địa lý, tính linh hoạt và khả năng theo học lâu dài.<br/><br/>Vì vậy, EPath lựa chọn một hướng tiếp cận bền vững hơn: <strong>xây dựng lộ trình học tập quốc tế xuyên suốt từ Mầm non đến Trung học Phổ thông</strong>, giúp học sinh từng bước phát triển nền tảng học thuật, kỹ năng học tập và năng lực hội nhập toàn cầu trước khi bước vào những lựa chọn chuyên sâu như Song bằng, Tú tài Quốc tế, du học hoặc các chương trình đại học quốc tế.',
        en: '<strong>At EPath Education,</strong> we understand that many Vietnamese families want access to high-quality international education but face barriers around cost, geography, flexibility and long-term commitment.<br/><br/>That\'s why EPath takes a more sustainable approach: build a continuous international learning pathway from Kindergarten through Grade 12 so students progressively develop academic foundations, learning skills and global-readiness competencies before pursuing specialised options like Dual Diploma, international baccalaureate, study abroad or international university programmes.',
      },
      order: 1,
      isActive: true,
    },
    {
      id: 'programs-pathways',
      type: 'learningPathways',
      title: { vi: 'Lộ trình 4 cấp học', en: 'Four Learning Stages' },
      order: 2,
      isActive: true,
    },
    {
      id: 'programs-cta',
      type: 'cta',
      title: { vi: 'Bắt đầu hành trình K–12 cùng EPath', en: 'Begin your K–12 journey with EPath' },
      order: 3,
      isActive: true,
    },
  ],
  partners: [
    {
      id: 'partners-hero',
      type: 'hero',
      title: { vi: 'Hệ sinh thái đối tác', en: 'Our Partner Ecosystem' },
      subtitle: {
        vi: 'Các tổ chức uy tín đồng hành cùng EPath',
        en: 'Trusted organisations partnering with EPath',
      },
      body: {
        vi: 'Edmentum International, Cambridge Assessment, Cognia & WASC và các đối tác giáo dục khác giúp học sinh tiếp cận chuẩn quốc tế.',
        en: 'Edmentum International, Cambridge Assessment, Cognia & WASC and other partners help students access international standards.',
      },
      order: 0,
      isActive: true,
    },
    {
      id: 'partners-partners',
      type: 'partners',
      title: { vi: 'Đối tác giáo dục', en: 'Our Partners' },
      order: 1,
      isActive: true,
    },
    {
      id: 'partners-cta',
      type: 'cta',
      title: { vi: 'Trở thành đối tác của EPath', en: 'Partner with EPath' },
      order: 2,
      isActive: true,
    },
  ],
  admissions: [
    {
      id: 'admissions-hero',
      type: 'hero',
      title: { vi: 'Bắt đầu hành trình cùng EPath', en: 'Begin your journey with EPath' },
      subtitle: {
        vi: 'Đăng ký tư vấn miễn phí',
        en: 'Register for a free consultation',
      },
      body: {
        vi: 'EPath cam kết đồng hành cùng gia đình xuyên suốt quá trình tuyển sinh — từ tư vấn lộ trình đến nhập học.',
        en: 'EPath walks with your family throughout the admissions process — from pathway advising to enrolment.',
      },
      order: 0,
      isActive: true,
    },
    {
      id: 'admission-steps',
      type: 'admissionSteps',
      title: { vi: 'Quy trình tuyển sinh', en: 'Admissions Process' },
      body: {
        vi: '<strong>Mô hình Blended Learning 5 bước</strong> giúp học sinh được đánh giá chuẩn quốc tế, xây dựng lộ trình cá nhân hóa, học tập hiệu quả, đồng hành xuyên suốt và ghi nhận thành tích liên tục.',
        en: '<strong>5-step Blended Learning model</strong> — international-standard assessment, personalised pathway planning, effective learning, continuous advising and ongoing achievement.',
      },
      order: 1,
      isActive: true,
    },
    {
      id: 'admissions-faqs',
      type: 'faqs',
      title: { vi: 'Câu hỏi thường gặp', en: 'Frequently Asked Questions' },
      order: 2,
      isActive: true,
    },
    {
      id: 'admissions-cta',
      type: 'cta',
      title: { vi: 'Đăng ký tư vấn', en: 'Register now' },
      order: 3,
      isActive: true,
    },
  ],
  events: [
    {
      id: 'events-hero',
      type: 'hero',
      title: { vi: 'Sự kiện nổi bật', en: 'Featured Events' },
      subtitle: {
        vi: 'Workshop, hội thảo & ngày hội giáo dục',
        en: 'Workshops, seminars & education fairs',
      },
      body: {
        vi: 'Cập nhật các sự kiện giáo dục, workshop trải nghiệm và chương trình cố vấn học thuật từ EPath.',
        en: 'Stay up to date with EPath education events, hands-on workshops and academic advising programmes.',
      },
      order: 0,
      isActive: true,
    },
    {
      id: 'events-cta',
      type: 'cta',
      title: { vi: 'Đồng hành cùng các sự kiện của EPath', en: 'Join EPath\'s events' },
      order: 1,
      isActive: true,
    },
  ],
}

const seedData = {
  // ----------------------------------------------------------
  // CORE VALUES  (from "Nội dung website" → "Giá trị cốt lõi")
  // ----------------------------------------------------------
  coreValues: [
    {
      icon: 'Route',
      title: {
        vi: 'Lộ trình học tập xuyên suốt',
        en: 'Continuous Learning Pathway',
      },
      description: {
        vi: 'Xây dựng hành trình học tập liền mạch từ nền tảng Mầm non (Little People) đến Trung học Phổ thông, đảm bảo tính liên tục và nhất quán trong phát triển học thuật.',
        en: 'A seamless learning journey from Kindergarten (Little People) through High School, ensuring continuity and consistency in academic development.',
      },
      order: 0,
      isActive: true,
    },
    {
      icon: 'BadgeCheck',
      title: {
        vi: 'Chuẩn học thuật quốc tế được kiểm định',
        en: 'Accredited International Academic Standards',
      },
      description: {
        vi: 'Triển khai chương trình hợp tác với tổ chức giáo dục Edmentum International (USA), được kiểm định bởi Cognia và WASC, đảm bảo chất lượng và giá trị công nhận toàn cầu.',
        en: 'Delivered in partnership with Edmentum International (USA) — accredited by Cognia and WASC — guaranteeing globally recognized quality and value.',
      },
      order: 1,
      isActive: true,
    },
    {
      icon: 'Layers',
      title: {
        vi: 'Mô hình học tập kết hợp (Blended Learning)',
        en: 'Blended Learning Model',
      },
      description: {
        vi: 'Tích hợp linh hoạt giữa học trực tuyến và trực tiếp, tối ưu hiệu quả tiếp thu và cá nhân hóa trải nghiệm học tập.',
        en: 'A flexible mix of online and in-person learning that maximizes comprehension and personalises the learning experience.',
      },
      order: 2,
      isActive: true,
    },
    {
      icon: 'UserRoundCheck',
      title: {
        vi: 'Cá nhân hóa lộ trình học tập',
        en: 'Personalised Learning Pathways',
      },
      description: {
        vi: 'Thiết kế lộ trình dựa trên năng lực, mục tiêu và định hướng của từng học sinh, thông qua hệ thống đánh giá học thuật và tư vấn chuyên sâu.',
        en: 'Pathways tailored to each learner\'s ability, goals and aspirations, supported by rigorous academic assessment and dedicated advising.',
      },
      order: 3,
      isActive: true,
    },
    {
      icon: 'BookOpenCheck',
      title: {
        vi: 'Phát triển năng lực toàn diện & hồ sơ cá nhân',
        en: 'Holistic Competencies & Student Portfolio',
      },
      description: {
        vi: 'Kết hợp học thuật với hoạt động ngoại khóa, kỹ năng và trải nghiệm thực tiễn nhằm xây dựng student profile chuẩn quốc tế, nâng cao lợi thế cạnh tranh trong tuyển sinh toàn cầu.',
        en: 'Pairing academics with extracurriculars, soft skills and real-world experiences to build an international-standard student portfolio and a competitive edge in global admissions.',
      },
      order: 4,
      isActive: true,
    },
    {
      icon: 'Network',
      title: {
        vi: 'Hệ sinh thái kết nối giáo dục',
        en: 'Connected Educational Ecosystem',
      },
      description: {
        vi: 'Phát triển môi trường học tập mở, kết nối nhà trường – gia đình – chuyên gia – đối tác quốc tế, mở rộng cơ hội học tập thông qua workshop, hoạt động trải nghiệm và định hướng giáo dục.',
        en: 'An open learning environment that connects school – family – experts – international partners, broadening opportunities through workshops, hands-on experiences and educational guidance.',
      },
      order: 5,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // TEAM MEMBERS / FACULTY & ACADEMIC BOARD
  // ----------------------------------------------------------
  teamMembers: [
    {
      name: {
        vi: '50% Giáo viên Quốc tế',
        en: '50% International Teachers',
      },
      tag: {
        vi: 'Giảng dạy bằng Tiếng Anh 100%',
        en: '100% English Instruction',
      },
      role: {
        vi: 'Giáo viên Quốc tế',
        en: 'International Faculty',
      },
      bio: {
        vi: 'Ưu tiên có bằng Cử nhân Giáo dục Tiểu học hoặc Trung học (Elementary / Secondary Education), dày dặn kinh nghiệm giảng dạy các môn học thuật (Academic Subjects) theo chuẩn giáo dục Hoa Kỳ và Cambridge.',
        en: 'Prioritised with Bachelor of Elementary or Secondary Education, extensive experience teaching academic subjects under US and Cambridge standards.',
      },
      point1: {
        vi: 'Trực tiếp giảng dạy các tiết học trực tuyến và trực tiếp về Toán, Khoa học, Ngữ văn Anh (ELA).',
        en: 'Directly teaches online and in-person lessons in Math, Science, and English Language Arts (ELA).',
      },
      point2: {
        vi: 'Hình thành phản xạ ngôn ngữ tự nhiên, ngữ âm chuẩn xác và tư duy phản biện cho học sinh.',
        en: 'Cultivates natural language reflexes, accurate phonics, and critical thinking skills for students.',
      },
      avatarUrl: '/images/about/faculty-international.jpg',
      order: 0,
      isActive: true,
      status: 'PUBLISHED',
    },
    {
      name: {
        vi: '50% Giáo viên Song ngữ',
        en: '50% Bilingual Teachers',
      },
      tag: {
        vi: 'IELTS 7.0+ & Chuyên môn Sư phạm',
        en: 'IELTS 7.0+ & Pedagogical Expertise',
      },
      role: {
        vi: 'Giáo viên Song ngữ',
        en: 'Bilingual Faculty',
      },
      bio: {
        vi: 'Đội ngũ thầy cô Việt Nam sở hữu chứng chỉ IELTS từ 7.0 trở lên, có năng lực tiếng Anh học thuật xuất sắc và thấu hiểu sâu sắc đặc điểm tâm lý, rào cản ngôn ngữ của học sinh Việt Nam.',
        en: "Vietnamese faculty holding IELTS 7.0+, possessing excellent academic English proficiency and deep empathy for Vietnamese learners' language barriers.",
      },
      point1: {
        vi: 'Đồng hành hướng dẫn, giải thích các khái niệm học thuật khó và củng cố kiến thức cho từng bạn.',
        en: 'Accompanies learners, explains complex academic concepts, and reinforces key knowledge.',
      },
      point2: {
        vi: 'Hỗ trợ cá nhân hóa việc học, tổ chức các buổi phụ đạo (tutor) nhằm lấp đầy lỗ hổng kiến thức kịp thời.',
        en: 'Supports personalised learning, providing tutoring sessions to bridge knowledge gaps promptly.',
      },
      avatarUrl: '/images/about/faculty-bilingual.jpg',
      order: 1,
      isActive: true,
      status: 'PUBLISHED',
    },
    {
      name: {
        vi: 'Cố vấn Học thuật (Academic Advisor)',
        en: 'Academic Advisors',
      },
      tag: {
        vi: 'Đồng hành Cá nhân hóa 1:1',
        en: '1:1 Personalised Mentorship',
      },
      role: {
        vi: 'Cố vấn Học thuật',
        en: 'Academic Advisor',
      },
      bio: {
        vi: 'Mỗi học sinh tại EPath được phân công riêng một Cố vấn Học thuật theo sát toàn bộ quá trình học tập, quản lý tiến độ hoàn thành bài học trên hệ thống Edmentum, và là cầu nối vững chắc với phụ huynh.',
        en: 'Each EPath student is assigned a dedicated Academic Advisor to oversee their learning pathway, manage Edmentum progress, and maintain close partnership with parents.',
      },
      point1: {
        vi: 'Đánh giá năng lực định kỳ, phát hiện điểm mạnh và tư vấn lựa chọn môn học / môn AP phù hợp.',
        en: 'Periodic capability assessments, identifying strengths, and advising on course / AP subject selection.',
      },
      point2: {
        vi: 'Đại diện phụ huynh theo dõi tiến trình học thuật và xây dựng hồ sơ ứng tuyển đại học quốc tế.',
        en: 'Represents parents in tracking academic milestones and crafting competitive global university portfolios.',
      },
      avatarUrl: '/images/about/faculty-advisors.jpg',
      order: 2,
      isActive: true,
      status: 'PUBLISHED',
    },
  ],

  // ----------------------------------------------------------
  // STATISTICS
  // ----------------------------------------------------------
  statistics: [
    {
      value: '10',
      suffix: '+',
      label: {
        vi: 'Năm kinh nghiệm từ hệ thống Little People',
        en: 'Years of experience (Little People legacy)',
      },
      icon: 'TrendingUp',
      order: 0,
      isActive: true,
    },
    {
      value: '4',
      suffix: '',
      label: {
        vi: 'Cấp học: Mầm non – THPT',
        en: 'Education levels: K – 12',
      },
      icon: 'Layers',
      order: 1,
      isActive: true,
    },
    {
      value: '60',
      suffix: '+',
      label: {
        vi: 'Khóa học Edmentum chuẩn quốc tế',
        en: 'Edmentum international courses',
      },
      icon: 'BookOpen',
      order: 2,
      isActive: true,
    },
    {
      value: '3',
      suffix: '+',
      label: {
        vi: 'Đối tác chiến lược quốc tế (Edmentum, Cambridge ESOL, FabLab EIU)',
        en: 'International strategic partners (Edmentum, Cambridge ESOL, FabLab EIU)',
      },
      icon: 'Globe',
      order: 3,
      isActive: true,
    },
    {
      value: '100',
      suffix: '%',
      label: {
        vi: 'Lộ trình học tập cá nhân hóa',
        en: 'Personalised learning pathways',
      },
      icon: 'UserCheck',
      order: 4,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // ADMISSION STEPS  (5-step Blended Learning model)
  // ----------------------------------------------------------
  admissionSteps: [
    {
      title: {
        vi: 'Tiếp Nhận & Tư Vấn Định Hướng',
        en: 'Enquiry & Initial Consultation',
      },
      description: {
        vi: 'Chuyên viên học vụ lắng nghe mục tiêu của gia đình, phân tích nguyện vọng học thuật và gợi ý lộ trình phù hợp theo từng độ tuổi (Phản hồi trong 24h).',
        en: 'Advisors understand family academic goals and recommend tailored educational pathways for each age group (Within 24 hours).',
      },
      icon: 'PhoneCall',
      imageUrl: '/images/admissions/admissions-consultation.jpg',
      order: 0,
      stepNumber: 1,
      isActive: true,
    },
    {
      title: {
        vi: 'Đánh Giá Năng Lực Chuẩn Quốc Tế',
        en: 'International Diagnostic Test',
      },
      description: {
        vi: 'Học sinh thực hiện bài khảo sát năng lực (Exact Path Diagnostic) đo lường chính xác trình độ tiếng Anh học thuật và tư duy số học chuẩn Mỹ (Khảo sát 45 - 60 phút).',
        en: 'Learners complete the Exact Path test objectively measuring academic English and US Common Core mathematics (45-60 min test).',
      },
      icon: 'FileCheck2',
      imageUrl: '/images/admissions/admissions-assessment.jpg',
      order: 1,
      stepNumber: 2,
      isActive: true,
    },
    {
      title: {
        vi: 'Thiết Kế Lộ Trình & Thời Khóa Biểu',
        en: 'Curriculum & Schedule Customization',
      },
      description: {
        vi: 'Ban học vụ xây dựng thời khóa biểu kết hợp (Online + Onsite Campus), cân đối số giờ học, phân bổ môn học và chọn chứng chỉ mục tiêu.',
        en: 'Academic Board plans an optimal blended schedule balancing school subjects, workload, and credential targets.',
      },
      icon: 'GraduationCap',
      imageUrl: '/images/programs/program-dual-diploma.jpg',
      order: 2,
      stepNumber: 3,
      isActive: true,
    },
    {
      title: {
        vi: 'Học Thử & Kích Hoạt Tài Khoản',
        en: 'Campus Trial & Account Activation',
      },
      description: {
        vi: 'Học sinh trải nghiệm lớp học trực tuyến trên hệ thống Edmentum và cơ sở vật chất campus, nhận tài khoản học tập chính thức (Kích hoạt tức thì).',
        en: 'Students experience digital lessons on the Edmentum platform and campus facilities, receiving official credentials (Instant activation).',
      },
      icon: 'Laptop',
      imageUrl: '/images/admissions/admissions-campus.jpg',
      order: 3,
      stepNumber: 4,
      isActive: true,
    },
    {
      title: {
        vi: 'Đồng Hành Học Thuật & Bằng Tú Tài Mỹ',
        en: 'Academic Mentorship & US Diploma',
      },
      description: {
        vi: 'Cố vấn học thuật theo sát 1:1, báo cáo tiến độ định kỳ cho phụ huynh, hướng dẫn tích lũy tín chỉ và nhận Bằng Tú tài Mỹ Cognia & WASC.',
        en: '1:1 Academic Advisor oversees progress, provides regular reports to parents, and guides students towards the Cognia & WASC US Diploma.',
      },
      icon: 'Award',
      imageUrl: '/images/about/about-achievements.jpg',
      order: 4,
      stepNumber: 5,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // LEARNING PATHWAYS
  // ----------------------------------------------------------
  learningPathways: [
    {
      level: 'kindergarten',
      step: '01',
      title: {
        vi: 'Giai đoạn Mầm non (3 – 6 tuổi)',
        en: 'Kindergarten Stage (Ages 3–6)',
      },
      subtitle: {
        vi: 'Khởi đầu tự nhiên – Thẩm thấu ngôn ngữ & Tư duy sớm',
        en: 'Natural Start – Language Immersion & Early Thinking',
      },
      description: {
        vi: 'Khởi đầu tự nhiên – Thẩm thấu ngôn ngữ & Tư duy sớm',
        en: 'Natural Start – Language Immersion & Early Thinking',
      },
      modelTag: {
        vi: 'Mô hình: Song ngữ tương tác · Phonics & Toán sớm · Chuẩn bị Lớp 1',
        en: 'Model: Interactive Bilingual · Phonics & Early Math · Grade 1 Ready',
      },
      badges: 'Cambridge English, Topic-based Learning, Early Literacy, Early Math',
      objectives: ['Cambridge English', 'Topic-based Learning', 'Early Literacy', 'Early Math'],
      outcomes: {
        vi: 'Làm quen tiếng Anh tự nhiên như ngôn ngữ thứ hai\nPhát triển phát âm, ngữ âm Phonics chuẩn xác\nLàm quen tư duy số học, hình khối, logic cơ bản\nHình thành sự tự tin trong giao tiếp môi trường song ngữ',
        en: 'Acquire English naturally as a second language\nDevelop standard phonics and pronunciation\nIntroduction to early numeracy and logical thinking\nBuild confidence in bilingual communication',
      },
      imageUrl: '/images/programs/program-kindy.jpg',
      ctaUrl: '/vi/admissions?program=kindergarten',
      order: 0,
      isActive: true,
      status: 'PUBLISHED',
    },
    {
      level: 'elementary',
      step: '02',
      title: {
        vi: 'Giai đoạn Tiểu học (Lớp 1 – 5)',
        en: 'Elementary Stage (Grades 1–5)',
      },
      subtitle: {
        vi: 'Nền tảng Học thuật – Toán & Khoa học bằng Tiếng Anh',
        en: 'Academic Foundation – Math & Science in English',
      },
      description: {
        vi: 'Nền tảng Học thuật – Toán & Khoa học bằng Tiếng Anh',
        en: 'Academic Foundation – Math & Science in English',
      },
      modelTag: {
        vi: 'Mô hình: 5 giờ/tuần (Online + Onsite) · 50% GV Quốc tế + 50% GV Song ngữ',
        en: "Model: 5 hrs/wk (Online + Onsite) · 50% Int'l + 50% Bilingual Faculty",
      },
      badges: 'Edmentum Core, Cambridge Primary, STEM & Robotics, Academic Reading',
      objectives: ['Edmentum Core', 'Cambridge Primary', 'STEM & Robotics', 'Academic Reading'],
      outcomes: {
        vi: 'Tiếng Anh học thuật chuẩn khung Cambridge Primary\nToán và Khoa học chuẩn Mỹ (US Common Core Standards)\nPhương pháp học tập độc lập & làm việc nhóm\nĐạt chứng chỉ Cambridge Starters / Movers / Flyers',
        en: 'Academic English aligned with Cambridge Primary framework\nUS Common Core-aligned Math and Science\nIndependent learning habits and collaborative teamwork\nAchieve Cambridge Starters / Movers / Flyers certifications',
      },
      imageUrl: '/images/programs/program-elementary.jpg',
      ctaUrl: '/vi/admissions?program=elementary',
      order: 1,
      isActive: true,
      status: 'PUBLISHED',
    },
    {
      level: 'middle',
      step: '03',
      title: {
        vi: 'Giai đoạn THCS (Lớp 6 – 8)',
        en: 'Middle School Stage (Grades 6–8)',
      },
      subtitle: {
        vi: 'Tư duy Phản biện & Kỹ năng Nghiên cứu Học thuật',
        en: 'Critical Thinking & Academic Research Skills',
      },
      description: {
        vi: 'Tư duy Phản biện & Kỹ năng Nghiên cứu Học thuật',
        en: 'Critical Thinking & Academic Research Skills',
      },
      modelTag: {
        vi: 'Mô hình: 5–6 giờ/tuần · Chinh phục IELTS 5.5+ · Tích lũy tín chỉ Tú tài Mỹ',
        en: 'Model: 5–6 hrs/wk · IELTS 5.5+ Target · Accumulate US Credits from Grade 8',
      },
      badges: 'Edmentum Middle School, KET / PET / IELTS Foundation, Critical Thinking',
      objectives: ['Edmentum Middle School', 'KET / PET / IELTS Foundation', 'Critical Thinking'],
      outcomes: {
        vi: 'Đọc hiểu và viết luận học thuật chuyên sâu\nTư duy phản biện, giải quyết vấn đề và thuyết trình\nSẵn sàng tích lũy tín chỉ THPT quốc tế\nXây dựng Student Portfolio cá nhân hóa',
        en: 'Advanced academic reading comprehension and essay writing\nCritical thinking, problem-solving, and presentation skills\nReadiness for US high school credit accumulation\nDevelop an individualized Student Portfolio',
      },
      imageUrl: '/images/programs/program-middle.jpg',
      ctaUrl: '/vi/admissions?program=middle',
      order: 2,
      isActive: true,
      status: 'PUBLISHED',
    },
    {
      level: 'high',
      step: '04',
      title: {
        vi: 'Giai đoạn THPT (Lớp 9 – 12)',
        en: 'High School Stage (Grades 9–12)',
      },
      subtitle: {
        vi: 'Song bằng Hoa Kỳ & Định hướng Đại học Toàn cầu',
        en: 'US Dual Diploma & Global University Pathways',
      },
      description: {
        vi: 'Song bằng Hoa Kỳ & Định hướng Đại học Toàn cầu',
        en: 'US Dual Diploma & Global University Pathways',
      },
      modelTag: {
        vi: 'Mô hình: Bằng Tú tài Mỹ Cognia & WASC · Tín chỉ AP College Board · IELTS 7.0+',
        en: 'Model: Cognia & WASC US Diploma · AP College Board Credits · IELTS 7.0+',
      },
      badges: 'EdOptions Academy, US High School Diploma, Cognia & WASC, AP Courses',
      objectives: ['EdOptions Academy', 'US High School Diploma', 'Cognia & WASC', 'AP Courses'],
      outcomes: {
        vi: 'Nhận Bằng tốt nghiệp THPT Hoa Kỳ kiểm định Cognia & WASC\nTích lũy tín chỉ đại học sớm (Advanced Placement - AP)\nHồ sơ du học cạnh tranh vào các đại học hàng đầu thế giới\nThành thạo phương pháp tự học và tư duy đại học chuẩn Mỹ',
        en: 'Earn Cognia & WASC accredited US High School Diploma\nEarn early college credits via Advanced Placement (AP)\nCompetitive college applications to top global universities\nMaster US university-level autonomous learning skills',
      },
      imageUrl: '/images/programs/program-high.jpg',
      ctaUrl: '/vi/admissions?program=high',
      order: 3,
      isActive: true,
      status: 'PUBLISHED',
    },
  ],

  // ----------------------------------------------------------
  // PROGRAMS  (mirror brochure structure – 4 main programmes)
  // ----------------------------------------------------------
  programs: [
    // ---- Kindy: SpeedUp English + Academic Foundation ----
    {
      slug: 'kindy-speedup-english',
      level: 'kindergarten',
      title: {
        vi: 'Chương trình Tiếng Anh Bứt phá – Mầm non',
        en: 'SpeedUp English Programme – Kindergarten',
      },
      shortDescription: {
        vi: 'Chương trình tiếng Anh ESL chuẩn Mỹ, theo khung Cambridge English Qualifications, dành cho học sinh 3–6 tuổi tại Little People.',
        en: 'A US-aligned ESL programme following the Cambridge English Qualifications framework for Little People students aged 3–6.',
      },
      content: {
        vi: '<p>Chương trình Tiếng Anh Bứt Phá tại EPath Education được xây dựng theo hệ thống giáo trình chính thức của Cambridge University Press, phát triển tiếng Anh như một ngôn ngữ thứ hai (English as a Second Language – ESL) dành cho học sinh Mầm non và Tiểu học.</p><p><strong>1. Đánh giá theo chuẩn Cambridge quốc tế.</strong> EPath sử dụng kết quả đánh giá và chứng chỉ của Hội đồng Khảo thí Cambridge làm căn cứ xác định năng lực, xếp lớp và đánh giá kết quả.</p><p><strong>2. Học tiếng Anh để sẵn sàng học các chương trình quốc tế.</strong> Lộ trình được tối ưu để học sinh sớm tự tin bước qua rào cản ngôn ngữ và tập trung vào mục tiêu tiếp cận giáo dục quốc tế.</p><p><strong>Nội dung:</strong> Giáo trình ESL chuẩn Mỹ · Học theo chủ đề · CLIL · Early Literacy · Early Mathematics theo chuẩn US Core Standards · Phát triển kỹ năng Nghe – Nói, phát âm và vốn từ vựng.</p>',
        en: '<p>The SpeedUp English Programme at EPath Education is built on the official Cambridge University Press curriculum, developing English as a Second Language (ESL) for Kindergarten and Elementary learners.</p><p><strong>1. Cambridge-aligned assessment.</strong> EPath uses Cambridge Assessment English results and certifications to determine level, placement and outcomes.</p><p><strong>2. English as a launchpad for international programmes.</strong> The pathway is optimised so students move beyond language barriers to focus on true international learning.</p><p><strong>Curriculum:</strong> US ESL standards · Topic-based Learning · CLIL · Early Literacy · Early Mathematics (US Core Standards) · Listening – Speaking – Pronunciation – Vocabulary.</p>',
      },
      ageRange: '3 – 6 tuổi',
      objectives: [
        { vi: 'Hình thành nền tảng tiếng Anh như ngôn ngữ thứ hai', en: 'Build English as a Second Language foundations' },
        { vi: 'Phát triển khả năng giao tiếp tự nhiên', en: 'Develop natural communication skills' },
        { vi: 'Xây nền móng vững chắc cho môi trường học bằng tiếng Anh', en: 'Lay a robust foundation for English-medium learning' },
      ],
      highlights: [
        { vi: 'Giáo trình Cambridge chính thức', en: 'Official Cambridge curriculum' },
        { vi: 'Phương pháp CLIL – tích hợp ngôn ngữ và nội dung', en: 'CLIL – Content & Language Integrated Learning' },
        { vi: 'Đánh giá theo chuẩn Starters / Movers / Flyers', en: 'Aligned with Starters / Movers / Flyers milestones' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Tìm hiểu chương trình', en: 'Learn more' },
      ctaUrl: '/contact',
      order: 0,
      isActive: true,
      status: 'published',
    },
    {
      slug: 'kindy-academic-foundation',
      level: 'kindergarten',
      title: {
        vi: 'Khóa học Nền tảng Học thuật Quốc tế – Mầm non',
        en: 'Academic Foundation Programme – Kindergarten',
      },
      shortDescription: {
        vi: 'Khóa học chuẩn bị cho trẻ đọc, hiểu và học các môn bằng tiếng Anh (Phonics, Early Math, STEM).',
        en: 'Prepares children to read, comprehend and study subjects in English (Phonics, Early Math, STEM).',
      },
      content: {
        vi: '<p>Đây là chương trình khác biệt của EPath Education, được thiết kế dành cho những học sinh có định hướng theo học chương trình Song ngữ hoặc Phổ thông quốc tế.</p><p><strong>Nội dung:</strong> Nhận biết bảng chữ cái và mối liên hệ với âm (Letter Sounds); Học Phonics; Luyện kỹ năng ghép âm (Blending Sounds) và đánh vần từ theo cấp độ; Phát triển kỹ năng đọc hiểu và viết nền tảng theo chuẩn học thuật.</p><p>Song song đó, học sinh làm quen với các khái niệm Toán học bằng tiếng Anh (số đếm, phép tính, hình học, đo lường, tư duy logic) và hoạt động STEM giúp trẻ quan sát, đặt câu hỏi, thử nghiệm.</p>',
        en: '<p>A signature EPath programme designed for learners aiming for Bilingual or full International tracks.</p><p><strong>Curriculum:</strong> Letter Sounds; Phonics; Blending Sounds from CVC to higher structures; Reading comprehension and academic writing foundations.</p><p>Parallel strands introduce English-medium Math (counting, operations, geometry, measurement, logical thinking) and STEM activities that build observation, questioning and experimentation skills.</p>',
      },
      ageRange: '4 – 6 tuổi',
      objectives: [
        { vi: 'Đọc – viết tiếng Anh nền tảng', en: 'Foundational English reading & writing' },
        { vi: 'Tư duy Toán học bằng tiếng Anh', en: 'English-medium numeracy' },
        { vi: 'Khám phá STEM', en: 'Explore STEM' },
      ],
      highlights: [
        { vi: 'Phonics chuẩn quốc tế', en: 'International-standard Phonics' },
        { vi: 'Toán – Khoa học bằng tiếng Anh', en: 'Math & Science in English' },
        { vi: 'Hoạt động STEM trải nghiệm', en: 'Hands-on STEM activities' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Tìm hiểu chương trình', en: 'Learn more' },
      ctaUrl: '/contact',
      order: 1,
      isActive: true,
      status: 'published',
    },

    // ---- Elementary: Foundation (Lớp 2 trở xuống / Lớp 3+) ----
    {
      slug: 'elementary-foundation-base',
      level: 'elementary',
      title: {
        vi: 'Chương trình Tiểu học Tiêu chuẩn – Foundation Track (Base Path)',
        en: 'Elementary Foundation Track – Base Path',
      },
      shortDescription: {
        vi: 'Dành cho học sinh xây dựng nền tảng vững chắc về Ngôn ngữ, tư duy và kỹ năng học tập.',
        en: 'Builds a strong Language, thinking and learning-skills foundation.',
      },
      content: {
        vi: '<p><strong>Lớp 2 trở xuống – 5 giờ/tuần</strong> (ELA + Math): 2 buổi Online 60 phút (Mathematics – GV Nước Ngoài; ELA – GV Song ngữ); 2 buổi Onsite 90 phút (ELA + Math).</p><p><strong>Lớp 3 trở lên – 5 giờ/tuần</strong> (ELA + Math + Science): 2 buổi Online 60 phút (Math; ELA); 1 buổi Onsite 90 phút (Science 45 phút + ELA 45 phút); 1 buổi Onsite 90 phút (ELA 60 phút + Tutor 30 phút).</p><p><strong>Giáo viên:</strong> 50% International Teachers + 50% Bilingual Teachers (IELTS 7.0+).</p>',
        en: '<p><strong>Grades 1–2 – 5 hrs/week</strong> (ELA + Math): 2 Online 60-min sessions (Mathematics with an international teacher; ELA with a bilingual teacher); 2 Onsite 90-min sessions (ELA + Math).</p><p><strong>Grades 3+ – 5 hrs/week</strong> (ELA + Math + Science): 2 Online 60-min sessions; 1 Onsite 90-min (Science 45 min + ELA 45 min); 1 Onsite 90-min (ELA 60 min + Tutor 30 min).</p><p><strong>Teachers:</strong> 50% International + 50% Bilingual (IELTS 7.0+).</p>',
      },
      ageRange: 'Lớp 1 – 5',
      objectives: [
        { vi: 'Nền tảng tiếng Anh học thuật', en: 'Academic English foundations' },
        { vi: 'Tư duy Toán & Khoa học', en: 'Math & Science thinking' },
        { vi: 'Kỹ năng tự học', en: 'Independent learning skills' },
      ],
      highlights: [
        { vi: '5 giờ tương tác mỗi tuần', en: '5 interactive hours per week' },
        { vi: 'Tài khoản Edmentum 12 tháng', en: '12-month Edmentum account' },
        { vi: 'GV Nước ngoài & Song ngữ', en: 'International & Bilingual teachers' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Xem chi tiết', en: 'View details' },
      ctaUrl: '/contact',
      order: 2,
      isActive: true,
      status: 'published',
    },
    {
      slug: 'elementary-advanced-prime',
      level: 'elementary',
      title: {
        vi: 'Chương trình Tiểu học Quốc tế – Advanced Track (Prime Path)',
        en: 'Elementary Advanced Track – Prime Path',
      },
      shortDescription: {
        vi: 'Chương trình chỉ áp dụng cho cấp độ KS2A (Year 3) trở lên. Dành cho học sinh có năng lực học thuật tốt hoặc định hướng quốc tế.',
        en: 'For academically strong learners (KS2A / Year 3+) with international aspirations.',
      },
      content: {
        vi: '<p><strong>Lớp 3 + 4 – 6.5 giờ/tuần</strong> (ELA + Math + Social Studies + Science): 3 buổi Online (Math 60 phút, ELA 60 phút, Social Studies 45 phút); 2 buổi Onsite 90 phút (Science + ELA; ELA + Tutor); 1 buổi Onsite 45 phút (Tutor).</p><p><strong>Lớp 5 trở lên – 7 giờ/tuần</strong> (4 môn): thêm Social Studies 60 phút Online.</p><p>Khác biệt ở cường độ học tập và độ sâu học thuật, giúp học sinh sẵn sàng cho các chương trình Song ngữ và Quốc tế.</p>',
        en: '<p><strong>Grades 3–4 – 6.5 hrs/week</strong> (ELA + Math + Social Studies + Science): 3 Online sessions (Math 60 min, ELA 60 min, Social Studies 45 min); 2 Onsite 90-min sessions; 1 Onsite 45-min (Tutor).</p><p><strong>Grade 5+ – 7 hrs/week</strong> with extended Social Studies.</p><p>Greater intensity and academic depth – preparing students for Bilingual and full International programmes.</p>',
      },
      ageRange: 'Lớp 3 – 5',
      objectives: [
        { vi: 'Đào sâu 4 môn học thuật chuẩn Mỹ', en: 'Deepen four US-standard academic subjects' },
        { vi: 'Sẵn sàng cho chương trình Song ngữ / Quốc tế', en: 'Ready for Bilingual / International tracks' },
        { vi: 'Phát triển kỹ năng nghiên cứu', en: 'Build research skills' },
      ],
      highlights: [
        { vi: '6.5 – 7 giờ tương tác mỗi tuần', en: '6.5 – 7 interactive hours per week' },
        { vi: 'ELA · Math · Science · Social Studies', en: 'ELA · Math · Science · Social Studies' },
        { vi: 'GV Nước ngoài & Song ngữ (IELTS 7.0+)', en: 'International & Bilingual teachers (IELTS 7.0+)' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Xem chi tiết', en: 'View details' },
      ctaUrl: '/contact',
      order: 3,
      isActive: true,
      status: 'published',
    },
    {
      slug: 'elementary-speedup-english',
      level: 'elementary',
      title: {
        vi: 'Chương trình Tiếng Anh Bứt phá – Tiểu học (Cambridge ESOL)',
        en: 'SpeedUp English Programme – Elementary (Cambridge ESOL)',
      },
      shortDescription: {
        vi: 'Phát triển toàn diện năng lực tiếng Anh học thuật theo khung Cambridge English Qualifications, dành cho học sinh 7–12 tuổi.',
        en: 'Develops academic English following the Cambridge English Qualifications framework, for ages 7–12.',
      },
      content: {
        vi: '<p>Phát triển toàn diện năng lực tiếng Anh học thuật, giúp học sinh sử dụng tiếng Anh như một công cụ để học tập, tư duy và từng bước tiếp cận các chương trình Song ngữ và Phổ thông quốc tế.</p><p><strong>Nội dung:</strong> Hệ thống giáo trình Cambridge University Press · Bốn kỹ năng Nghe – Nói – Đọc – Viết · Đọc hiểu – viết đoạn văn – viết học thuật · Từ vựng học thuật và ngữ pháp · CLIL với Toán, Khoa học · Project-based Learning.</p>',
        en: '<p>Develops well-rounded academic English so students use English as a tool for thinking and learning, readying them for Bilingual and International pathways.</p><p><strong>Curriculum:</strong> Cambridge University Press · Four skills · Reading comprehension – paragraph writing – academic writing · Academic vocabulary and grammar · CLIL · Project-based Learning.</p>',
      },
      ageRange: '7 – 12 tuổi',
      objectives: [
        { vi: 'Năng lực tiếng Anh học thuật', en: 'Academic English proficiency' },
        { vi: 'Tiếp cận chương trình Song ngữ & Quốc tế', en: 'Access to Bilingual & International tracks' },
        { vi: 'Kỹ năng thuyết trình và giao tiếp', en: 'Presentation & communication skills' },
      ],
      highlights: [
        { vi: 'Cột mốc Starters – Movers – Flyers', en: 'Starters – Movers – Flyers milestones' },
        { vi: 'CLIL & Project-based Learning', en: 'CLIL & Project-based Learning' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Xem chi tiết', en: 'View details' },
      ctaUrl: '/contact',
      order: 4,
      isActive: true,
      status: 'published',
    },

    // ---- Middle School ----
    {
      slug: 'middle-academic-foundation',
      level: 'middle',
      title: {
        vi: 'Khóa học Nền tảng Học thuật Quốc tế – THCS',
        en: 'Academic Foundation Programme – Middle School',
      },
      shortDescription: {
        vi: 'Từ "học bằng tiếng Anh" tiến tới "tư duy và học tập độc lập bằng tiếng Anh".',
        en: 'From "learning in English" to "thinking and studying independently in English".',
      },
      content: {
        vi: '<p><strong>Mục tiêu:</strong> Học sinh THCS có nền tảng tiếng Anh cơ bản, muốn nâng cao Academic English và kiến thức học thuật theo định hướng quốc tế. Định hướng đạt IELTS 5.5+ trước khi kết thúc lớp 8 và chuẩn bị cho Dual Diploma / chương trình Mỹ ở bậc THPT.</p><p><strong>Môn học:</strong> ELA · Math · Science · Social Studies (5–6 tiếng/tuần).</p><p><strong>Giáo viên:</strong> 50% International (Bachelor of Arts in Secondary Education) + 50% Bilingual (IELTS 7.0+).</p>',
        en: '<p><strong>Goal:</strong> For Vietnamese middle schoolers who already have basic English and want stronger Academic English and content knowledge. Targets IELTS 5.5+ before Grade 8 and prepares students for Dual Diploma / US programmes.</p><p><strong>Subjects:</strong> ELA · Math · Science · Social Studies (5–6 hrs/week).</p><p><strong>Teachers:</strong> 50% International + 50% Bilingual (IELTS 7.0+).</p>',
      },
      ageRange: '13 – 16 tuổi',
      objectives: [
        { vi: 'IELTS 5.5+', en: 'IELTS 5.5+' },
        { vi: 'Academic English nâng cao', en: 'Advanced Academic English' },
        { vi: 'Sẵn sàng Dual Diploma / Chương trình Mỹ', en: 'Ready for Dual Diploma / US programmes' },
      ],
      highlights: [
        { vi: '5–6 giờ tương tác mỗi tuần', en: '5–6 interactive hours per week' },
        { vi: '4 môn học thuật chuẩn Mỹ', en: '4 US-standard academic subjects' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Xem chi tiết', en: 'View details' },
      ctaUrl: '/contact',
      order: 5,
      isActive: true,
      status: 'published',
    },
    {
      slug: 'middle-speedup-english',
      level: 'middle',
      title: {
        vi: 'Chương trình Tiếng Anh Bứt phá – THCS (IELTS Preparation)',
        en: 'SpeedUp English Programme – Middle School (IELTS)',
      },
      shortDescription: {
        vi: 'Hoàn thiện năng lực tiếng Anh học thuật, chinh phục IELTS và sẵn sàng chương trình Song ngữ / Quốc tế.',
        en: 'Complete academic English, conquer IELTS and prepare for Bilingual / International tracks.',
      },
      content: {
        vi: '<p><strong>Mục tiêu:</strong> Hoàn thiện năng lực tiếng Anh học thuật, phát triển tư duy phản biện và kỹ năng nghiên cứu, đồng thời xây dựng nền tảng vững chắc để chinh phục chứng chỉ IELTS.</p><p><strong>Nội dung:</strong> Phát triển toàn diện bốn kỹ năng theo chuẩn IELTS · Từ vựng học thuật · Ngữ pháp nâng cao · Đọc hiểu học thuật – viết luận – thuyết trình – tranh biện – tư duy phản biện.</p>',
        en: '<p><strong>Goal:</strong> Complete academic English, develop critical thinking and research skills, and build a strong foundation for IELTS.</p><p><strong>Curriculum:</strong> Full IELTS-aligned four-skills development · Academic vocabulary · Advanced grammar · Academic reading – essay writing – presentations – debate – critical thinking.</p>',
      },
      ageRange: '13 – 16 tuổi',
      objectives: [
        { vi: 'IELTS 5.5 – 6.5+', en: 'IELTS 5.5 – 6.5+' },
        { vi: 'Kỹ năng nghiên cứu & tranh biện', en: 'Research & debating skills' },
      ],
      highlights: [
        { vi: 'Luyện IELTS chuyên sâu', en: 'Dedicated IELTS prep' },
        { vi: 'Project-based & Debate', en: 'Project-based & debate' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Xem chi tiết', en: 'View details' },
      ctaUrl: '/contact',
      order: 6,
      isActive: true,
      status: 'published',
    },
    {
      slug: 'middle-us-curriculum',
      level: 'middle',
      title: {
        vi: 'Chương trình Trung học Mỹ – THCS (Prime Path)',
        en: 'US Middle School Official Curriculum – Prime Path',
      },
      shortDescription: {
        vi: 'Chương trình Trung học Mỹ chính thức dành cho học sinh có định hướng chuyển tiếp quốc tế.',
        en: 'Official US Middle School curriculum for students aiming to transition internationally.',
      },
      content: {
        vi: '<p>Học sinh theo học chương trình Trung học Mỹ chính thức (US Middle School Official Curriculum) thông qua hệ thống học liệu và đánh giá chuẩn quốc tế, chuẩn bị tốt cho Dual Diploma và US High School Diploma ở bậc THPT.</p>',
        en: '<p>Students follow the official US Middle School curriculum with international-standard resources and assessments, providing robust preparation for Dual Diploma and the US High School Diploma.</p>',
      },
      ageRange: '13 – 16 tuổi',
      objectives: [
        { vi: 'Hoàn thành Middle School theo chuẩn Mỹ', en: 'Complete US-standard Middle School' },
        { vi: 'Sẵn sàng Dual Diploma / US High School', en: 'Ready for Dual Diploma / US High School' },
      ],
      highlights: [
        { vi: 'Học liệu chuẩn Mỹ', en: 'US-standard resources' },
        { vi: 'Đánh giá quốc tế', en: 'International assessments' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Xem chi tiết', en: 'View details' },
      ctaUrl: '/contact',
      order: 7,
      isActive: true,
      status: 'published',
    },

    // ---- High School ----
    {
      slug: 'high-dual-diploma',
      level: 'high',
      title: {
        vi: 'Dual Diploma — Song bằng THPT Việt Nam & Hoa Kỳ',
        en: 'Dual Diploma — Vietnam & US High School Dual Diploma',
      },
      shortDescription: {
        vi: '1.1 Lựa chọn Dual Diploma (Song bằng) — Học sinh theo học đồng thời chương trình THPT tại Việt Nam và chương trình THPT Hoa Kỳ thông qua EdOptions Academy để nhận 2 bằng tốt nghiệp.',
        en: '1.1 Dual Diploma Option — Study concurrently in Vietnam and US curriculum via EdOptions Academy to earn both high school diplomas.',
      },
      content: {
        vi: '<p>Lộ trình học tập lý tưởng cho học sinh vừa hoàn thành trọn vẹn chương trình THPT Việt Nam, vừa tích lũy 5.0 tín chỉ chuẩn Mỹ và 1.0 tín chỉ nâng cao AP® qua EdOptions Academy. Các môn học quốc tế được bố trí chủ yếu vào kỳ hè và linh hoạt trong năm học để không làm gián đoạn việc học chính khóa trong nước.</p><p><strong>Bằng cấp đạt được:</strong> Bằng tốt nghiệp THPT Việt Nam + Bằng Tú tài Mỹ (U.S. High School Diploma) kiểm định bởi Cognia & WASC + Chứng chỉ IELTS 7.0+ và chứng nhận môn AP của College Board.</p><p>Mở rộng cánh cửa vào các đại học quốc tế tại Việt Nam (nhận học bổng cao) và xét tuyển thẳng vào các trường đại học hàng đầu thế giới.</p>',
        en: '<p>Concurrent pathway earning both Vietnamese High School Diploma and Cognia & WASC accredited U.S. High School Diploma via EdOptions Academy. Coursework arranged during summer terms and flexible evening hours (5 standard credits + 1 AP credit).</p><p>Includes IELTS 7.0+ preparation and College Board AP® credits for maximum global university admissions advantages.</p>',
      },
      ageRange: '15 – 18 tuổi (Lớp 9 – 12)',
      objectives: [
        { vi: 'Nhận song bằng THPT Việt Nam & Hoa Kỳ', en: 'Earn dual Vietnamese & US high school diplomas' },
        { vi: 'Tích lũy tín chỉ nâng cao AP® College Board', en: 'Earn College Board approved AP® credits' },
        { vi: 'Chinh phục chứng chỉ IELTS Academic 7.0+', en: 'Achieve IELTS Academic 7.0+' },
      ],
      highlights: [
        { vi: '1.1 Lựa chọn Dual Diploma (Song bằng)', en: '1.1 Dual Diploma Pathway' },
        { vi: 'Bằng tốt nghiệp U.S. High School Diploma kiểm định Cognia & WASC', en: 'Cognia & WASC accredited U.S. High School Diploma' },
        { vi: 'Lịch học linh hoạt, không làm gián đoạn học chính khóa', en: 'Flexible schedule without local school disruption' },
      ],
      imageUrl: '/images/programs/program-dual-diploma.jpg',
      ctaLabel: { vi: 'Tư vấn lộ trình', en: 'Advise me' },
      ctaUrl: '/contact',
      order: 8,
      isActive: true,
      status: 'published',
    },
    {
      slug: 'high-fulltime-homeschool',
      level: 'high',
      title: {
        vi: 'Fulltime Homeschool — Học toàn thời gian chương trình THPT Hoa Kỳ',
        en: 'Fulltime Homeschool — Full-Time US High School Diploma',
      },
      shortDescription: {
        vi: '1.2 Lựa chọn Fulltime Homeschool (Homeschool toàn phần) — Học toàn thời gian 100% chương trình THPT Hoa Kỳ qua EdOptions Academy, tích lũy 21.5 tín chỉ và tốt nghiệp như học sinh bản xứ.',
        en: '1.2 Fulltime Homeschool Option — 100% full-time US High School curriculum via EdOptions Academy, earning 21.5 credits.',
      },
      content: {
        vi: '<p>Dành cho học sinh đã xác định mục tiêu du học hoặc ứng tuyển các trường đại học top đầu thế giới có mức độ cạnh tranh cao. Học sinh học tập toàn thời gian theo đúng khung chương trình của trường trung học Hoa Kỳ thông qua EdOptions Academy.</p><p>Học sinh tích lũy đầy đủ 21.5 tín chỉ chuẩn Mỹ (bao gồm ELA, Math, Science, Social Studies, Ngoại ngữ, Nghệ thuật và Tự chọn). Học sinh có thể tốt nghiệp sớm hơn thời hạn nếu đẩy nhanh tiến độ hoàn thành tín chỉ.</p><p>Kết hợp ôn luyện chuyên sâu SAT/ACT và các môn AP®, được các trường đại học công nhận như một học sinh bản địa Mỹ – lợi thế vượt trội so với diện học sinh quốc tế thông thường.</p>',
        en: '<p>Comprehensive full-time US high school education via EdOptions Academy. Students earn all 21.5 credits according to US graduation requirements, including AP® courses and SAT/ACT prep.</p><p>Graduates apply to global universities with the status of native US high school graduates, dramatically elevating admission competitiveness.</p>',
      },
      ageRange: '15 – 18 tuổi (Lớp 9 – 12)',
      objectives: [
        { vi: 'Tốt nghiệp Bằng THPT Hoa Kỳ (21.5 Tín chỉ)', en: 'Graduate with US High School Diploma (21.5 credits)' },
        { vi: 'Tư cách tuyển sinh như học sinh bản địa Mỹ', en: 'Native US student applicant status for top universities' },
        { vi: 'Luyện thi SAT/ACT và tín chỉ đại học sớm AP®', en: 'SAT/ACT prep and early College Board AP® credits' },
      ],
      highlights: [
        { vi: '1.2 Lựa chọn Fulltime Homeschool (Homeschool toàn phần)', en: '1.2 Fulltime Homeschool Pathway' },
        { vi: 'Được các đại học xét tuyển như học sinh bản xứ Hoa Kỳ', en: 'Evaluated by universities with US native applicant status' },
        { vi: 'Tích lũy 21.5 tín chỉ chuẩn Mỹ và các môn nâng cao AP®', en: 'Complete 21.5 US credits and College Board AP® courses' },
      ],
      imageUrl: '/images/programs/program-high.jpg',
      ctaLabel: { vi: 'Tư vấn lộ trình', en: 'Advise me' },
      ctaUrl: '/contact',
      order: 9,
      isActive: true,
      status: 'published',
    },

    // ---- Personal Development ----
    {
      slug: 'personal-development',
      level: 'high',
      title: {
        vi: 'Phát triển năng lực Cá nhân (Personal Development)',
        en: 'Personal Development – Beyond the Classroom',
      },
      shortDescription: {
        vi: 'Khóa học Kỹ năng, Ngoại khóa, Trải nghiệm — xây dựng hồ sơ học tập cá nhân chuẩn quốc tế.',
        en: 'Skills, extracurriculars and experiences that build an international-standard student portfolio.',
      },
      content: {
        vi: '<p><strong>Khóa học Kỹ năng, Ngoại khóa, Trải nghiệm (Beyond the Classroom Portfolio).</strong> Học sinh được hướng dẫn thực hiện các dự án cá nhân và nhóm nhằm phát triển: Critical Thinking · Research Skills · Public Speaking · Leadership · Community Service.</p><p>Các sản phẩm và thành tích từ dự án sẽ góp phần xây dựng <strong>Academic Portfolio (Hồ sơ học tập cá nhân)</strong>, tạo nền tảng cho các chương trình quốc tế và định hướng tương lai.</p><p><strong>Cố vấn lộ trình học tập Quốc tế (International Pathway):</strong> EPath hỗ trợ phụ huynh đánh giá mức độ phù hợp của học sinh, lựa chọn Dual Diploma, Tú tài Quốc tế, dự bị đại học, du học hay các chương trình chuyển tiếp quốc tế khác.</p>',
        en: '<p><strong>Beyond the Classroom Portfolio.</strong> Guided individual and group projects build: Critical Thinking · Research Skills · Public Speaking · Leadership · Community Service.</p><p>Project outputs feed the <strong>Academic Portfolio</strong> that supports international applications and university planning.</p><p><strong>International Pathway Advising:</strong> EPath helps families evaluate fit and choose between Dual Diploma, international baccalaureate, university foundation, study abroad or other international transitions.</p>',
      },
      ageRange: 'Mọi cấp học',
      objectives: [
        { vi: 'Tư duy phản biện', en: 'Critical thinking' },
        { vi: 'Kỹ năng nghiên cứu & thuyết trình', en: 'Research & public speaking' },
        { vi: 'Leadership & Community Service', en: 'Leadership & community service' },
      ],
      highlights: [
        { vi: 'Project-based', en: 'Project-based' },
        { vi: 'Academic Portfolio chuẩn quốc tế', en: 'International-standard portfolio' },
      ],
      imageUrl: '',
      ctaLabel: { vi: 'Tìm hiểu thêm', en: 'Learn more' },
      ctaUrl: '/contact',
      order: 10,
      isActive: true,
      status: 'published',
    },
  ],

  // ----------------------------------------------------------
  // PARTNERS  (Edmentum, Cambridge, FabLab EIU, Cognia)
  // ----------------------------------------------------------
  partners: [
    {
      name: 'Edmentum International & EdOptions Academy',
      logoUrl: '',
      website: 'https://www.edmentum.com',
      category: 'curriculum',
      description: {
        vi: 'Tổ chức giáo dục K-12 hàng đầu Hoa Kỳ với hơn 60 năm kinh nghiệm, phục vụ 5.2 triệu học sinh mỗi năm trên 100 quốc gia. Trường trực tuyến EdOptions Academy được kiểm định toàn diện bởi Cognia và WASC, cấp bằng Tú tài Mỹ (U.S. High School Diploma) và cung cấp hơn 400 khóa học chuẩn quốc tế gồm các môn Tín chỉ nâng cao AP® được College Board phê duyệt.',
        en: 'Leading US K-12 digital curriculum and accredited online schooling provider with 60+ years of educational excellence, serving 5.2 million students annually across 100+ countries. EdOptions Academy is fully accredited by Cognia and WASC, awarding the official U.S. High School Diploma with 400+ courses including College Board approved AP® courses.',
      },
      features: [
        { vi: 'Kiểm định chất lượng giáo dục bởi Cognia và WASC', en: 'Accredited by Cognia and WASC' },
        { vi: 'Chương trình AP® được College Board phê duyệt & NCAA công nhận', en: 'College Board approved AP® courses and NCAA eligible' },
        { vi: 'Hơn 400 khóa học chuẩn Hoa Kỳ từ lớp 6 đến lớp 12', en: '400+ US curriculum courses from Grade 6 to Grade 12' },
        { vi: '92% học sinh hoàn tất đỗ vào các trường đại học uy tín tại Hoa Kỳ', en: '92% of graduates accepted into leading universities' },
      ],
      isFeatured: true,
      order: 0,
      isActive: true,
    },
    {
      name: 'Cambridge Assessment English',
      logoUrl: '',
      website: 'https://www.cambridgeenglish.org',
      category: 'certification',
      description: {
        vi: 'Hội đồng Khảo thí tiếng Anh thuộc Đại học Cambridge (Vương quốc Anh) – tổ chức hàng đầu thế giới trong đánh giá năng lực ngôn ngữ. Khung năng lực Cambridge English Qualifications được tích hợp xuyên suốt tại EPath, xác định chính xác trình độ và chuẩn bị nền tảng tiếng Anh học thuật để học sinh tự tin học các môn phổ thông quốc tế.',
        en: 'World-renowned English language assessment organization part of the University of Cambridge (UK). The Cambridge English Qualifications framework is integrated throughout EPath tracks, setting clear benchmarks from Young Learners to IELTS Academic.',
      },
      features: [
        { vi: 'Đánh giá khách quan theo khung Cambridge English Qualifications', en: 'Standardized assessment on Cambridge English Qualifications' },
        { vi: 'Lộ trình chuẩn hóa từ Starters, Movers, Flyers đến IELTS', en: 'Structured progression from Young Learners to IELTS' },
        { vi: 'Xây dựng tiếng Anh học thuật như một công cụ học tập đa môn', en: 'Develops academic English as a multidisciplinary study tool' },
        { vi: 'Rút ngắn lộ trình nền tảng, tối ưu thời gian và chi phí cho gia đình', en: 'Streamlined foundational pathway saving time and investment' },
      ],
      isFeatured: true,
      order: 1,
      isActive: true,
    },
    {
      name: 'FabLab EIU – Trường Đại học Quốc tế Miền Đông',
      logoUrl: '',
      website: 'https://eiu.edu.vn',
      category: 'lab',
      description: {
        vi: 'Không gian sáng tạo (makerspace) công nghệ cao trực thuộc Trường Đại học Quốc tế Miền Đông (EIU). EPath hợp tác cùng FabLab EIU mang đến cho học sinh môi trường thực hành sáng tạo với công nghệ in 3D, thiết kế CAD, lập trình Robotics và các dự án STEAM thực nghiệm, kết nối lý thuyết học thuật với ứng dụng thực tế.',
        en: 'State-of-the-art makerspace affiliated with Eastern International University (EIU). EPath partners with FabLab EIU to provide hands-on STEM education, 3D printing, CAD design, robotics, and applied STEAM innovation projects.',
      },
      features: [
        { vi: 'Makerspace hiện đại với máy in 3D, máy cắt laser và xưởng Robotics', en: 'Modern makerspace equipped with 3D printers and robotics labs' },
        { vi: 'Trực tiếp trải nghiệm và ứng dụng kiến thức khoa học vào thực tế', en: 'Hands-on application of scientific principles to real projects' },
        { vi: 'Phát triển tư duy sáng tạo, giải quyết vấn đề và kỹ năng thực hành', en: 'Fosters creative problem-solving and maker engineering skills' },
        { vi: 'Nuôi dưỡng năng lực công nghệ và tinh thần đổi mới sáng tạo thế kỷ 21', en: 'Nurtures 21st-century technological fluency and innovation' },
      ],
      isFeatured: true,
      order: 2,
      isActive: true,
    },
    {
      name: 'Cognia & WASC Accreditation',
      logoUrl: '',
      website: 'https://www.cognia.org',
      category: 'certification',
      description: {
        vi: 'Hai tổ chức kiểm định giáo dục uy tín bậc nhất Hoa Kỳ và toàn cầu. Chứng nhận kiểm định đảm bảo giá trị pháp lý quốc tế của Bằng tốt nghiệp Phổ thông Mỹ (U.S. High School Diploma) và bảng điểm (transcript) để học sinh EPath được công nhận và xét tuyển thẳng vào các trường đại học hàng đầu thế giới.',
        en: 'Two of the most recognized educational accrediting organizations globally. Their accreditation guarantees full international recognition and academic rigor for the U.S. High School Diploma and transcripts for direct admission to top global universities.',
      },
      features: [
        { vi: 'Tổ chức kiểm định chất lượng giáo dục hàng đầu của Hoa Kỳ', en: 'Premier education accreditation agencies in the United States' },
        { vi: 'Bằng Tú tài Mỹ và bảng điểm được công nhận trên toàn thế giới', en: 'US High School Diploma and transcripts recognized worldwide' },
        { vi: 'Bảo đảm tính liên thông và chuẩn mực học thuật quốc tế cao nhất', en: 'Ensures highest international academic standards and transferability' },
        { vi: 'Mở rộng cơ hội săn học bổng và xét tuyển thẳng vào đại học danh tiếng', en: 'Maximizes scholarship opportunities at world-ranked universities' },
      ],
      isFeatured: false,
      order: 3,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // TESTIMONIALS
  // ----------------------------------------------------------
  testimonials: [
    {
      name: 'Phụ huynh học sinh EPath',
      role: 'Parent of an Elementary learner',
      avatarUrl: '',
      content: {
        vi: 'Con mình cải thiện rõ rệt khả năng đọc hiểu và tự tin giao tiếp tiếng Anh chỉ sau vài tháng. Các con được đánh giá bằng chuẩn Cambridge nên lộ trình rất rõ ràng, phụ huynh dễ theo dõi.',
        en: 'My child\'s reading comprehension and confidence in English improved noticeably within a few months. The Cambridge-aligned assessments give families a clear roadmap and easy visibility of progress.',
      },
      rating: 5,
      isFeatured: true,
      order: 0,
      isActive: true,
    },
    {
      name: 'Phụ huynh học sinh Middle School',
      role: 'Parent of a Middle School learner',
      avatarUrl: '',
      content: {
        vi: 'Chương trình Academic Foundation Programme giúp con tiến bộ từ "học bằng tiếng Anh" sang "tư duy bằng tiếng Anh". Đội ngũ Academic Advisors đồng hành sát sao và cập nhật tiến độ thường xuyên.',
        en: 'The Academic Foundation Programme moved my child from "learning in English" to "thinking in English". The Academic Advisors stay close, with frequent progress updates.',
      },
      rating: 5,
      isFeatured: true,
      order: 1,
      isActive: true,
    },
    {
      name: 'Học sinh EPath',
      role: 'High School learner – Dual Diploma',
      avatarUrl: '',
      content: {
        vi: 'Em theo lộ trình Dual Diploma vừa học ở trường vừa tích lũy tín chỉ Mỹ trên EdOptions Academy. Sau khi tốt nghiệp em có cả hai bằng và hồ sơ rất vững để apply đại học quốc tế.',
        en: 'I followed the Dual Diploma path while staying at my Vietnamese school and earning US credits online via EdOptions Academy. After graduation I have both diplomas and a strong international application portfolio.',
      },
      rating: 5,
      isFeatured: false,
      order: 2,
      isActive: true,
    },
    {
      name: 'Phụ huynh Tiểu học',
      role: 'Parent of a Grade 4 learner',
      avatarUrl: '',
      content: {
        vi: 'Các buổi onsite giúp con có môi trường thực hành tiếng Anh, còn online giáo viên nước ngoài đảm bảo chuẩn học thuật. Con học mà vui, mỗi tuần đều chờ đến lịch học.',
        en: 'Onsite sessions give my child an environment to practise English, while online international teachers ensure academic standards. She enjoys learning and looks forward to every class.',
      },
      rating: 5,
      isFeatured: false,
      order: 3,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // FAQs – sourced from "Sitemap Câu hỏi thường gặp"
  // ----------------------------------------------------------
  faqs: [
    {
      question: {
        vi: 'EPath Education phù hợp với học sinh ở độ tuổi nào?',
        en: 'What age group is EPath Education designed for?',
      },
      answer: {
        vi: '<p>EPath hiện triển khai chương trình cho học sinh từ Mầm non (3–6 tuổi) đến hết Trung học phổ thông (lớp 12), với lộ trình riêng cho từng cấp học: Tiểu học, Trung học Cơ sở và Trung học Phổ thông.</p>',
        en: '<p>EPath currently serves students from Kindergarten (ages 3–6) through Grade 12, with dedicated pathways for Elementary, Middle School and High School.</p>',
      },
      category: 'general',
      imageUrl: '',
      order: 0,
      isActive: true,
    },
    {
      question: {
        vi: 'Học phí và chính sách tài chính tại EPath như thế nào?',
        en: 'How does EPath structure tuition and financial policy?',
      },
      answer: {
        vi: '<p>EPath thiết kế các gói học phí linh hoạt theo từng cấp học và lộ trình (Base Path / Prime Path). Mỗi học sinh được cấp tài khoản Edmentum 12 tháng. Vui lòng liên hệ phòng Tuyển sinh để nhận báo giá chi tiết theo nhu cầu.</p>',
        en: '<p>EPath offers flexible tuition packages per education level and pathway (Base Path / Prime Path). Each student is granted a 12-month Edmentum account. Please contact Admissions for a tailored quote.</p>',
      },
      category: 'admissions',
      imageUrl: '',
      order: 1,
      isActive: true,
    },
    {
      question: {
        vi: 'EPath có triển khai chương trình song bằng không?',
        en: 'Does EPath offer Dual Diploma programmes?',
      },
      answer: {
        vi: '<p>Có. Từ lớp 9, học sinh có thể theo học chương trình <strong>US Dual High School Diploma (Song bằng Việt – Mỹ)</strong> thông qua EdOptions Academy thuộc hệ sinh thái Edmentum, hoặc lựa chọn <strong>US High School Diploma – Fulltime Homeschool (Tú tài Mỹ)</strong>.</p>',
        en: '<p>Yes. From Grade 9, students can enrol in the <strong>US Dual High School Diploma</strong> via EdOptions Academy (Edmentum), or choose the <strong>US High School Diploma – Fulltime Homeschool</strong>.</p>',
      },
      category: 'program',
      imageUrl: '',
      order: 2,
      isActive: true,
    },
    {
      question: {
        vi: 'Mô hình học tập Blended Learning tại EPath hoạt động ra sao?',
        en: 'How does the Blended Learning model work at EPath?',
      },
      answer: {
        vi: '<p>Học sinh kết hợp giữa học trực tuyến (với giáo viên nước ngoài / song ngữ) và học trực tiếp tại Campus. Mỗi học sinh có lộ trình cá nhân hóa dựa trên kết quả đánh giá đầu vào và được theo dõi liên tục bởi đội ngũ Academic Advisors.</p>',
        en: '<p>Students combine online learning (with international / bilingual teachers) and on-site sessions at Campus. Each student gets a personalised pathway based on entry assessments, monitored continuously by our Academic Advisors.</p>',
      },
      category: 'program',
      imageUrl: '',
      order: 3,
      isActive: true,
    },
    {
      question: {
        vi: 'Cambridge ESOL đóng vai trò gì trong chương trình?',
        en: 'What role does Cambridge ESOL play?',
      },
      answer: {
        vi: '<p>EPath tích hợp khung năng lực Cambridge English Qualifications vào chương trình, giúp xác định trình độ, theo dõi tiến trình (Starters – Movers – Flyers – KET – PET – IELTS) và đảm bảo học sinh đạt chuẩn ngôn ngữ quốc tế trước khi chuyển sang các môn học bằng tiếng Anh.</p>',
        en: '<p>EPath embeds the Cambridge English Qualifications framework into its curriculum to determine level, track progress (Starters – Movers – Flyers – KET – PET – IELTS) and ensure students reach international language standards before moving to English-medium subjects.</p>',
      },
      category: 'program',
      imageUrl: '',
      order: 4,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // EVENTS – "Sự kiện & Lễ hội thường niên" (Sheet2 + Brochure)
  // ----------------------------------------------------------
  events: [
    {
      slug: 'mid-autumn-festival',
      title: {
        vi: 'Mid-Autumn Festival – Tết Trung thu EPath',
        en: 'Mid-Autumn Festival at EPath',
      },
      shortDescription: {
        vi: 'Lễ hội Trung thu truyền thống kết hợp hoạt động trải nghiệm văn hoá Việt – Quốc tế cho học sinh toàn trường.',
        en: 'A traditional Mid-Autumn celebration blended with international cultural experiences for the whole school.',
      },
      content: {
        vi: '<p>EPath tổ chức đêm Trung thu với các hoạt động: làm đèn lồng, múa sư tử, trình diễn nghệ thuật và trò chơi teamwork. Đây là dịp để học sinh hòa nhập văn hoá Việt và phát triển kỹ năng giao tiếp trong môi trường quốc tế.</p>',
        en: '<p>EPath hosts a Mid-Autumn night with lantern-making, lion dance, artistic performances and team games — an opportunity for students to integrate Vietnamese culture and develop communication skills in an international context.</p>',
      },
      startDate: '2025-10-05',
      endDate: '',
      location: 'EPath Campus – 38 Trần Phú, TP.HCM',
      imageUrl: '',
      registerUrl: '',
      status: 'upcoming',
      isFeatured: true,
      order: 0,
      isActive: true,
    },
    {
      slug: 'halloween-celebration',
      title: {
        vi: 'Halloween Celebration – Đêm hội hóa trang',
        en: 'Halloween Celebration',
      },
      shortDescription: {
        vi: 'Đêm hội hóa trang với trò chơi văn hoá Anglo-Saxon, giúp học sinh trải nghiệm môi trường quốc tế và xây dựng sự tự tin.',
        en: 'A costume night with Anglo-Saxon cultural games that immerses students in an international environment and builds confidence.',
      },
      content: {
        vi: '<p>Halloween tại EPath là chuỗi hoạt động trải nghiệm: hoá trang theo chủ đề, trò chơi Trick-or-Treat, storytelling và các workshop nghệ thuật. Học sinh phát triển kỹ năng giao tiếp và sự tự tin trong môi trường nói tiếng Anh.</p>',
        en: '<p>Halloween at EPath is a series of hands-on activities: themed costumes, Trick-or-Treat games, storytelling and art workshops — building communication skills and confidence in English.</p>',
      },
      startDate: '2025-10-31',
      endDate: '',
      location: 'EPath Campus',
      imageUrl: '',
      registerUrl: '',
      status: 'upcoming',
      isFeatured: true,
      order: 1,
      isActive: true,
    },
    {
      slug: 'christmas-festival',
      title: {
        vi: 'Christmas Festival – Lễ hội Giáng sinh',
        en: 'Christmas Festival',
      },
      shortDescription: {
        vi: 'Lễ hội Giáng sinh với workshop trang trí, hoà nhạc và chương trình văn nghệ đa quốc gia.',
        en: 'A Christmas festival with decoration workshops, concert and a multicultural stage show.',
      },
      content: {
        vi: '<p>Giáng sinh tại EPath là dịp để học sinh tìm hiểu văn hoá phương Tây qua workshop làm thiệp, trang trí cây thông và biểu diễn hoà nhạc. Chương trình được tổ chức bằng song ngữ Việt – Anh.</p>',
        en: '<p>Christmas at EPath is a chance for students to explore Western culture through card-making workshops, tree decoration and a concert — all bilingual Vietnamese – English.</p>',
      },
      startDate: '2025-12-20',
      endDate: '',
      location: 'EPath Campus',
      imageUrl: '',
      registerUrl: '',
      status: 'upcoming',
      isFeatured: false,
      order: 2,
      isActive: true,
    },
    {
      slug: 'new-year-celebration',
      title: {
        vi: 'New Year Celebration – Chào năm mới',
        en: 'New Year Celebration',
      },
      shortDescription: {
        vi: 'Chào đón năm mới với chuỗi hoạt động giao lưu, đặt mục tiêu học tập và nghi thức quốc tế.',
        en: 'Welcome the new year with cultural exchange, learning-goal setting and international ceremonies.',
      },
      content: {
        vi: '<p>Sự kiện chào năm mới giúp học sinh nhìn lại hành trình học tập, đặt mục tiêu cá nhân và tham gia các hoạt động giao lưu cộng đồng.</p>',
        en: '<p>The New Year event helps students reflect on their learning journey, set personal goals and join community exchange activities.</p>',
      },
      startDate: '2026-01-08',
      endDate: '',
      location: 'EPath Campus',
      imageUrl: '',
      registerUrl: '',
      status: 'upcoming',
      isFeatured: false,
      order: 3,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // ACHIEVEMENTS – placeholder based on brochure description
  // ----------------------------------------------------------
  achievements: [
    {
      title: {
        vi: 'Học sinh đạt chứng chỉ Cambridge',
        en: 'Students Earned Cambridge Certifications',
      },
      description: {
        vi: 'Nhiều học sinh EPath đã đạt các chứng chỉ Starters, Movers, Flyers theo khung Cambridge English Qualifications, đặt nền tảng vững chắc cho lộ trình học thuật quốc tế.',
        en: 'Many EPath students have earned Starters, Movers and Flyers certifications under the Cambridge English Qualifications framework, building a strong foundation for international learning.',
      },
      images: [],
      coverImage: '',
      order: 0,
      isActive: true,
    },
    {
      title: {
        vi: 'Tham gia các đấu trường học thuật quốc tế',
        en: 'Participation in International Academic Competitions',
      },
      description: {
        vi: 'Học sinh EPath được tạo điều kiện tham gia các kỳ thi Olympiad và sân chơi học thuật uy tín như IMEC, STEMCO, GMEC, TIMO – ghi nhận năng lực và tích lũy thành tích học tập.',
        en: 'EPath enables students to join Olympiads and reputable academic competitions like IMEC, STEMCO, GMEC and TIMO — recognising ability and accumulating academic achievements.',
      },
      images: [],
      coverImage: '',
      order: 1,
      isActive: true,
    },
    {
      title: {
        vi: 'Dự án kỹ năng & Hồ sơ học tập cá nhân',
        en: 'Skill Projects & Academic Portfolio',
      },
      description: {
        vi: 'Học sinh hoàn thiện các dự án cá nhân và nhóm xây dựng Academic Portfolio: Critical Thinking · Research Skills · Public Speaking · Leadership · Community Service.',
        en: 'Students complete individual and group projects that build an Academic Portfolio: Critical Thinking · Research Skills · Public Speaking · Leadership · Community Service.',
      },
      images: [],
      coverImage: '',
      order: 2,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // SITE SETTINGS (contact info)
  // ----------------------------------------------------------
  siteSettings: [
    {
      address: {
        vi: 'Số 38 đường Trần Phú, phường Thủ Dầu Một, TP. Hồ Chí Minh',
        en: '38 Tran Phu Street, Thu Dau Mot Ward, Ho Chi Minh City, Vietnam',
      },
      phone: '',
      email: 'contact@epatheducation.edu.vn',
      hotline: '',
      zaloUrl: '',
      facebookUrl: '',
      youtubeUrl: '',
      workingHours: {
        vi: 'Thứ 2 – Thứ 7: 8:00 – 18:00',
        en: 'Mon – Sat: 8:00 AM – 6:00 PM',
      },
      mapEmbedUrl: '',
      footerDescription: {
        vi: 'EPath Education — Đưa giáo dục quốc tế chất lượng cao trở nên dễ tiếp cận hơn với các gia đình Việt Nam.',
        en: 'EPath Education — Making high-quality international education more accessible for Vietnamese families.',
      },
      copyrightText: '© 2025 EPath Education. All rights reserved.',
    },
  ],

  // ----------------------------------------------------------
  // HERO CONTENT (Home)
  // ----------------------------------------------------------
  heroContent: [
    {
      pageId: 'home',
      welcome: {
        vi: 'Chào mừng đến với',
        en: 'Welcome to',
      },
      title: {
        vi: 'EPath Education',
        en: 'EPath Education',
      },
      subtitle: {
        vi: 'Đưa giáo dục quốc tế chất lượng cao đến gần hơn với gia đình Việt',
        en: 'Bringing high-quality international education closer to Vietnamese families',
      },
      description: {
        vi: 'Chương trình học cá nhân hóa theo chuẩn Common Core (Mỹ) thông qua hệ sinh thái Edmentum International — được kiểm định bởi Cognia & WASC. Học sinh được tiếp cận Cambridge ESOL, FabLab EIU và lộ trình Dual Diploma toàn diện từ Mầm non đến THPT.',
        en: 'Personalised learning aligned with US Common Core standards via the Edmentum International ecosystem — accredited by Cognia & WASC. Students can also access Cambridge ESOL, FabLab EIU and the Dual Diploma pathway from Kindergarten through Grade 12.',
      },
      ctaLabel: {
        vi: 'Khám phá chương trình',
        en: 'Explore programmes',
      },
      ctaUrl: '#programs',
      secondaryCtaLabel: {
        vi: 'Tư vấn miễn phí',
        en: 'Free consultation',
      },
      secondaryCtaUrl: '#contact',
      videoUrl: '',
      videoThumbnail: '',
      backgroundImage: '',
      isActive: true,
    },
    {
      pageId: 'about',
      welcome: {
        vi: 'Về chúng tôi',
        en: 'About us',
      },
      title: {
        vi: 'EPath Education',
        en: 'EPath Education',
      },
      subtitle: {
        vi: 'Hành trình đồng hành cùng gia đình Việt',
        en: 'A journey alongside Vietnamese families',
      },
      description: {
        vi: 'Tầm nhìn, sứ mệnh và giá trị cốt lõi định hình cách chúng tôi xây dựng lộ trình học tập cá nhân hóa cho mỗi học sinh.',
        en: 'Our vision, mission and core values define how we build personalised learning pathways for every student.',
      },
      ctaLabel: {
        vi: 'Tìm hiểu thêm',
        en: 'Learn more',
      },
      ctaUrl: '#intro',
      secondaryCtaLabel: {
        vi: 'Liên hệ',
        en: 'Contact',
      },
      secondaryCtaUrl: '#contact',
      videoUrl: '',
      videoThumbnail: '',
      backgroundImage: '',
      isActive: true,
    },
    {
      pageId: 'programs',
      welcome: {
        vi: 'Chương trình học',
        en: 'Programmes',
      },
      title: {
        vi: 'Lộ trình học tập K–12',
        en: 'K–12 Learning Pathways',
      },
      subtitle: {
        vi: 'Chương trình cá nhân hóa cho mọi cấp học',
        en: 'Personalised programmes for every grade level',
      },
      description: {
        vi: 'Khám phá các chương trình từ Mầm non đến THPT theo chuẩn Common Core & Cambridge.',
        en: 'Discover programmes from Kindergarten to Grade 12 aligned with US Common Core and Cambridge standards.',
      },
      ctaLabel: {
        vi: 'Xem chương trình',
        en: 'View programmes',
      },
      ctaUrl: '#curriculum',
      secondaryCtaLabel: {
        vi: 'Tư vấn miễn phí',
        en: 'Free consultation',
      },
      secondaryCtaUrl: '#contact',
      videoUrl: '',
      videoThumbnail: '',
      backgroundImage: '',
      isActive: true,
    },
    {
      pageId: 'partners',
      welcome: {
        vi: 'Đối tác giáo dục',
        en: 'Education partners',
      },
      title: {
        vi: 'Hệ sinh thái đối tác',
        en: 'Our partner ecosystem',
      },
      subtitle: {
        vi: 'Các tổ chức uy tín đồng hành cùng EPath',
        en: 'Trusted organisations partnering with EPath',
      },
      description: {
        vi: 'Edmentum International, Cambridge Assessment, Cognia & WASC và các đối tác giáo dục khác giúp học sinh tiếp cận chuẩn quốc tế.',
        en: 'Edmentum International, Cambridge Assessment, Cognia & WASC and other education partners help students access international standards.',
      },
      ctaLabel: {
        vi: 'Khám phá',
        en: 'Discover',
      },
      ctaUrl: '#partners',
      secondaryCtaLabel: {
        vi: 'Liên hệ',
        en: 'Contact',
      },
      secondaryCtaUrl: '#contact',
      videoUrl: '',
      videoThumbnail: '',
      backgroundImage: '',
      isActive: true,
    },
    {
      pageId: 'admissions',
      welcome: {
        vi: 'Tuyển sinh 2025',
        en: 'Admissions 2025',
      },
      title: {
        vi: 'Bắt đầu hành trình cùng EPath',
        en: 'Begin your journey with EPath',
      },
      subtitle: {
        vi: 'Đăng ký tư vấn miễn phí',
        en: 'Register for a free consultation',
      },
      description: {
        vi: 'EPath cam kết đồng hành cùng gia đình xuyên suốt quá trình tuyển sinh — từ tư vấn lộ trình đến nhập học.',
        en: 'EPath commits to walking alongside your family throughout admissions — from pathway advising to enrolment.',
      },
      ctaLabel: {
        vi: 'Đăng ký tư vấn',
        en: 'Register now',
      },
      ctaUrl: '#contact',
      secondaryCtaLabel: {
        vi: 'Xem quy trình',
        en: 'See process',
      },
      secondaryCtaUrl: '#step-timeline',
      videoUrl: '',
      videoThumbnail: '',
      backgroundImage: '',
      isActive: true,
    },
    {
      pageId: 'events',
      welcome: {
        vi: 'Sự kiện',
        en: 'Events',
      },
      title: {
        vi: 'Sự kiện nổi bật',
        en: 'Featured events',
      },
      subtitle: {
        vi: 'Workshop, hội thảo & ngày hội giáo dục',
        en: 'Workshops, seminars & education fairs',
      },
      description: {
        vi: 'Cập nhật các sự kiện giáo dục, workshop trải nghiệm và chương trình cố vấn học thuật từ EPath.',
        en: 'Stay up to date with EPath education events, hands-on workshops and academic advising programmes.',
      },
      ctaLabel: {
        vi: 'Xem sự kiện',
        en: 'See events',
      },
      ctaUrl: '#events',
      secondaryCtaLabel: {
        vi: 'Liên hệ',
        en: 'Contact',
      },
      secondaryCtaUrl: '#contact',
      videoUrl: '',
      videoThumbnail: '',
      backgroundImage: '',
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // ABOUT CONTENT – Vision / Mission / Core Values text
  // ----------------------------------------------------------
  aboutContent: [
    {
      introTitle: {
        vi: 'Về EPath Education',
        en: 'About EPath Education',
      },
      introContent: {
        vi: 'EPath Education là đơn vị giáo dục cung cấp giải pháp học tập cá nhân hóa từ Tiểu học đến Trung học, giúp học sinh tiếp cận nền tảng học thuật quốc tế thông qua mô hình Blended Learning (kết hợp Trực tiếp và Trực tuyến) và hệ sinh thái giáo dục toàn diện.\n\nChương trình được xây dựng theo định hướng Common Core State Standards (Mỹ), kết hợp học liệu từ Edmentum International — tổ chức giáo dục uy tín được kiểm định bởi Cognia và WASC — nhằm phát triển năng lực học thuật, kỹ năng tự học và tư duy thế kỷ 21.\n\nEPath kết nối nhà trường, gia đình và các đối tác giáo dục uy tín để xây dựng lộ trình học tập rõ ràng, giúp giáo dục quốc tế chất lượng cao trở nên dễ tiếp cận hơn với các gia đình Việt Nam.\n\nEPath Education được hình thành từ một câu hỏi rất thực của phụ huynh tại hệ thống Mầm non Little People sau hơn 10 năm vận hành: "Sau Mầm non, con sẽ tiếp tục học theo lộ trình nào để không bị đứt gãy?" Từ nhu cầu đó, EPath ra đời như một lời giải có hệ thống.',
        en: 'EPath Education delivers personalised learning pathways from Elementary through High School, helping students access international-standard academics through the Blended Learning model and a holistic education ecosystem.\n\nBuilt on US Common Core State Standards and powered by Edmentum International — accredited by Cognia and WASC — EPath develops academic competency, independent learning skills and 21st-century thinking.\n\nWe connect schools, families and leading education partners into a clear roadmap that makes high-quality international education more accessible to Vietnamese families.\n\nEPath was born from a real question asked by parents at the Little People Kindergarten system after 10+ years: "What comes after Kindergarten — without the pathway breaking?" Our answer is a systematic, end-to-end solution.',
      },
      visionTitle: {
        vi: 'Tầm nhìn (Vision)',
        en: 'Our Vision',
      },
      visionContent: {
        vi: 'EPath hướng đến trở thành một giải pháp giáo dục toàn diện, nơi học sinh và phụ huynh được tiếp cận với định hướng giáo dục Phổ thông quốc tế một cách hiệu quả, rõ ràng và bền vững về chi phí.\n\nEPath không chỉ cung cấp chương trình học, mà xây dựng một hành trình giáo dục xuyên suốt, kết nối giữa nhà trường, gia đình và các nguồn lực giáo dục trong và ngoài nước.\n\nĐịnh hướng của EPath là: Đưa giáo dục quốc tế chất lượng cao trở nên dễ tiếp cận hơn với nhiều gia đình Việt Nam.',
        en: 'To become a holistic education solution that gives students and families efficient, transparent and cost-sustainable access to international-standard schooling — connecting school, family and educational resources at home and abroad.\n\nOur direction: Making high-quality international education more accessible for Vietnamese families.',
      },
      missionTitle: {
        vi: 'Sứ mệnh (Mission)',
        en: 'Our Mission',
      },
      missionContent: {
        vi: 'Xây dựng một môi trường giáo dục kết nối giữa nhà trường – gia đình – chuyên gia, nơi học sinh được tiếp cận chương trình học chuẩn quốc tế, đồng thời tham gia các hoạt động học thuật, trải nghiệm và định hướng kỹ năng.\n\nEPath cam kết đồng hành cùng phụ huynh trong việc phát triển toàn diện cho học sinh, không chỉ trong học tập mà còn trong năng lực tự học, tư duy và kỹ năng sống.',
        en: 'To build an educational environment that connects school – family – experts, where every student accesses international-standard curricula and engages in academic, experiential and skill-oriented programmes.\n\nEPath partners with families to develop the whole learner — academically, intellectually and in life skills.',
      },
      milestones: JSON.stringify([
        {
          year: '2014',
          title: {
            vi: 'Khởi đầu Little People',
            en: 'Little People founded',
          },
          description: {
            vi: 'Hệ thống Mầm non Little People bắt đầu hoạt động, xây dựng nền tảng giáo dục sớm.',
            en: 'Little People Kindergarten system launched, building early-education foundations.',
          },
        },
        {
          year: '2016',
          title: {
            vi: 'Hợp tác Edmentum International',
            en: 'Edmentum International partnership',
          },
          description: {
            vi: 'Ký kết hợp tác chiến lược với Edmentum (USA).',
            en: 'Strategic partnership signed with Edmentum (USA).',
          },
        },
        {
          year: '2024',
          title: {
            vi: 'Ra mắt EPath Education',
            en: 'EPath Education launched',
          },
          description: {
            vi: 'EPath Education chính thức hoạt động, cung cấp lộ trình Mầm non – THPT với mô hình Blended Learning.',
            en: 'EPath Education officially launched, providing K–12 pathways through the Blended Learning model.',
          },
        },
        {
          year: '2025',
          title: {
            vi: 'Mở rộng Cambridge ESOL & FabLab',
            en: 'Cambridge ESOL & FabLab expansion',
          },
          description: {
            vi: 'Tích hợp Hội đồng Khảo thí Cambridge (ESOL) và FabLab EIU vào hệ sinh thái giáo dục.',
            en: 'Cambridge Assessment English (ESOL) and FabLab EIU integrated into the education ecosystem.',
          },
        },
      ]),
      heroImage: '',
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

    // 1) Seed flat collections (existing behaviour)
    for (const [collectionName, items] of Object.entries(seedData)) {
      try {
        const existing = await db.collection(collectionName).limit(1).get()
        if (!existing.empty) {
          results.created.push(`${collectionName}: already populated, skipping duplicate seed`)
          continue
        }
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

    // 2) Seed pages/{pageId}/sections subcollection that powers the
    //    Page Builder (see lib/pages-repo.ts + components/admin/page-sections-editor.tsx).
    for (const [pageId, sections] of Object.entries(pageSectionsSeed)) {
      try {
        const pageSectionsCol = db
          .collection(CollectionNames.pages)
          .doc(pageId)
          .collection('sections')
        for (const s of sections) {
          // 'data' on PageSection carries title/subtitle/body for any
          // custom-edit overlays later. The PageSection type keeps
          // order/isActive/type at the top level (see cms-types.ts).
          const { id, type, order, isActive, ...rest } = s
          await pageSectionsCol.doc(id).set(
            {
              type,
              order,
              isActive,
              pageId,
              data: { ...rest },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          )
          results.created.push(`pages/${pageId}/sections: ${id}`)
        }
      } catch (err) {
        results.errors.push(`pages/${pageId}/sections: ${(err as Error).message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed data created successfully',
      collections: Object.keys(seedData),
      pages: Object.keys(pageSectionsSeed),
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
    pages: Object.keys(pageSectionsSeed),
  })
}
