export interface FeaturedCourseItemData {
  id: string
  title: { vi: string; en: string }
  levelBadge: { vi: string; en: string }
  badges: string[]
  desc: { vi: string; en: string }
  points: { vi: string[]; en: string[] }
  image: string
  link: string
  accentColor: string
  badgeColor?: string
}

export interface FeaturedCoursesSectionData {
  badge?: { vi: string; en: string }
  title?: { vi: string; en: string }
  subtitle?: { vi: string; en: string }
  ctaText?: { vi: string; en: string }
  ctaLink?: string
  courses?: FeaturedCourseItemData[]
}

export const DEFAULT_FEATURED_COURSES_DATA: FeaturedCoursesSectionData = {
  badge: {
    vi: 'CHƯƠNG TRÌNH ĐÀO TẠO TIÊU BIỂU',
    en: 'FEATURED LEARNING PROGRAMS',
  },
  title: {
    vi: 'Các khóa học nổi bật tại EPath',
    en: 'Featured Programs at EPath',
  },
  subtitle: {
    vi: 'Lộ trình học thuật chuẩn quốc tế được cá nhân hóa cho từng giai đoạn phát triển của học sinh từ Mầm non đến Trung học Phổ thông.',
    en: 'Accredited international academic pathways personalized for each developmental stage from Kindergarten through High School.',
  },
  ctaText: {
    vi: 'Xem tất cả chương trình học K–12',
    en: 'View All K–12 Academic Programs',
  },
  ctaLink: '/programs',
  courses: [
    {
      id: 'dual-diploma',
      title: {
        vi: 'Song bằng Tú tài Mỹ (Dual Diploma)',
        en: 'U.S. Dual Diploma Program',
      },
      levelBadge: {
        vi: 'Lớp 9 – 12 (14–18 tuổi)',
        en: 'Grades 9 – 12 (Age 14–18)',
      },
      badges: ['EdOptions Academy', 'Cognia & WASC', 'College Board AP'],
      desc: {
        vi: 'Học sinh học song song với trường THPT tại Việt Nam, hoàn thành 6 tín chỉ Mỹ trực tuyến để nhận bằng Tú tài Mỹ chính quy (U.S. High School Diploma) được công nhận toàn cầu.',
        en: 'Study simultaneously with local high school, earning 6 accredited U.S. credits online to receive an official U.S. High School Diploma accepted worldwide.',
      },
      points: {
        vi: [
          'Cấp bằng U.S. High School Diploma chính quy',
          'Tích hợp môn Tín chỉ nâng cao AP® (College Board)',
          'Tiết kiệm đến 67% chi phí so với du học nội trú',
        ],
        en: [
          'Official U.S. High School Diploma awarded',
          'Includes College Board approved AP® courses',
          'Saves up to 67% compared to boarding school abroad',
        ],
      },
      image: '/images/programs/program-high.jpg',
      link: '/programs?level=high',
      accentColor: '#1E3570',
      badgeColor: 'bg-[#1E3570]',
    },
    {
      id: 'homeschooling',
      title: {
        vi: 'Homeschooling Quốc tế Toàn thời gian',
        en: 'Full-time International Homeschooling',
      },
      levelBadge: {
        vi: 'Mầm non – Lớp 12 (5–18 tuổi)',
        en: 'K – 12 (Age 5–18)',
      },
      badges: ['Chuẩn K-12 Mỹ', 'Toàn thời gian', 'Cố vấn 1:1'],
      desc: {
        vi: 'Chương trình phổ thông Hoa Kỳ toàn diện 100% bằng tiếng Anh. Học sinh nhận học bạ chuẩn Mỹ, được cố vấn học vụ 1:1 đồng hành sát sao và xây dựng hồ sơ ứng tuyển đại học quốc tế.',
        en: 'Comprehensive 100% English American curriculum. Students receive official U.S. transcripts, dedicated 1:1 academic advisory, and competitive college portfolio preparation.',
      },
      points: {
        vi: [
          '400+ khóa học chuẩn Mỹ, linh hoạt thời gian & địa điểm',
          '50% giáo viên quốc tế & cố vấn học thuật song ngữ theo sát',
          'Lộ trình cá nhân hóa theo năng lực và tốc độ của từng em',
        ],
        en: [
          '400+ U.S. courses with flexible schedule & location',
          '50% international faculty & bilingual academic mentors',
          'Tailored learning pace adapted to individual capability',
        ],
      },
      image: '/images/programs/program-elementary.jpg',
      link: '/programs?level=high',
      accentColor: '#5C9024',
      badgeColor: 'bg-[#8DC63F]',
    },
    {
      id: 'cambridge-bilingual',
      title: {
        vi: 'Tiểu học & THCS Song ngữ chuẩn Cambridge',
        en: 'Bilingual Cambridge Primary & Middle School',
      },
      levelBadge: {
        vi: 'Lớp 1 – 8 (6–14 tuổi)',
        en: 'Grades 1 – 8 (Age 6–14)',
      },
      badges: ['Cambridge English', 'Toán & Khoa học Mỹ', 'Blended Learning'],
      desc: {
        vi: 'Xây dựng phản xạ tiếng Anh học thuật tự nhiên kết hợp Toán và Khoa học theo chuẩn Cambridge & Edmentum. Giúp học sinh vững vàng kiến thức nền tảng trước khi bước vào cấp học cao hơn.',
        en: 'Developing natural academic English reflexes integrated with Cambridge & Edmentum Math and Science, establishing a strong foundation before advanced programs.',
      },
      points: {
        vi: [
          'Nền tảng thi các chứng chỉ Cambridge (Starters, Movers, Flyers, KET, PET)',
          'Phương pháp Active Learning kích thích tư duy logic và phản biện',
          'Phụ đạo cá nhân hóa lấp đầy lỗ hổng kiến thức kịp thời',
        ],
        en: [
          'Prepares for Cambridge Qualifications (Starters to PET)',
          'Active Learning fosters critical thinking and curiosity',
          'Personalized tutoring bridges learning gaps promptly',
        ],
      },
      image: '/images/programs/program-middle.jpg',
      link: '/programs?level=elementary',
      accentColor: '#F26522',
      badgeColor: 'bg-[#F26522]',
    },
    {
      id: 'kindergarten',
      title: {
        vi: 'Tiền tiểu học & Mầm non Little People',
        en: 'Little People Kindergarten & Early Learning',
      },
      levelBadge: {
        vi: '3 – 6 tuổi',
        en: 'Age 3 – 6',
      },
      badges: ['Little People', 'Song ngữ sớm', 'Active Learning'],
      desc: {
        vi: 'Kế thừa hơn 10 năm kinh nghiệm từ hệ thống Mầm non Little People, chương trình trang bị nền tảng ngữ âm (phonics), kỹ năng tự lập và tư duy khám phá, giúp trẻ tự tin vào lớp 1 quốc tế.',
        en: 'Leveraging 10+ years of Little People kindergarten expertise, building solid phonics foundations, independent habits, and confidence to transition seamlessly into Grade 1.',
      },
      points: {
        vi: [
          'Môi trường tương tác song ngữ tự nhiên chuẩn bản ngữ',
          'Phát triển trí tuệ cảm xúc (SEL) và tính tự lập từ sớm',
          'Lộ trình liên thông sẵn sàng bước vào chương trình phổ thông',
        ],
        en: [
          'Immersive native bilingual classroom environment',
          'Nurtures social-emotional learning (SEL) & independence',
          'Seamless continuum preparing for international schooling',
        ],
      },
      image: '/images/programs/program-kindy.jpg',
      link: '/programs?level=kindergarten',
      accentColor: '#3A54A4',
      badgeColor: 'bg-[#3A54A4]',
    },
  ],
}
