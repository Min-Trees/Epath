import { config } from 'dotenv'
config({ path: '.env.local' })

import { cert, initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    })

const db = getFirestore(app)

const now = new Date().toISOString()
const commonAudit = {
  status: 'PUBLISHED',
  publishedAt: now,
  rejectionReason: '',
  scheduledAt: '',
  createdByUid: 'admin-seed',
  createdByEmail: 'admin@epath.edu.vn',
  createdByName: 'Admin CMS',
  lastReviewerUid: 'admin-seed',
  lastReviewerEmail: 'admin@epath.edu.vn',
  lastReviewerName: 'Admin CMS',
  createdAt: now,
  updatedAt: now,
}

// --------------------------------------------------------------------------
// 1. ABOUT CONTENT
// --------------------------------------------------------------------------
const aboutContentData = {
  introTitle: {
    vi: 'Về chúng tôi',
    en: 'About Us',
  },
  introContent: {
    vi: `EPath Education được hình thành từ một câu hỏi rất thực của phụ huynh tại hệ thống Mầm non Little People sau hơn 10 năm vận hành: “Sau Mầm non, con sẽ tiếp tục học theo lộ trình nào để không bị đứt gãy?”.

Từ nhu cầu đó, EPath ra đời như một lời giải có hệ thống—không chỉ là một chương trình học, mà là một lộ trình giáo dục xuyên suốt từ Tiểu học đến Trung học, giúp học sinh tiếp cận sớm với nền tảng học thuật quốc tế.

EPath được xây dựng trên niềm tin rằng: Một nền giáo dục hiệu quả không chỉ dừng lại ở việc truyền đạt kiến thức, mà cần tạo ra một hệ sinh thái học tập—nơi nhà trường, gia đình và các chuyên gia cùng đồng hành. Thông qua mô hình học tập Blended Learning (kết hợp Trực tuyến và Trực tiếp), cùng Tổ chức giáo dục Edmentum International (USA) – được kiểm định bởi Cognia và WASC, EPath triển khai chương trình chuẩn hóa theo tiêu chuẩn quốc tế, đồng thời xây dựng cộng đồng phụ huynh có cùng định hướng & mục tiêu giáo dục.`,
    en: `EPath Education was founded from a genuine question of parents at the Little People Kindergarten system after more than 10 years of operation: “After kindergarten, what pathway will our children continue to follow without disruption?”.

From that need, EPath was born as a systematic solution—not just a curriculum, but a seamless educational pathway from Primary through Secondary and High School, helping students access international academic foundations early.

EPath is built on the belief that effective education creates a learning ecosystem where school, family, and educational experts walk together. Through Blended Learning (combining Online and Onsite) alongside Edmentum International (USA) – accredited by Cognia and WASC, EPath delivers international standardized programs while nurturing a community of parents with shared educational goals.`,
  },
  visionTitle: {
    vi: 'Tầm nhìn của EPath',
    en: 'Our Vision',
  },
  visionContent: {
    vi: `EPath hướng đến trở thành một giải pháp giáo dục toàn diện, nơi học sinh và phụ huynh được tiếp cận với định hướng giáo dục Phổ thông quốc tế một cách hiệu quả, rõ ràng và bền vững về chi phí.

EPath không chỉ cung cấp chương trình học, mà xây dựng một hành trình giáo dục xuyên suốt, kết nối giữa nhà trường, gia đình và các nguồn lực giáo dục trong và ngoài nước.

Định hướng của EPath là: Đưa giáo dục quốc tế chất lượng cao trở nên dễ tiếp cận hơn với nhiều gia đình Việt Nam. Thông qua việc kết hợp công nghệ, đội ngũ giáo dục và mô hình học tập linh hoạt, EPath không ngừng mở rộng cơ hội học tập cùng các đối tác uy tín, giúp học sinh phát triển năng lực toàn diện, sẵn sàng hội nhập và theo đuổi hành trình học tập suốt đời trong môi trường toàn cầu.`,
    en: `EPath aspires to become a comprehensive educational solution where students and parents access international K-12 education in an effective, clear, and financially sustainable manner.

EPath builds a continuous educational journey connecting school, family, and educational resources domestically and internationally.

Our vision: Making high-quality international education accessible to more Vietnamese families. Combining technology, dedicated educators, and flexible learning models, EPath continuously expands learning opportunities with prestigious partners, preparing well-rounded students ready to integrate globally.`,
  },
  missionTitle: {
    vi: 'Sứ mệnh của EPath',
    en: 'Our Mission',
  },
  missionContent: {
    vi: `Xây dựng một môi trường giáo dục kết nối giữa nhà trường – gia đình – chuyên gia, nơi học sinh được tiếp cận chương trình học chuẩn quốc tế, đồng thời tham gia các hoạt động học thuật, trải nghiệm và định hướng kỹ năng.

EPath cam kết đồng hành cùng phụ huynh trong việc phát triển toàn diện cho học sinh, không chỉ trong học tập mà còn trong năng lực tự học, tư duy và kỹ năng sống.`,
    en: `Building an educational environment connecting school – family – experts, where students access international standardized programs while engaging in academic activities, experiential learning, and skill development.

EPath commits to accompanying parents in developing well-rounded students in learning, self-study capacity, critical thinking, and essential life skills.`,
  },
  milestones: JSON.stringify([
    {
      year: '2014',
      title: 'Hệ thống Mầm non Little People',
      description: 'Khởi đầu với hơn 10 năm phát triển nền tảng giáo dục mầm non chất lượng cao tại Việt Nam.',
    },
    {
      year: '2024',
      title: 'Thành lập EPath Education',
      description: 'Ra đời giải pháp giáo dục xuyên suốt K-12 kết nối cùng Tổ chức giáo dục Edmentum International (USA).',
    },
    {
      year: '2025',
      title: 'Tích hợp Cambridge ESOL & FabLab EIU',
      description: 'Hoàn thiện hệ sinh thái giáo dục: Ngôn ngữ học thuật Cambridge, Công nghệ thực hành FabLab và Bằng tú tài Mỹ EdOptions.',
    },
  ]),
  heroImage: '',
  ...commonAudit,
}

// --------------------------------------------------------------------------
// 2. CORE VALUES (6 mục)
// --------------------------------------------------------------------------
const coreValuesData = [
  {
    icon: 'Navigation',
    title: {
      vi: '1. Lộ trình học tập xuyên suốt',
      en: '1. Seamless Learning Pathway',
    },
    description: {
      vi: 'Xây dựng hành trình học tập liền mạch từ nền tảng Mầm non (Little People) đến Trung học Phổ thông, đảm bảo tính liên tục và nhất quán trong phát triển học thuật.',
      en: 'Building a seamless educational journey from kindergarten foundations through high school, ensuring continuity and consistency in academic growth.',
    },
    order: 0,
    isActive: true,
    imageUrl: '/images/core-values/1.png',
    ...commonAudit,
  },
  {
    icon: 'Award',
    title: {
      vi: '2. Chuẩn học thuật quốc tế được kiểm định',
      en: '2. Accredited International Standards',
    },
    description: {
      vi: 'Triển khai chương trình hợp tác với tổ chức giáo dục Edmentum International (USA), được kiểm định bởi Cognia và WASC, đảm bảo chất lượng và giá trị công nhận toàn cầu.',
      en: 'Implementing programs in partnership with Edmentum International (USA), accredited by Cognia and WASC, ensuring quality and global recognition.',
    },
    order: 1,
    isActive: true,
    imageUrl: '/images/core-values/2.png',
    ...commonAudit,
  },
  {
    icon: 'Layers',
    title: {
      vi: '3. Mô hình học tập kết hợp (Blended Learning)',
      en: '3. Blended Learning Model',
    },
    description: {
      vi: 'Tích hợp linh hoạt giữa học trực tuyến và trực tiếp, tối ưu hiệu quả tiếp thu và cá nhân hóa trải nghiệm học tập.',
      en: 'Flexible integration of online and onsite learning, optimizing comprehension and personalizing the educational experience.',
    },
    order: 2,
    isActive: true,
    imageUrl: '/images/core-values/3.png',
    ...commonAudit,
  },
  {
    icon: 'UserCheck',
    title: {
      vi: '4. Cá nhân hóa lộ trình học tập',
      en: '4. Personalized Learning Pathways',
    },
    description: {
      vi: 'Thiết kế lộ trình dựa trên năng lực, mục tiêu và định hướng của từng học sinh, thông qua hệ thống đánh giá học thuật và tư vấn chuyên sâu.',
      en: 'Designing pathways tailored to each student’s abilities, goals, and aspirations through academic assessment and in-depth advisory.',
    },
    order: 3,
    isActive: true,
    imageUrl: '/images/core-values/4.png',
    ...commonAudit,
  },
  {
    icon: 'FileText',
    title: {
      vi: '5. Phát triển năng lực toàn diện & hồ sơ cá nhân',
      en: '5. Comprehensive Competency & Student Profile',
    },
    description: {
      vi: 'Kết hợp học thuật với hoạt động ngoại khóa, kỹ năng và trải nghiệm thực tiễn nhằm xây dựng student profile chuẩn quốc tế, nâng cao lợi thế cạnh tranh trong tuyển sinh toàn cầu.',
      en: 'Combining academics with extracurriculars, skills, and experiential learning to build an international-standard student profile.',
    },
    order: 4,
    isActive: true,
    imageUrl: '/images/core-values/5.png',
    ...commonAudit,
  },
  {
    icon: 'Network',
    title: {
      vi: '6. Hệ sinh thái kết nối giáo dục',
      en: '6. Connected Educational Ecosystem',
    },
    description: {
      vi: 'Phát triển môi trường học tập mở, kết nối nhà trường – gia đình – chuyên gia – đối tác quốc tế, mở rộng cơ hội học tập thông qua workshop, hoạt động trải nghiệm và định hướng giáo dục.',
      en: 'Fostering an open learning environment connecting schools, families, experts, and international partners through workshops and hands-on activities.',
    },
    order: 5,
    isActive: true,
    imageUrl: '/images/core-values/6.png',
    ...commonAudit,
  },
]

