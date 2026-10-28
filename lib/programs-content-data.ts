import type { ProgramsContentInput } from './cms-types'

export const DEFAULT_PROGRAMS_CONTENT: ProgramsContentInput = {
  roadmap: {
    badge: {
      vi: 'LỘ TRÌNH ĐÀO TẠO K-12 LIÊN THÔNG',
      en: 'CONTINUOUS K-12 PATHWAY',
    },
    title: {
      vi: 'Hành Trình Học Thuật Xuyên Suốt Từ Mầm Non Đến Tú Tài Hoa Kỳ',
      en: 'A Continuous Academic Pathway from Kindergarten to US High School Diploma',
    },
    subtitle: {
      vi: 'Mô hình Blended Learning kết hợp trực tuyến chuẩn quốc tế trên nền tảng Edmentum và trực tiếp tại Campus EPath, giúp học sinh từng bước tích lũy năng lực học thuật và bằng cấp toàn cầu.',
      en: 'A blended model combining accredited digital learning via Edmentum and onsite campus classes, equipping learners with international competencies and credentials.',
    },
    stages: [
      {
        step: '01',
        level: 'kindergarten',
        image: '/images/programs/program-kindy.jpg',
        title: {
          vi: 'Giai đoạn Mầm non (3 – 6 tuổi)',
          en: 'Kindergarten Stage (Ages 3–6)',
        },
        subtitle: {
          vi: 'Khởi đầu tự nhiên – Thẩm thấu ngôn ngữ & Tư duy sớm',
          en: 'Natural Start – Language Immersion & Early Thinking',
        },
        color: '#2E4A9E',
        badges: ['Cambridge English', 'Topic-based Learning', 'Early Literacy', 'Early Math'],
        modelTag: {
          vi: 'Mô hình: Song ngữ tương tác · Phonics & Toán sớm · Chuẩn bị Lớp 1',
          en: 'Model: Interactive Bilingual · Phonics & Early Math · Grade 1 Ready',
        },
        outcomes: {
          vi: [
            'Làm quen tiếng Anh tự nhiên như ngôn ngữ thứ hai',
            'Phát triển phát âm, ngữ âm Phonics chuẩn xác',
            'Làm quen tư duy số học, hình khối, logic cơ bản',
            'Hình thành sự tự tin trong giao tiếp môi trường song ngữ',
          ],
          en: [
            'Acquire English naturally as a second language',
            'Develop standard phonics and pronunciation',
            'Introduction to early numeracy and logical thinking',
            'Build confidence in bilingual communication',
          ],
        },
      },
      {
        step: '02',
        level: 'elementary',
        image: '/images/programs/program-elementary.jpg',
        title: {
          vi: 'Giai đoạn Tiểu học (Lớp 1 – 5)',
          en: 'Elementary Stage (Grades 1–5)',
        },
        subtitle: {
          vi: 'Nền tảng Học thuật – Toán & Khoa học bằng Tiếng Anh',
          en: 'Academic Foundation – Math & Science in English',
        },
        color: '#5C9024',
        badges: ['Edmentum Core', 'Cambridge Primary', 'STEM & Robotics', 'Academic Reading'],
        modelTag: {
          vi: 'Mô hình: 5 giờ/tuần (Online + Onsite) · 50% GV Quốc tế + 50% GV Song ngữ',
          en: "Model: 5 hrs/wk (Online + Onsite) · 50% Int'l + 50% Bilingual Faculty",
        },
        outcomes: {
          vi: [
            'Tiếng Anh học thuật chuẩn khung Cambridge Primary',
            'Toán và Khoa học chuẩn Mỹ (US Common Core Standards)',
            'Phương pháp học tập độc lập & làm việc nhóm',
            'Đạt chứng chỉ Cambridge Starters / Movers / Flyers',
          ],
          en: [
            'Academic English aligned with Cambridge Primary framework',
            'US Common Core-aligned Math and Science',
            'Independent learning habits and collaborative teamwork',
            'Achieve Cambridge Starters / Movers / Flyers certifications',
          ],
        },
      },
      {
        step: '03',
        level: 'middle',
        image: '/images/programs/program-middle.jpg',
        title: {
          vi: 'Giai đoạn THCS (Lớp 6 – 8)',
          en: 'Middle School Stage (Grades 6–8)',
        },
        subtitle: {
          vi: 'Tư duy Phản biện & Kỹ năng Nghiên cứu Học thuật',
          en: 'Critical Thinking & Academic Research Skills',
        },
        color: '#F26522',
        badges: ['US Common Core', 'IELTS Foundation', 'Academic Writing', 'AP Preparation'],
        modelTag: {
          vi: 'Mô hình: 6–8 giờ/tuần · Tích lũy kiến thức chuẩn bị Song bằng Mỹ',
          en: 'Model: 6–8 hrs/wk · Foundation credits for US Dual Diploma',
        },
        outcomes: {
          vi: [
            'Đạt chuẩn tiếng Anh tương đương IELTS 5.5 – 6.5',
            'Tư duy phân tích, phản biện và kỹ năng thuyết trình',
            'Sẵn sàng học các môn học thuật nâng cao chuẩn Hoa Kỳ',
            'Đủ điều kiện xét tuyển vào chương trình Dual Diploma Lớp 9',
          ],
          en: [
            'Achieve English proficiency equivalent to IELTS 5.5 – 6.5',
            'Analytical thinking, critical evaluation, and presentation skills',
            'Prepared for advanced US academic subjects',
            'Qualified for Grade 9 US Dual Diploma admission',
          ],
        },
      },
      {
        step: '04',
        level: 'high',
        image: '/images/programs/program-dual-diploma.jpg',
        title: {
          vi: 'Giai đoạn THPT (Lớp 9 – 12)',
          en: 'High School Stage (Grades 9–12)',
        },
        subtitle: {
          vi: 'Bằng Tú Tài Mỹ Cognia & WASC – Cánh Cửa Đại Học Quốc Tế',
          en: 'Cognia & WASC US Diploma – Gateway to Global Universities',
        },
        color: '#1E3570',
        badges: ['EdOptions Academy', 'Cognia & WASC', 'Dual Diploma', 'College Prep'],
        modelTag: {
          vi: 'Mô hình: Tích lũy 5–21.5 Tín chỉ Mỹ · Nhận đồng thời 2 bằng tốt nghiệp',
          en: 'Model: Earn 5–21.5 US Credits · Dual VN & US Diplomas',
        },
        outcomes: {
          vi: [
            'Nhận Bằng Tú tài Mỹ được công nhận toàn cầu',
            'Bảng điểm chuẩn Mỹ chính quy từ EdOptions Academy',
            'Lợi thế vượt trội khi xét tuyển đại học quốc tế & học bổng',
            'Được cố vấn 1:1 định hướng hồ sơ du học và nghề nghiệp',
          ],
          en: [
            'Earn a globally accredited US High School Diploma',
            'Official US transcripts issued by EdOptions Academy',
            'Distinct competitive edge for university admissions & scholarships',
            '1-on-1 college counseling and career pathway mentoring',
          ],
        },
      },
    ],
  },
  edoptions: {
    badge: {
      vi: 'Chương trình THPT Hoa Kỳ',
      en: 'US High School Program',
    },
    title: {
      vi: 'EdOptions Academy — Lộ Trình Tú Tài Mỹ Chuẩn Quốc Tế',
      en: 'EdOptions Academy — Standardized US Diploma Pathways',
    },
    subtitle: {
      vi: 'Chương trình THPT Hoa Kỳ với hai lựa chọn lộ trình phù hợp với nhu cầu gia đình Việt Nam',
      en: 'US High School programs offering two tailored tracks to meet Vietnamese families’ diverse aspirations',
    },
    dual: {
      label: {
        vi: 'Lựa chọn 1: Dual Diploma (Song bằng)',
        en: 'Track 1: Dual Diploma (Dual VN & US)',
      },
      title: {
        vi: 'Dual Diploma — Song bằng THPT Việt Nam & Hoa Kỳ',
        en: 'Dual Diploma — Simultaneous VN & US High School Graduation',
      },
      desc: {
        vi: 'Dual Diploma là lộ trình học tập cho phép học sinh theo học đồng thời chương trình Trung học phổ thông tại Việt Nam và chương trình Trung học phổ thông Hoa Kỳ thông qua EdOptions Academy.',
        en: 'Dual Diploma allows students to simultaneously pursue the Vietnamese High School curriculum and accredited US high school courses via EdOptions Academy.',
      },
      p2: {
        vi: 'Thay vì phải chuyển sang một trường quốc tế toàn thời gian, học sinh vẫn tiếp tục học tại trường Công lập hoặc Tư thục hiện tại, đồng thời hoàn thành các môn học và tín chỉ theo yêu cầu của chương trình Hoa Kỳ trên nền tảng học trực tuyến của EdOptions Academy.',
        en: 'Instead of transferring to a costly full-time international school, students remain at their current school while fulfilling required US courses on the EdOptions Academy platform.',
      },
      imageUrl: '/images/programs/program-dual-diploma.jpg',
      diplomasTitle: {
        vi: 'Sau khi hoàn thành đầy đủ các yêu cầu học thuật của cả hai hệ thống, học sinh có cơ hội nhận:',
        en: 'Upon successfully completing all academic requirements, students earn:',
      },
      diplomas: {
        vi: [
          'Bằng tốt nghiệp Trung học phổ thông Việt Nam',
          'Bằng tốt nghiệp Trung học phổ thông Hoa Kỳ (Cognia & WASC)',
        ],
        en: [
          'Official Vietnamese High School Diploma',
          'Accredited US High School Diploma (Cognia & WASC)',
        ],
      },
      note: {
        vi: 'Học sinh học song song chương trình tại trường hiện tại và chương trình THPT Hoa Kỳ để hướng tới hai văn bằng tốt nghiệp.',
        en: 'Students study concurrently alongside their current school to earn dual accredited high school credentials.',
      },
    },
    fulltime: {
      label: {
        vi: 'Lựa chọn 2: US Fulltime Diploma (Tú tài Mỹ toàn phần)',
        en: 'Track 2: US Fulltime Diploma (Homeschool Track)',
      },
      title: {
        vi: 'US Fulltime Diploma — Học toàn thời gian chương trình THPT Hoa Kỳ',
        en: 'US Fulltime Diploma — 100% Enrollment as an Official US Student',
      },
      desc: {
        vi: 'Đây là lộ trình dành cho những học sinh mong muốn theo học toàn thời gian chương trình Trung học phổ thông Hoa Kỳ thông qua EdOptions Academy thay vì theo học song song với chương trình trong nước.',
        en: 'A dedicated track for students wishing to pursue a 100% full-time US High School diploma directly through EdOptions Academy.',
      },
      p2: {
        vi: 'Trong mô hình này, học sinh sẽ học tập, tích lũy 21.5 tín chỉ và hoàn thành các yêu cầu tốt nghiệp hoàn toàn theo chương trình của EdOptions Academy, được kiểm định bởi Cognia và WASC.',
        en: 'Students complete all 21.5 core credits aligned with US graduation standards accredited by Cognia and WASC.',
      },
      imageUrl: '/images/programs/program-high-school.jpg',
      fitTitle: {
        vi: 'Lựa chọn này phù hợp với các gia đình mong muốn:',
        en: 'This track is ideal for families who:',
      },
      fit: {
        vi: [
          'Theo đuổi lộ trình giáo dục Hoa Kỳ một cách toàn diện',
          'Cần sự linh hoạt về thời gian và địa điểm học tập',
          'Có kế hoạch du học hoặc chuyển tiếp quốc tế trong tương lai',
          'Mong muốn học sinh phát triển khả năng tự học và tự quản lý ở mức độ cao',
        ],
        en: [
          'Seek comprehensive immersion in the US education system',
          'Require flexible scheduling and location independence',
          'Plan to study abroad or transition to international universities',
          'Value high self-direction and time-management development',
        ],
      },
    },
  },
  personalized: {
    title: {
      vi: 'Lộ trình Quốc tế cá nhân hóa & Cố vấn học thuật 1:1',
      en: 'Personalized International Pathways & 1:1 Academic Advising',
    },
    desc: {
      vi: 'Bên cạnh hệ sinh thái Edmentum và EdOptions Academy, EPath đang từng bước mở rộng mạng lưới đối tác học thuật nhằm mang đến nhiều lựa chọn hơn cho học sinh ở bậc Trung học phổ thông và giai đoạn chuẩn bị đại học.',
      en: 'Alongside Edmentum and EdOptions Academy, EPath continuously expands its global academic partnerships to offer enriched options for high school and pre-college milestones.',
    },
    goalsTitle: {
      vi: 'Định hướng phát triển của EPath bao gồm:',
      en: 'EPath’s Strategic Development Focus:',
    },
    goals: {
      vi: [
        'Kết nối với các trường quốc tế và tổ chức giáo dục uy tín trong và ngoài nước',
        'Mở rộng hợp tác với các hệ thống giáo dục tại Hoa Kỳ, Anh Quốc, Úc, Canada, Châu Âu',
        'Tìm kiếm các chương trình Trung học phổ thông quốc tế có giá trị chuyển tiếp và công nhận toàn cầu',
        'Đa dạng hóa các lựa chọn bằng cấp quốc tế, chương trình dự bị đại học và lộ trình chuyển tiếp',
      ],
      en: [
        'Connecting with premier international schools and global educational institutions',
        'Expanding partnerships across the US, UK, Australia, Canada, and Europe',
        'Curating accredited international programs with seamless university transferability',
        'Diversifying diploma options, foundation tracks, and global matriculation pathways',
      ],
    },
    p2: {
      vi: 'Thông qua quá trình đánh giá năng lực, định hướng học tập và tư vấn cá nhân hóa, EPath sẽ hỗ trợ phụ huynh và học sinh lựa chọn con đường phù hợp nhất, dù mục tiêu là chương trình Song bằng, Tú tài Quốc tế, dự bị đại học, du học hay các chương trình chuyển tiếp quốc tế khác.',
      en: 'Through diagnostic benchmarking and 1:1 counseling, EPath guides parents and students toward the optimal path—whether dual diploma, full-time study, or international university admissions.',
    },
  },
  cta: {
    title: {
      vi: 'Cần tư vấn thêm về chương trình học?',
      en: 'Need guidance on choosing the right academic pathway?',
    },
    subtitle: {
      vi: 'Đội ngũ tư vấn của EPath sẵn sàng giúp bạn chọn lộ trình phù hợp nhất cho con',
      en: 'Our academic advisors are ready to help you tailor the ideal educational roadmap for your child.',
    },
    buttonText: {
      vi: 'Liên hệ tư vấn miễn phí',
      en: 'Book Free 1:1 Consultation',
    },
    buttonLink: '/admissions#contact',
  },
  showAchievements: true,
}