// --------------------------------------------------------------------------
// 3. PROGRAMS (10 khóa học / chương trình)
// --------------------------------------------------------------------------
const programsData = [
  {
    slug: 'tieng-anh-but-pha',
    level: 'kindergarten',
    ageRange: '3 – 16 tuổi (Mầm non đến THCS)',
    title: {
      vi: 'Chương trình Tiếng Anh Bứt Phá',
      en: 'English Breakthrough Program',
    },
    shortDescription: {
      vi: 'Xây dựng theo giáo trình chính thức của Cambridge University Press, phát triển ESL chuẩn Cambridge và tiếng Anh học thuật làm công cụ tiếp cận tri thức.',
      en: 'Built on official Cambridge University Press curriculum, developing Cambridge ESL and academic English as a core learning tool.',
    },
    content: {
      vi: `<p>Chương trình Tiếng Anh Bứt Phá tại EPath Education được xây dựng theo hệ thống giáo trình chính thức của Cambridge University Press, phát triển tiếng Anh như một ngôn ngữ thứ hai (English as a Second Language – ESL) dành cho học sinh từ cấp độ Mầm non đến Trung học Cơ Sở.</p>
<p>Chương trình bám sát khung năng lực của Cambridge English Qualifications, giúp học sinh hình thành và phát triển nền tảng tiếng Anh theo lộ trình rõ ràng và có hệ thống theo chuẩn khung năng lực quốc tế.</p>
<h4>Điểm khác biệt của Tiếng Anh Bứt Phá:</h4>
<ol>
  <li><strong>Đánh giá theo chuẩn Cambridge Quốc Tế:</strong> EPath Education sử dụng kết quả đánh giá của Hội đồng Khảo thí Cambridge làm cơ sở quan trọng để xác định năng lực, xếp lớp và theo dõi sự tiến bộ, giúp năng lực được nhìn nhận trên thang đo quốc tế nhất quán thay vì các bài kiểm tra nội bộ tương đối.</li>
  <li><strong>Học tiếng Anh để sẵn sàng học bằng tiếng Anh:</strong> Hướng đến việc giúp học sinh xây dựng năng lực tiếng Anh đủ vững để học tập, tiếp cận tri thức và thích ứng với môi trường quốc tế. Sử dụng ngôn ngữ như một công cụ học tập.</li>
</ol>
<h4>Lộ trình theo từng độ tuổi:</h4>
<ul>
  <li><strong>Mầm non (3 - 6 tuổi):</strong> Phát triển phản xạ nghe hiểu, phát âm, từ vựng, Early Literacy và khái niệm Toán cơ bản bằng tiếng Anh qua CLIL và Topic-based Learning.</li>
  <li><strong>Tiểu học (7 - 12 tuổi):</strong> Phát triển toàn diện 4 kỹ năng Nghe – Nói – Đọc – Viết, mở rộng từ vựng học thuật qua CLIL Toán & Khoa học, Project-based Learning và thuyết trình.</li>
  <li><strong>THCS (13 - 16 tuổi):</strong> Hoàn thiện tiếng Anh học thuật định hướng IELTS, rèn luyện kỹ năng viết luận, thuyết trình, tranh biện và tư duy phản biện.</li>
</ul>`,
      en: `<p>The English Breakthrough Program at EPath Education follows the official Cambridge University Press curriculum, developing English as a Second Language (ESL) from Kindergarten to Middle School.</p>`,
    },
    order: 0,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Đăng ký tư vấn', en: 'Apply Now' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'nen-tang-hoc-thuat-quoc-te',
    level: 'kindergarten',
    ageRange: '4 – 7 tuổi (Mầm non – Lớp 2)',
    title: {
      vi: '1/ Khóa học Nền tảng Học thuật Quốc Tế (Mầm Non – Grade 2)',
      en: '1/ International Academic Foundation (K – Grade 2)',
    },
    shortDescription: {
      vi: 'Xây dựng nền tảng tiền học thuật, Phonics, Toán học, Khoa học bằng tiếng Anh với 50% Giáo viên Nước Ngoài & 50% Giáo viên Song ngữ.',
      en: 'Building pre-academic foundations with Phonics, Math, and Science in English taught by 50% International & 50% Bilingual teachers.',
    },
    content: {
      vi: `<p>Chương trình tập trung xây dựng nền tảng tiền học thuật, giúp trẻ làm quen với việc đọc, viết, học Toán và khám phá Khoa học bằng tiếng Anh trước khi bước vào môi trường học thuật chuyên sâu.</p>
<h4>Nội dung học tập:</h4>
<ul>
  <li><strong>Giai đoạn Mầm non:</strong> Trẻ bắt đầu với Letter Sounds và Phonics để hiểu mối liên hệ chữ cái – âm thanh. Luyện Blending Sounds ghép âm, đánh vần từ CVC đến cấu trúc phức tạp. Làm quen với Toán học và STEM khám phá thế giới xung quanh bằng tiếng Anh.</li>
  <li><strong>Grade 1 và Grade 2:</strong> Chuyển từ xây dựng ngôn ngữ sang sử dụng tiếng Anh để học tập. Thời lượng khoảng 5 giờ/tuần. Tập trung vào Ngữ Văn Mỹ (ELA) và Toán học bằng tiếng Anh (đọc hiểu đề bài, trình bày suy luận).</li>
</ul>
<h4>Môi trường học tập:</h4>
<p>Được triển khai với đội ngũ <strong>50% Giáo viên Nước Ngoài</strong> (ưu tiên nền tảng Elementary Education) và <strong>50% Giáo viên Song ngữ</strong> (IELTS 7.0+, hỗ trợ học sinh Việt Nam tiếp cận và củng cố kiến thức).</p>`,
      en: `<p>Building pre-academic foundations for students from Kindergarten through Grade 2...</p>`,
    },
    order: 1,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Chi tiết chương trình', en: 'View Program' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'tieu-hoc-foundation-program',
    level: 'elementary',
    ageRange: '8 – 11 tuổi (Lớp 3 – Lớp 5)',
    title: {
      vi: '2.1 Tiểu học Tiêu chuẩn – Foundation Program (Lớp 3 – 5)',
      en: '2.1 Elementary Foundation Program (Grades 3 – 5)',
    },
    shortDescription: {
      vi: 'Xây dựng kiến thức cốt lõi 3 môn Toán, Ngữ văn Mỹ (ELA) và Khoa học theo lộ trình vừa sức kết hợp Online và Onsite (~5h/tuần).',
      en: 'Core competencies in Math, US ELA, and Science via a balanced Online & Onsite model (~5 hrs/week).',
    },
    content: {
      vi: `<p>Foundation Program dành cho học sinh muốn phát triển kiến thức học thuật, tư duy và kỹ năng học tập bằng tiếng Anh theo một lộ trình vừa sức. Chương trình tập trung vào các kiến thức cốt lõi của 3 môn: Toán học, Ngữ Văn Mỹ (ELA) và Khoa học.</p>
<h4>Nội dung học tập:</h4>
<ul>
  <li><strong>Toán học:</strong> Phát triển tư duy logic và giải quyết vấn đề, đọc hiểu đề bài và trình bày lời giải bằng tiếng Anh.</li>
  <li><strong>Ngữ văn Mỹ (ELA):</strong> Nâng cao đọc hiểu, viết, mở rộng vốn từ vựng học thuật và tiếp nhận thông tin từ tài liệu.</li>
  <li><strong>Khoa học:</strong> Khám phá khái niệm qua quan sát, đặt câu hỏi, phân tích và giải thích các hiện tượng tự nhiên bằng tiếng Anh.</li>
</ul>
<h4>Mô hình học tập:</h4>
<p>Kết hợp Online và Onsite (tổng thời lượng ~5 giờ/tuần) cùng Giáo viên Quốc tế và Giáo viên Song ngữ, đảm bảo học sinh tiếp thu hiệu quả mà không bị quá tải.</p>`,
      en: `<p>Elementary Foundation Program for Grades 3 to 5...</p>`,
    },
    order: 2,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Đăng ký kiểm tra đầu vào', en: 'Placement Test' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'tieu-hoc-us-academic-program',
    level: 'elementary',
    ageRange: '8 – 11 tuổi (Lớp 3 – Lớp 5)',
    title: {
      vi: '2.2 Tiểu học Quốc tế – U.S Academic Program (Lớp 3 – 5)',
      en: '2.2 Elementary U.S Academic Program (Grades 3 – 5)',
    },
    shortDescription: {
      vi: 'Đầy đủ 4 môn chính khóa Tiểu học Mỹ (Math, ELA, Science, Social Studies) trên Edmentum 12 tháng cùng Cố vấn học tập riêng với học phí chưa đến 1/3.',
      en: 'Full 4 core US Elementary subjects (Math, ELA, Science, Social Studies) on Edmentum for 12 months with dedicated Academic Advisor at under 1/3 the cost.',
    },
    content: {
      vi: `<p>U.S Academic Program là lựa chọn phù hợp với học sinh có nền tảng học tập tốt và mong muốn chuẩn bị toàn diện cho môi trường giáo dục Song ngữ hoặc Quốc tế.</p>
<h4>Nội dung học tập:</h4>
<p>Bao gồm đầy đủ 4 môn bắt buộc theo chuẩn Giáo dục Mỹ: <strong>Toán (Math), Ngôn ngữ (ELA), Khoa học (Science) và Xã hội học (Social Studies)</strong>, cùng các môn tự chọn (Elective) trên tài khoản học tập cá nhân.</p>
<h4>Mô hình học tập & Lợi ích:</h4>
<ul>
  <li>Mỗi học sinh sở hữu tài khoản học tập Edmentum International 12 tháng theo mô hình Blended Learning.</li>
  <li>Tham gia các lớp giảng dạy kiến thức cốt lõi với Giáo viên Quốc tế và Song ngữ.</li>
  <li>Được phân công riêng một <strong>Cố vấn học tập (Academic Advisor)</strong> theo dõi sát sao lộ trình và tutor bổ trợ kiến thức.</li>
  <li>Xây dựng năng lực học thuật tương đương học sinh trường quốc tế với <strong>học phí chưa đến 1/3 mỗi năm</strong>.</li>
</ul>`,
      en: `<p>Elementary U.S Academic Program for Grades 3 to 5...</p>`,
    },
    order: 3,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Tìm hiểu lộ trình', en: 'Learn More' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'thcs-foundation-program',
    level: 'middle',
    ageRange: '11 – 14 tuổi (Lớp 6 – Lớp 8)',
    title: {
      vi: '3.1 THCS Foundation – Lộ trình IELTS 5.5 & Kiến thức cốt lõi',
      en: '3.1 Middle School Foundation – IELTS 5.5 & Core Pathway',
    },
    shortDescription: {
      vi: 'Chinh phục IELTS Band 5.5 vào cuối lớp 8 và học thử 1 tín chỉ Toán/Khoa học làm căn cứ định hướng lộ trình THPT.',
      en: 'Achieving IELTS Band 5.5 by Grade 8 and testing 1 core credit in Math/Science to guide high school pathways.',
    },
    content: {
      vi: `<p>Trung học Cơ sở (Grade 6-8) là giai đoạn chuyển tiếp quan trọng trước khi học sinh chính thức lựa chọn định hướng học tập THPT (Grade 9-12).</p>
<h4>Lộ trình chi tiết:</h4>
<ul>
  <li><strong>Lớp 6 và 7:</strong> Tập trung xây dựng nền tảng ngôn ngữ vững chắc hướng tới mục tiêu IELTS Academic Band 5.5 khi hoàn thành lớp 8.</li>
  <li><strong>Hè năm lớp 8:</strong> Song song với khóa học IELTS, học sinh được trải nghiệm học thử 1 tín chỉ quan trọng (Toán hoặc Khoa học) theo sở thích để nhà trường và phụ huynh đánh giá chính xác năng lực học thuật.</li>
  <li><strong>Định hướng tiếp theo:</strong> Kết quả lớp 8 là căn cứ quyết định tiếp tục theo lộ trình Song bằng Việt – Mỹ hay chuyển sang Tú tài Mỹ toàn phần ở bậc THPT.</li>
</ul>`,
      en: `<p>Middle School Foundation Pathway for Grades 6 to 8...</p>`,
    },
    order: 4,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Tư vấn lộ trình', en: 'Consultation' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'thcs-us-middle-school-pathway',
    level: 'middle',
    ageRange: '11 – 14 tuổi (Lớp 6 – Lớp 8)',
    title: {
      vi: '3.2 THCS Quốc tế – U.S Middle School Pathway (EdOptions Academy)',
      en: '3.2 U.S Middle School Pathway (EdOptions Academy)',
    },
    shortDescription: {
      vi: 'Trở thành học sinh chính thức của EdOptions Academy, đạt IELTS 6.0 ở lớp 7 và tích lũy sớm tín chỉ tính vào bằng Tú tài Mỹ.',
      en: 'Official student of EdOptions Academy, achieving IELTS 6.0 in Grade 7 and earning credits toward US Diploma.',
    },
    content: {
      vi: `<p>Dành cho học sinh đã có nền tảng học thuật quốc tế vững chắc. Học sinh chính thức trở thành học sinh của <strong>Trường học Trực tuyến EdOptions Academy</strong> thuộc Edmentum International.</p>
<h4>Nội dung & Mục tiêu:</h4>
<ul>
  <li>Chinh phục chứng chỉ <strong>IELTS Band 6.0 vào cuối năm lớp 7</strong>.</li>
  <li>Đăng ký học theo tín chỉ chính thức 1-2 môn học chính (Math và Science) theo chuẩn Mỹ.</li>
  <li>Hoàn thành bài học với tỷ lệ đạt trên 80% để các tín chỉ này được tính trực tiếp vào <strong>21.5 tín chỉ yêu cầu của bằng Tú tài Mỹ (U.S Diploma)</strong> ở bậc THPT.</li>
  <li>Sở hữu bảng điểm chính thức của trường Mỹ với chi phí chỉ bằng 1/3 trường quốc tế tại Việt Nam.</li>
</ul>`,
      en: `<p>U.S Middle School Pathway on EdOptions Academy...</p>`,
    },
    order: 5,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Đăng ký kiểm tra tín chỉ', en: 'Credit Check' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'high-dual-diploma',
    level: 'high',
    ageRange: '14 – 18 tuổi (Lớp 9 – Lớp 12)',
    title: {
      vi: '4.1 Dual Diploma Pathway – Lộ trình Song bằng Việt – Mỹ',
      en: '4.1 Dual Diploma Pathway – Vietnam & U.S High School Diploma',
    },
    shortDescription: {
      vi: 'Học song song THPT Việt Nam và EdOptions Academy, tích lũy 5 tín chỉ + 1 tín chỉ AP, tốt nghiệp nhận 2 bằng và IELTS 7.0.',
      en: 'Concurrent study of Vietnam High School & EdOptions Academy, earning 5 core + 1 AP credit, graduating with dual diplomas and IELTS 7.0.',
    },
    content: {
      vi: `<p>Dual Diploma là lộ trình học tập cho phép học sinh theo học đồng thời chương trình THPT tại Việt Nam và chương trình THPT Hoa Kỳ qua EdOptions Academy.</p>
<h4>Đặc điểm nổi bật:</h4>
<ul>
  <li>Học sinh vẫn duy trì học tại trường Công lập hoặc Tư thục hiện tại ở Việt Nam. Các môn học quốc tế được bố trí chủ yếu vào các kỳ hè và một phần online trong năm học để không làm gián đoạn việc học chính khóa.</li>
  <li>Đến cuối lớp 11, học sinh hoàn thành 5.0 tín chỉ tiêu chuẩn. Hè trước lớp 12, học sinh chọn thêm 1 môn nâng cao AP (Advanced Placement - College Board) nâng tổng lên 6.0 tín chỉ.</li>
  <li><strong>Văn bằng khi tốt nghiệp:</strong> Bằng tốt nghiệp THPT Việt Nam + Bằng tốt nghiệp THPT Hoa Kỳ (U.S High School Diploma) + Chứng chỉ IELTS 7.0 + Chứng chỉ AP.</li>
  <li>Mở rộng cơ hội xét tuyển và săn học bổng vào các trường Đại học quốc tế tại Việt Nam và toàn cầu.</li>
</ul>`,
      en: `<p>Dual Diploma Pathway concurrently earning Vietnam & US High School diplomas...</p>`,
    },
    order: 6,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Tư vấn Song bằng', en: 'Dual Diploma Info' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'high-fulltime-homeschool',
    level: 'high',
    ageRange: '14 – 18 tuổi (Lớp 9 – Lớp 12)',
    title: {
      vi: '4.2 U.S Diploma Pathway – Lộ trình Tú tài Mỹ Toàn phần',
      en: '4.2 U.S Diploma Pathway – Full-Time American High School',
    },
    shortDescription: {
      vi: 'Học toàn thời gian theo chương trình EdOptions Academy, tích lũy 21.5 tín chỉ, luyện SAT/ACT và AP, tốt nghiệp như học sinh bản địa Mỹ.',
      en: 'Full-time study under EdOptions Academy, earning all 21.5 credits, preparing SAT/ACT and AP, graduating as a native US student.',
    },
    content: {
      vi: `<p>Lộ trình dành cho học sinh mong muốn học tập toàn thời gian và tốt nghiệp Phổ thông hoàn toàn theo chuẩn Hoa Kỳ thông qua EdOptions Academy.</p>
<h4>Ưu thế vượt trội:</h4>
<ul>
  <li>Tích lũy đầy đủ <strong>21.5 tín chỉ</strong> (18.5 tín chỉ THPT + 3.0 tín chỉ từ THCS) theo tiêu chuẩn giáo dục Hoa Kỳ.</li>
  <li>Tập trung thời gian ôn luyện <strong>SAT/ACT</strong> và các môn <strong>AP College Board</strong> để nâng cao tính cạnh tranh vào các trường đại học top đầu Mỹ, Canada, Úc...</li>
  <li>Học sinh được các trường đại học công nhận như một <strong>học sinh bản địa Mỹ</strong> khi nộp hồ sơ xét tuyển.</li>
  <li>Cơ hội tốt nghiệp sớm hơn thời hạn khi hoàn thành đủ tín chỉ, rút ngắn lộ trình vào đại học danh tiếng mà không cần hoàn tất lớp 12 Việt Nam.</li>
  <li>Đồng hành xây dựng Hồ sơ Ngoại khóa (Student Portfolio) và rèn luyện kỹ năng tự chủ thế kỷ 21.</li>
</ul>`,
      en: `<p>U.S Fulltime Diploma Pathway under EdOptions Academy...</p>`,
    },
    order: 7,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Tư vấn Tú tài Mỹ', en: 'U.S Diploma Info' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'phat-trien-nang-luc-ca-nhan',
    level: 'middle',
    ageRange: 'Mầm non đến Lớp 12',
    title: {
      vi: 'Phát triển Năng lực Cá nhân & Hồ sơ Ngoại khóa',
      en: 'Personal Development & Extracurricular Portfolio',
    },
    shortDescription: {
      vi: 'Đấu trường học thuật Olympiad quốc tế (IMEC, STEMCO, TIMO), dự án STEAM, Robotics, Lễ hội Văn học và xây dựng Academic Portfolio.',
      en: 'International Olympiad competitions (IMEC, STEMCO, TIMO), STEAM projects, Robotics, Literature Festivals, and Academic Portfolio.',
    },
    content: {
      vi: `<p>Bên cạnh chương trình học thuật, EPath Education xây dựng hệ thống khóa học kỹ năng, hoạt động ngoại khóa và trải nghiệm thực tế nhằm tạo điều kiện để học sinh vận dụng kiến thức vào thực tế.</p>
<h4>Các hoạt động cốt lõi:</h4>
<ul>
  <li><strong>Giao lưu & Trải nghiệm học thuật:</strong> Tham quan, học tập thực tế cùng các đối tác giáo dục, doanh nghiệp trong và ngoài nước.</li>
  <li><strong>Đấu trường học thuật quốc tế:</strong> Tham gia các kỳ thi Olympiad uy tín: IMEC, STEMCO, GMEC, TIMO... để thử thách bản thân và tích lũy thành tích.</li>
  <li><strong>Sự kiện & Lễ hội thường niên:</strong> Lễ hội Văn học Việt Nam và Quốc tế, Trại hè, Robotics và dự án STEAM.</li>
  <li><strong>Dự án kỹ năng & Hồ sơ học tập cá nhân:</strong> Rèn luyện Critical Thinking, Research Skills, Public Speaking, Leadership và Community Service để hoàn thiện Academic Portfolio.</li>
</ul>`,
      en: `<p>Personal development and extracurricular activities at EPath Education...</p>`,
    },
    order: 8,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Xem các hoạt động', en: 'Explore Activities' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
  {
    slug: 'co-van-lo-trinh-quoc-te',
    level: 'high',
    ageRange: 'Phụ huynh & Học sinh K-12',
    title: {
      vi: 'Cố vấn Lộ trình Học tập Quốc tế',
      en: 'International Pathway Advisory Service',
    },
    shortDescription: {
      vi: 'Dịch vụ cố vấn chuyên sâu đồng hành cùng học sinh và phụ huynh xác định mục tiêu, lựa chọn chương trình và lập kế hoạch dài hạn.',
      en: 'In-depth advisory service guiding students and parents in defining goals, choosing programs, and building long-term academic plans.',
    },
    content: {
      vi: `<p>Lộ trình học tập quốc tế không giống nhau đối với mọi học sinh. Năng lực, sở thích, mục tiêu nghề nghiệp và kế hoạch tương lai của mỗi em đều có sự khác biệt.</p>
<p>EPath Education cung cấp dịch vụ cố vấn lộ trình học tập quốc tế, đồng hành cùng học sinh và phụ huynh trong việc:</p>
<ul>
  <li>Xác định mục tiêu học tập và đánh giá năng lực ngôn ngữ, học thuật hiện tại.</li>
  <li>Lựa chọn chương trình và pathway phù hợp nhất theo từng độ tuổi (Cambridge ESL, Edmentum, Dual Diploma, US Fulltime Diploma).</li>
  <li>Lập kế hoạch tích lũy tín chỉ học thuật và chuẩn bị các chứng chỉ chuẩn hóa quốc tế (IELTS, AP, SAT/ACT).</li>
  <li>Định hướng ngành nghề, chọn trường đại học và xây dựng chiến lược săn học bổng du học toàn cầu.</li>
</ul>`,
      en: `<p>Comprehensive international educational advisory services at EPath Education...</p>`,
    },
    order: 9,
    isActive: true,
    imageUrl: '',
    ctaLabel: { vi: 'Đặt lịch hẹn cố vấn', en: 'Book Consultation' },
    ctaUrl: '#contact',
    objectives: [],
    highlights: [],
    ...commonAudit,
  },
]

// --------------------------------------------------------------------------
// 4. PARTNERS (4 đối tác quốc tế)
// --------------------------------------------------------------------------
const partnersData = [
  {
    name: 'Edmentum International & EdOptions Academy',
    category: 'curriculum',
    website: 'https://www.edmentum.com',
    description: {
      vi: 'Đơn vị cung cấp học liệu số K-12 hàng đầu Hoa Kỳ với hơn 60 năm kinh nghiệm, phục vụ 5.2 triệu học sinh tại 100+ quốc gia. Trường trực tuyến EdOptions Academy được kiểm định bởi Cognia và WASC, được College Board phê duyệt chương trình AP và NCAA phê duyệt.',
      en: 'Leading US K-12 digital curriculum provider with over 60 years of experience, serving 5.2 million students across 100+ countries. EdOptions Academy is accredited by Cognia and WASC, and approved by College Board and NCAA.',
    },
    features: [
      { vi: 'Kiểm định chất lượng bởi Cognia và WASC', en: 'Accredited by Cognia and WASC' },
      { vi: 'Chương trình AP được College Board phê duyệt', en: 'AP courses approved by College Board' },
      { vi: '92% học sinh tốt nghiệp đỗ vào các trường Đại học Mỹ', en: '92% graduates accepted into US universities' },
      { vi: 'Hệ thống đánh giá AI chẩn đoán năng lực Exact Path', en: 'AI-driven Exact Path adaptive diagnostic assessment' },
    ],
    isFeatured: true,
    order: 0,
    isActive: true,
    logoUrl: '',
    ...commonAudit,
  },
  {
    name: 'Hội đồng Khảo thí Cambridge Assessment English',
    category: 'certification',
    website: 'https://www.cambridgeenglish.org',
    description: {
      vi: 'Tổ chức hàng đầu thế giới về đánh giá và chứng nhận năng lực tiếng Anh thuộc Đại học Cambridge (Anh Quốc). EPath tích hợp trực tiếp khung năng lực Cambridge (Starters, Movers, Flyers, IELTS) làm thang đo quốc tế chuẩn mực cho học sinh.',
      en: 'World-leading English language assessment organization from the University of Cambridge (UK). EPath integrates Cambridge qualifications as a transparent benchmark for students.',
    },
    features: [
      { vi: 'Thang đo quốc tế rõ ràng và nhất quán', en: 'Consistent and transparent international benchmark' },
      { vi: 'Rút ngắn giai đoạn nền tảng, học tiếng Anh như công cụ', en: 'Streamlining foundation stages to use English as a learning tool' },
      { vi: 'Định hướng lộ trình từ Starters đến IELTS Academic', en: 'Clear pathway from Young Learners to IELTS Academic' },
    ],
    isFeatured: true,
    order: 1,
    isActive: true,
    logoUrl: '',
    ...commonAudit,
  },
  {
    name: 'FabLab EIU – Trường Đại học Quốc tế Miền Đông',
    category: 'lab',
    website: 'https://eiu.edu.vn',
    description: {
      vi: 'Không gian sáng tạo công nghệ (Makerspace) trực thuộc ĐH Quốc tế Miền Đông, nơi học sinh EPath trực tiếp trải nghiệm thiết kế 3D, in 3D, lập trình, robotics và chế tạo sản phẩm ứng dụng kiến thức vào thực tiễn.',
      en: 'Innovation makerspace under Eastern International University, providing hands-on 3D design, 3D printing, robotics, and STEM engineering for EPath students.',
    },
    features: [
      { vi: 'Trực tiếp trải nghiệm công nghệ thiết kế và in 3D', en: 'Hands-on 3D design and printing technologies' },
      { vi: 'Lập trình, chế tạo robotics và dự án STEAM', en: 'Coding, robotics engineering, and STEAM projects' },
      { vi: 'Biến kiến thức lý thuyết thành năng lực thực hành', en: 'Transforming theoretical knowledge into practical skills' },
    ],
    isFeatured: true,
    order: 2,
    isActive: true,
    logoUrl: '',
    ...commonAudit,
  },
  {
    name: 'Mạng lưới Đối tác Giáo dục Quốc tế',
    category: 'other',
    website: 'https://epath.edu.vn',
    description: {
      vi: 'Mạng lưới kết nối các trường quốc tế và tổ chức giáo dục uy tín tại Hoa Kỳ, Anh Quốc, Úc, Canada, Châu Âu nhằm đa dạng hóa lựa chọn bằng cấp, dự bị đại học và cơ hội học bổng.',
      en: 'Academic network connecting leading institutions across the US, UK, Australia, Canada, and Europe for diverse diplomas and global scholarship pathways.',
    },
    features: [
      { vi: 'Đa dạng hóa các lựa chọn bằng cấp quốc tế', en: 'Diverse international diploma options' },
      { vi: 'Tư vấn chuyển tiếp và học bổng du học toàn cầu', en: 'Global university transfer and scholarship guidance' },
    ],
    isFeatured: false,
    order: 3,
    isActive: true,
    logoUrl: '',
    ...commonAudit,
  },
]

// --------------------------------------------------------------------------
// 5. FAQS (12 câu hỏi thường gặp)
// --------------------------------------------------------------------------
const faqsData = [
  {
    category: 'general',
    question: {
      vi: '1. EPath Education dành cho học sinh ở độ tuổi nào?',
      en: '1. What age groups does EPath Education serve?',
    },
    answer: {
      vi: 'EPath Education cung cấp các chương trình học tập dành cho học sinh từ Mầm non đến Trung học Phổ thông, với lộ trình được thiết kế theo từng giai đoạn phát triển. Học sinh có thể bắt đầu từ chương trình Tiếng Anh Bứt Phá, Nền tảng Học thuật Quốc tế và tiếp tục phát triển theo các lộ trình học tập quốc tế ở bậc Tiểu học, Trung học Cơ sở và Trung học Phổ thông.',
      en: 'EPath Education provides programs from Kindergarten through High School, with pathways designed for each developmental stage.',
    },
    order: 0,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'admissions',
    question: {
      vi: '2. Học sinh chưa có nền tảng tiếng Anh có thể học tại EPath Education không?',
      en: '2. Can students without an English background study at EPath?',
    },
    answer: {
      vi: 'Có. Học sinh được đánh giá năng lực đầu vào trước khi bắt đầu chương trình. Kết quả đánh giá giúp EPath xác định trình độ hiện tại và tư vấn cấp độ, chương trình phù hợp thay vì áp dụng một lộ trình giống nhau cho tất cả học sinh.',
      en: 'Yes. Students undergo a placement assessment before beginning. Results help determine current levels and tailor appropriate pathways.',
    },
    order: 1,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'program',
    question: {
      vi: '3. Chương trình Tiếng Anh Bứt Phá khác gì so với các khóa học tiếng Anh thông thường?',
      en: '3. How does the English Breakthrough Program differ from regular English courses?',
    },
    answer: {
      vi: 'Tiếng Anh Bứt Phá không chỉ tập trung vào việc phát triển khả năng giao tiếp mà hướng đến xây dựng năng lực tiếng Anh học thuật theo từng giai đoạn. Chương trình được xây dựng dựa trên hệ thống giáo trình của Cambridge University Press và bám sát khung năng lực Cambridge English Qualifications, giúp học sinh từng bước phát triển Nghe – Nói – Đọc – Viết và sử dụng tiếng Anh như một công cụ cho học tập.',
      en: 'It focuses on academic English using official Cambridge University Press curriculum and qualifications, preparing students to use English as a learning tool.',
    },
    order: 2,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'program',
    question: {
      vi: '4. Học tiếng Anh tại EPath có phải để chuẩn bị cho chương trình học bằng tiếng Anh không?',
      en: '4. Is learning English at EPath aimed at studying subjects in English?',
    },
    answer: {
      vi: 'Đúng. Một trong những định hướng của chương trình là giúp học sinh từng bước chuyển từ “học tiếng Anh” sang “học bằng tiếng Anh”. Bên cạnh năng lực ngôn ngữ, học sinh được phát triển vốn từ vựng học thuật, đọc hiểu, viết, tư duy và khả năng tiếp cận các nội dung môn học bằng tiếng Anh. Đây là nền tảng để học sinh có thể tiếp tục các chương trình Song ngữ, Quốc tế hoặc các lộ trình học tập theo hệ thống giáo dục Mỹ.',
      en: 'Yes. The curriculum shifts students from “learning English” to “learning in English” with academic vocabulary, reading comprehension, and subject content.',
    },
    order: 3,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'program',
    question: {
      vi: '5. Foundation Track là gì và phù hợp với học sinh nào?',
      en: '5. What is the Foundation Track and who is it suitable for?',
    },
    answer: {
      vi: 'Foundation Track – Nền tảng Học thuật Quốc tế được thiết kế cho học sinh muốn xây dựng nền tảng kiến thức học thuật bằng tiếng Anh trước khi tiếp cận các chương trình quốc tế chuyên sâu. Tùy theo độ tuổi, học sinh được phát triển các môn học như ELA (English Language Arts), Mathematics và Science, đồng thời rèn luyện khả năng đọc hiểu, tư duy và sử dụng tiếng Anh trong quá trình học tập.',
      en: 'Foundation Track builds academic subject foundations (ELA, Math, Science) before intensive international study.',
    },
    order: 4,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'program',
    question: {
      vi: '6. Semi-Homeschooling có phải là học tại nhà hoàn toàn không?',
      en: '6. Does Semi-Homeschooling mean studying entirely at home?',
    },
    answer: {
      vi: 'Không. Semi-Homeschooling là mô hình kết hợp giữa học trực tuyến và học trực tiếp (Blended Learning), giúp học sinh tiếp cận chương trình học thuật quốc tế nhưng vẫn duy trì môi trường tương tác, hỗ trợ và trải nghiệm học tập trực tiếp. Mô hình được xây dựng theo từng cấp độ và lộ trình học tập, phù hợp với học sinh có nhu cầu phát triển kiến thức học thuật bằng tiếng Anh nhưng cần một hình thức học linh hoạt.',
      en: 'No. Semi-Homeschooling combines online and in-person learning (Blended Learning), maintaining social interaction and hands-on guidance.',
    },
    order: 5,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'program',
    question: {
      vi: '7. Dual Diploma Pathway và U.S. Diploma Pathway khác nhau như thế nào?',
      en: '7. What is the difference between Dual Diploma and U.S. Diploma Pathway?',
    },
    answer: {
      vi: 'Dual Diploma Pathway dành cho học sinh muốn duy trì chương trình giáo dục Việt Nam đồng thời hoàn thành lộ trình chương trình Mỹ để hướng đến bằng tốt nghiệp THPT Việt Nam và U.S. High School Diploma (5-6 tín chỉ). Trong khi đó, U.S. Diploma Pathway tập trung vào việc hoàn thành chương trình toàn thời gian và toàn bộ 21.5 tín chỉ theo hệ thống giáo dục Mỹ để tốt nghiệp như học sinh bản xứ. Việc lựa chọn pathway nào phụ thuộc vào mục tiêu học tập, kế hoạch sau THPT và định hướng của từng học sinh.',
      en: 'Dual Diploma awards both Vietnamese and US High School diplomas (concurrent study), while U.S. Diploma Pathway is a full-time American high school track (21.5 credits).',
    },
    order: 6,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'admissions',
    question: {
      vi: '8. U.S. High School Diploma được cấp bởi đơn vị nào?',
      en: '8. Which institution awards the U.S. High School Diploma?',
    },
    answer: {
      vi: 'Trong các lộ trình sử dụng chương trình EdOptions Academy, học sinh hoàn thành các yêu cầu của chương trình theo quy định để được cấp U.S. High School Diploma. EdOptions Academy là trường học K–12 trực tuyến của Edmentum và được kiểm định đầy đủ bởi Cognia và WASC, được các trường Đại học trên toàn thế giới công nhận.',
      en: 'The diploma is awarded by EdOptions Academy, accredited by Cognia and WASC and recognized worldwide.',
    },
    order: 7,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'admissions',
    question: {
      vi: '9. Học sinh có thể thay đổi lộ trình học tập trong quá trình học không?',
      en: '9. Can students change their learning pathway during the program?',
    },
    answer: {
      vi: 'Có thể. Lộ trình học tập cần được xây dựng dựa trên năng lực, mục tiêu và sự phát triển thực tế của từng học sinh. EPath Education thực hiện đánh giá và tư vấn định kỳ để phụ huynh và học sinh có cơ sở điều chỉnh chương trình, cấp độ hoặc định hướng học tập khi cần thiết.',
      en: 'Yes. EPath provides periodic assessments and counseling to adjust programs based on each student’s actual progress.',
    },
    order: 8,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'admissions',
    question: {
      vi: '10. EPath Education có tư vấn lộ trình học tập quốc tế cho từng học sinh không?',
      en: '10. Does EPath offer personalized international pathway consultation?',
    },
    answer: {
      vi: 'Có. Dịch vụ Cố vấn Lộ trình Học tập Quốc tế hỗ trợ học sinh và phụ huynh xác định mục tiêu, đánh giá năng lực hiện tại và lựa chọn chương trình phù hợp. Lộ trình có thể bao gồm việc phát triển tiếng Anh học thuật, lựa chọn chương trình quốc tế, chuẩn bị chứng chỉ, tích lũy tín chỉ và định hướng học tập sau THPT.',
      en: 'Yes. Dedicated advisory services assist families in setting goals, selecting curricula, accumulating credits, and preparing college applications.',
    },
    order: 9,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'admissions',
    question: {
      vi: '11. Giáo viên tại EPath Education gồm những ai?',
      en: '11. Who are the teachers at EPath Education?',
    },
    answer: {
      vi: 'Tùy từng chương trình, EPath Education kết hợp giáo viên quốc tế và giáo viên song ngữ. Giáo viên quốc tế đảm nhiệm việc giảng dạy các nội dung học thuật bằng tiếng Anh, trong khi giáo viên song ngữ (IELTS 7.0+) hỗ trợ học sinh Việt Nam tiếp cận kiến thức, củng cố nội dung và tháo gỡ những khó khăn trong quá trình học tập.',
      en: 'EPath combines certified international educators for academic instruction with bilingual teachers (IELTS 7.0+) for close tutoring and student support.',
    },
    order: 10,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
  {
    category: 'general',
    question: {
      vi: '12. Phụ huynh có được theo dõi quá trình học tập của con không?',
      en: '12. Can parents track their child’s academic progress?',
    },
    answer: {
      vi: 'Có. Phụ huynh được cập nhật thường xuyên về quá trình học tập, kết quả đánh giá và sự tiến bộ của học sinh theo từng giai đoạn. Các thông tin này là cơ sở để EPath Education phối hợp cùng gia đình trong việc điều chỉnh và xây dựng lộ trình học tập phù hợp nhất.',
      en: 'Yes. Parents receive regular reports, assessment updates, and advisor feedback to ensure close coordination with the family.',
    },
    order: 11,
    isActive: true,
    imageUrl: '',
    ...commonAudit,
  },
]

// --------------------------------------------------------------------------
// 6. SITE SETTINGS
// --------------------------------------------------------------------------
const siteSettingsData = {
  addressVi: '38 Trần Phú, Phường Thủ Dầu Một, TP. Hồ Chí Minh',
  addressEn: '38 Tran Phu Street, Thu Dau Mot Ward, Ho Chi Minh City',
  contactEmail: 'infor@epath.edu.vn',
  workingHoursVi: 'Thứ Hai – Thứ Bảy: 08:00 – 17:30',
  workingHoursEn: 'Monday – Saturday: 08:00 – 17:30',
  logoUrl: '/epath-logo-title.png',
  faviconUrl: '/favicon.ico',
  address: {
    vi: '38 Trần Phú, Phường Thủ Dầu Một, TP. Hồ Chí Minh',
    en: '38 Tran Phu Street, Thu Dau Mot Ward, Ho Chi Minh City',
  },
  phone: '0937 514 896',
  email: 'infor@epath.edu.vn',
  hotline: '0937 514 896',
  zaloUrl: 'https://zalo.me/0937514896',
  facebookUrl: 'https://facebook.com/epatheducation',
  youtubeUrl: '',
  tiktokUrl: '',
  instagramUrl: '',
  workingHours: {
    vi: 'Thứ Hai – Thứ Bảy: 08:00 – 17:30',
    en: 'Monday – Saturday: 08:00 – 17:30',
  },
  mapEmbedUrl: '',
  footerDescription: {
    vi: 'EPath Education — Đưa giáo dục quốc tế chất lượng cao đến gần hơn với gia đình Việt Nam.',
    en: 'EPath Education — Bringing high-quality international education closer to Vietnamese families.',
  },
}

// --------------------------------------------------------------------------
// 7. LEARNING PATHWAYS (4 cấp độ theo sitemap)
// --------------------------------------------------------------------------
const learningPathwaysData = [
  {
    level: 'kindergarten',
    step: '01',
    title: {
      vi: 'Mầm non & Tiền học thuật (3 – 6 tuổi)',
      en: 'Kindergarten & Early Foundations (Ages 3 – 6)',
    },
    subtitle: {
      vi: 'Khởi đầu vững chắc cùng Phonics & Cambridge ESL',
      en: 'Solid Start with Phonics & Cambridge ESL',
    },
    description: {
      vi: 'Xây dựng phản xạ tự nhiên, Letter Sounds, Phonics, làm quen với Toán học và Khoa học khám phá bằng tiếng Anh.',
      en: 'Building natural reflexes, Letter Sounds, Phonics, and exploring early Math and Science in English.',
    },
    modelTag: { vi: 'Blended Learning', en: 'Blended Learning' },
    badges: 'Mầm non, Phonics, Cambridge',
    objectives: [
      { vi: 'Phát triển phản xạ nghe hiểu và phát âm chuẩn', en: 'Natural pronunciation and listening reflexes' },
      { vi: 'Làm quen Phonics và ghép âm Blending', en: 'Phonics and sound blending' },
      { vi: 'Khám phá Toán và Khoa học qua CLIL', en: 'Math and Science discovery via CLIL' },
    ],
    outcomes: {
      vi: 'Nền tảng ngôn ngữ và tiền học thuật tự tin bước vào Tiểu học.',
      en: 'Confident linguistic and pre-academic foundation for primary school.',
    },
    order: 0,
    isActive: true,
    imageUrl: '',
    ctaUrl: '#programs',
    ...commonAudit,
  },
  {
    level: 'elementary',
    step: '02',
    title: {
      vi: 'Tiểu học Quốc tế (Lớp 1 – Lớp 5)',
      en: 'Elementary Academic Pathway (Grades 1 – 5)',
    },
    subtitle: {
      vi: 'Chuyển từ học tiếng Anh sang học bằng tiếng Anh',
      en: 'Transition from Learning English to Learning in English',
    },
    description: {
      vi: 'Lựa chọn Foundation Program hoặc U.S Academic Program với 4 môn chuẩn Mỹ (Math, ELA, Science, Social Studies) trên nền tảng Edmentum.',
      en: 'Choose Foundation or U.S Academic program with 4 core US subjects on Edmentum.',
    },
    modelTag: { vi: 'Edmentum + Cố vấn riêng', en: 'Edmentum + Advisor' },
    badges: 'Tiểu học, Edmentum, Common Core',
    objectives: [
      { vi: 'Làm chủ 4 kỹ năng Nghe-Nói-Đọc-Viết học thuật', en: 'Mastering academic language skills' },
      { vi: 'Tiếp cận Toán, Khoa học, Xã hội học chuẩn Mỹ', en: 'Accessing US Math, Science, and Social Studies' },
      { vi: 'Đồng hành cùng Giáo viên Quốc tế và Song ngữ', en: 'Guided by International and Bilingual teachers' },
    ],
    outcomes: {
      vi: 'Năng lực học thuật tương đương trường song ngữ quốc tế với chi phí dưới 1/3.',
      en: 'Academic competency matching bilingual schools at under 1/3 tuition.',
    },
    order: 1,
    isActive: true,
    imageUrl: '',
    ctaUrl: '#programs',
    ...commonAudit,
  },
  {
    level: 'middle',
    step: '03',
    title: {
      vi: 'Trung học Cơ sở (Lớp 6 – Lớp 8)',
      en: 'Middle School Pathway (Grades 6 – 8)',
    },
    subtitle: {
      vi: 'Chinh phục IELTS & Tích lũy tín chỉ EdOptions',
      en: 'Achieving IELTS & Earning EdOptions Credits',
    },
    description: {
      vi: 'Đạt IELTS 5.5 - 6.0, học trải nghiệm và tích lũy sớm tín chỉ Toán/Khoa học tính vào Bằng Tú tài Mỹ.',
      en: 'Attaining IELTS 5.5 - 6.0 and earning early Math/Science credits toward US Diploma.',
    },
    modelTag: { vi: 'EdOptions Academy', en: 'EdOptions Academy' },
    badges: 'THCS, IELTS 6.0, Tín chỉ sớm',
    objectives: [
      { vi: 'Đạt IELTS Band 5.5 - 6.0', en: 'Achieving IELTS Band 5.5 - 6.0' },
      { vi: 'Học môn học theo chuẩn EdOptions Academy', en: 'Studying official EdOptions Academy courses' },
      { vi: 'Tích lũy tín chỉ chuyển tiếp lên THPT', en: 'Earning transferable credits to high school' },
    ],
    outcomes: {
      vi: 'Bản lề vững chắc sẵn sàng bước vào chương trình Song bằng hoặc Tú tài Mỹ toàn phần.',
      en: 'Solid foundation ready for Dual Diploma or Full-time US Diploma.',
    },
    order: 2,
    isActive: true,
    imageUrl: '',
    ctaUrl: '#programs',
    ...commonAudit,
  },
  {
    level: 'high',
    step: '04',
    title: {
      vi: 'Trung học Phổ thông (Lớp 9 – Lớp 12)',
      en: 'High School Diploma (Grades 9 – 12)',
    },
    subtitle: {
      vi: 'Song bằng Việt – Mỹ hoặc Tú tài Mỹ toàn phần',
      en: 'Dual Diploma or Full-Time US High School',
    },
    description: {
      vi: 'Sở hữu bằng U.S High School Diploma kiểm định Cognia & WASC, chứng chỉ AP College Board và IELTS 7.0+.',
      en: 'Earn Cognia & WASC accredited US High School Diploma, College Board AP credits, and IELTS 7.0+.',
    },
    modelTag: { vi: 'Cognia & WASC', en: 'Cognia & WASC' },
    badges: 'THPT, Song bằng, US Diploma, AP',
    objectives: [
      { vi: 'Nhận bằng THPT Hoa Kỳ được công nhận toàn cầu', en: 'Earn globally accredited US High School Diploma' },
      { vi: 'Tích lũy tín chỉ nâng cao AP và điểm SAT/ACT', en: 'Accumulate AP credits and SAT/ACT scores' },
      { vi: 'Xây dựng hồ sơ ngoại khóa săn học bổng đại học', en: 'Build competitive scholarship portfolio' },
    ],
    outcomes: {
      vi: 'Cánh cửa rộng mở vào các trường Đại học hàng đầu Việt Nam và thế giới.',
      en: 'Direct access and competitive advantage for top universities worldwide.',
    },
    order: 3,
    isActive: true,
    imageUrl: '',
    ctaUrl: '#programs',
    ...commonAudit,
  },
]

// --------------------------------------------------------------------------
// 8. PAGE SECTIONS (Trang chủ & Giới thiệu)
// --------------------------------------------------------------------------
const homeSections = [
  {
    id: 'hero',
    type: 'hero',
    order: 0,
    isActive: true,
    pageId: 'home',
    data: {
      title: {
        vi: 'EPath Education',
        en: 'EPath Education',
      },
      subtitle: {
        vi: 'Đưa giáo dục quốc tế chất lượng cao đến gần hơn với gia đình Việt',
        en: 'Bringing high-quality international education closer to Vietnamese families',
      },
      body: {
        vi: 'Lộ trình giáo dục phổ thông quốc tế xuyên suốt từ Mầm non đến THPT với hai định hướng chủ lực: Song bằng Việt – Mỹ (Dual Diploma) và Tú tài Mỹ toàn phần (U.S Diploma) hợp tác cùng Edmentum International (Hoa Kỳ) được kiểm định bởi Cognia và WASC.',
        en: 'Seamless K-12 international education with two flagship tracks: Vietnam - US Dual Diploma and US Fulltime Diploma in partnership with Edmentum International (USA), accredited by Cognia and WASC.',
      },
    },
  },
  {
    id: 'intro',
    type: 'intro',
    order: 1,
    isActive: true,
    pageId: 'home',
    data: {
      title: {
        vi: 'Câu chuyện EPath Education',
        en: 'The EPath Education Story',
      },
      subtitle: {
        vi: 'Đồng hành từ bậc Tiểu học để chinh phục đại học uy tín toàn cầu',
        en: 'Accompanying from primary school to conquer prestigious universities globally',
      },
      body: {
        vi: 'Xu hướng giáo dục phổ thông quốc tế trực tuyến mở ra cơ hội để học sinh Việt Nam sở hữu bằng cấp và chứng chỉ quốc tế với mức học phí dễ tiếp cận hơn. Nếu được định hướng ngay từ Tiểu học, học sinh tại các trường công lập hoàn toàn có khả năng học thuật tương đương học sinh trường song ngữ quốc tế.',
        en: 'Online international education enables Vietnamese students to earn globally accredited diplomas at accessible tuition. With proper guidance from primary school, public school students can achieve academic competency matching bilingual international schools.',
      },
    },
  },
  {
    id: 'core-values',
    type: 'coreValues',
    order: 2,
    isActive: true,
    pageId: 'home',
    data: {
      title: {
        vi: 'Giá trị cốt lõi',
        en: 'Core Values',
      },
      subtitle: {
        vi: '6 nguyên tắc định hình chất lượng đào tạo tại EPath',
        en: '6 principles shaping educational excellence at EPath',
      },
    },
  },
  {
    id: 'pathways',
    type: 'learningPathways',
    order: 3,
    isActive: true,
    pageId: 'home',
    data: {
      title: {
        vi: 'Lộ trình học tập xuyên suốt',
        en: 'Seamless Learning Pathways',
      },
      subtitle: {
        vi: 'Hành trình từ Mầm non đến THPT chuẩn bị cho đại học quốc tế',
        en: 'From kindergarten through high school preparing for global universities',
      },
    },
  },
  {
    id: 'featured-programs',
    type: 'featuredCourses',
    order: 4,
    isActive: true,
    pageId: 'home',
    data: {
      title: {
        vi: 'Các chương trình học nổi bật',
        en: 'Featured Educational Programs',
      },
      subtitle: {
        vi: 'Thiết kế cá nhân hóa theo từng cấp học và năng lực học sinh',
        en: 'Personalized design for each grade level and student aptitude',
      },
    },
  },
  {
    id: 'partners',
    type: 'partners',
    order: 5,
    isActive: true,
    pageId: 'home',
    data: {
      title: {
        vi: 'Đối tác Quốc tế Uy tín',
        en: 'Prestigious International Partners',
      },
      subtitle: {
        vi: 'Hợp tác cùng Edmentum, Cambridge Assessment English & FabLab EIU',
        en: 'Partnering with Edmentum, Cambridge Assessment English & FabLab EIU',
      },
    },
  },
  {
    id: 'faqs',
    type: 'faqs',
    order: 6,
    isActive: true,
    pageId: 'home',
    data: {
      title: {
        vi: 'Câu hỏi thường gặp',
        en: 'Frequently Asked Questions',
      },
      subtitle: {
        vi: 'Giải đáp thắc mắc về chương trình học và chính sách tuyển sinh',
        en: 'Answers regarding curricula and admissions policies',
      },
    },
  },
]

// --------------------------------------------------------------------------
// MAIN SEED EXECUTION
// --------------------------------------------------------------------------
async function seedAll() {
  console.log('=== STARTING SEEDING WEBSITE DATA FROM SITEMAP ===')

  // Wipe collections first to prevent duplicates and cleanup old names
  console.log('0. Cleaning collections before idempotent seed...')
  const collectionsToClean = [
    'faqs',
    'core-values',
    'coreValues',
    'partners',
    'learning-pathways',
    'learningPathways',
    'programs',
    'site-settings',
    'siteSettings',
    'about-content',
    'aboutContent',
    'hero-content',
    'heroContent',
  ]
  for (const col of collectionsToClean) {
    const snap = await db.collection(col).get()
    const batch = db.batch()
    snap.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()
  }

  // 1. About Content (seed both aboutContent and about-content)
  console.log('1. Seeding aboutContent...')
  await db.collection('aboutContent').doc('main').set(aboutContentData, { merge: true })
  await db.collection('about-content').doc('main').set(aboutContentData, { merge: true })
  console.log('   ✓ aboutContent/main seeded.')

  // 2. Core Values
  console.log('2. Seeding coreValues...')
  for (let i = 0; i < coreValuesData.length; i++) {
    const cv = coreValuesData[i]
    const id = `core-value-${i + 1}`
    await db.collection('coreValues').doc(id).set({ ...cv, id })
    await db.collection('core-values').doc(id).set({ ...cv, id })
  }
  console.log(`   ✓ ${coreValuesData.length} coreValues seeded.`)

  // 3. Programs
  console.log('3. Seeding programs...')
  for (const prog of programsData) {
    await db.collection('programs').doc(prog.slug).set({ ...prog, id: prog.slug })
  }
  console.log(`   ✓ ${programsData.length} programs seeded.`)

  // 4. Partners
  console.log('4. Seeding partners...')
  const partnerSlugs = ['edmentum-international', 'cambridge-assessment-english', 'fablab-eiu', 'international-network']
  for (let i = 0; i < partnersData.length; i++) {
    const p = partnersData[i]
    const id = partnerSlugs[i] || `partner-${i + 1}`
    await db.collection('partners').doc(id).set({ ...p, id })
  }
  console.log(`   ✓ ${partnersData.length} partners seeded.`)

  // 5. FAQs
  console.log('5. Seeding faqs...')
  for (let i = 0; i < faqsData.length; i++) {
    const faq = faqsData[i]
    const id = `faq-${i + 1}`
    await db.collection('faqs').doc(id).set({ ...faq, id })
  }
  console.log(`   ✓ ${faqsData.length} faqs seeded.`)

  // 6. Site Settings (seed both siteSettings and site-settings)
  console.log('6. Seeding siteSettings...')
  await db.collection('siteSettings').doc('general').set(siteSettingsData, { merge: true })
  await db.collection('site-settings').doc('general').set(siteSettingsData, { merge: true })
  console.log('   ✓ siteSettings/general seeded.')

  // 7. Learning Pathways
  console.log('7. Seeding learningPathways...')
  for (const lp of learningPathwaysData) {
    await db.collection('learningPathways').doc(lp.level).set({ ...lp, id: lp.level })
    await db.collection('learning-pathways').doc(lp.level).set({ ...lp, id: lp.level })
  }
  console.log(`   ✓ ${learningPathwaysData.length} learningPathways seeded.`)

  // 8. Page Builder Sections (home)
  console.log('8. Seeding pages/home/sections...')
  const homeRef = db.collection('pages').doc('home')
  await homeRef.set({ title: 'Trang chủ', slug: 'home', updatedAt: now }, { merge: true })
  for (const sec of homeSections) {
    await homeRef.collection('sections').doc(sec.id).set({
      ...sec,
      createdAt: now,
      updatedAt: now,
    }, { merge: true })
  }
  console.log(`   ✓ ${homeSections.length} sections for home page seeded.`)

  // 9. Hero Content (seed both heroContent and hero-content)
  console.log('9. Seeding heroContent...')
  const heroData = {
    pageId: 'home',
    welcome: { vi: 'Hệ sinh thái Giáo dục Phổ thông Quốc tế', en: 'International K-12 Educational Ecosystem' },
    title: { vi: 'EPath Education', en: 'EPath Education' },
    subtitle: { vi: 'Đưa giáo dục quốc tế chất lượng cao đến gần hơn với gia đình Việt', en: 'Bringing high-quality international education closer to Vietnamese families' },
    description: { vi: 'Lộ trình giáo dục phổ thông quốc tế từ Mầm non đến THPT với hai định hướng chủ lực: Song bằng Việt – Mỹ (Dual Diploma) và Tú tài Mỹ toàn phần (U.S Diploma) hợp tác cùng Edmentum International (Hoa Kỳ) được kiểm định bởi Cognia và WASC.', en: 'Seamless K-12 international education with Dual Diploma and US Fulltime Diploma pathways in partnership with Edmentum International (USA), accredited by Cognia and WASC.' },
    ctaLabel: { vi: 'Khám phá lộ trình', en: 'Explore Pathways' },
    ctaUrl: '#programs',
    secondaryCtaLabel: { vi: 'Liên hệ tư vấn', en: 'Contact Us' },
    secondaryCtaUrl: '#contact',
    videoUrl: '',
    videoThumbnail: '',
    backgroundImage: '',
    slides: [],
    finalSlideIndex: -1,
    slideInterval: 4,
    isActive: true,
    status: 'PUBLISHED',
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  }
  await db.collection('heroContent').doc('home').set(heroData, { merge: true })
  await db.collection('hero-content').doc('home').set(heroData, { merge: true })
  console.log('   ✓ heroContent/home seeded.')

  console.log('=== SEEDING COMPLETED SUCCESSFULLY! ===')
}

seedAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
