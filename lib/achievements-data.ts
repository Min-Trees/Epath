import type { AchievementsContentInput } from './cms-types'

export const DEFAULT_ACHIEVEMENTS_CONTENT: AchievementsContentInput = {
  badge: {
    vi: 'Dấu ấn xuất sắc',
    en: 'Verified Excellence',
  },
  title: {
    vi: 'Thành tích Vượt trội & Kết quả Đào tạo',
    en: 'Outstanding Achievements & Outcomes',
  },
  subtitle: {
    vi: 'Minh chứng cho chất lượng đào tạo chuẩn hóa và năng lực hội nhập toàn cầu của học sinh EPath',
    en: "Demonstrating our standardized academic rigor and students' global readiness",
  },
  desc: {
    vi: 'Trong suốt quá trình học tập tại EPath, học sinh liên tục ghi dấu ấn với những kết quả học thuật nổi bật tại các kỳ thi chuẩn hóa quốc tế và đấu trường học thuật uy tín.',
    en: 'Throughout their journey at EPath, students consistently achieve outstanding results in standardized international examinations and prestigious academic arenas.',
  },
  metrics: [
    {
      number: '92%',
      label: {
        vi: 'Đỗ Đại học Mỹ Uy Tín',
        en: 'US University Acceptance',
      },
      desc: {
        vi: 'Tỷ lệ học sinh tốt nghiệp chương trình EdOptions Academy trúng tuyển vào các trường đại học tại Hoa Kỳ.',
        en: 'Acceptance rate of EdOptions Academy graduates into accredited universities across the United States.',
      },
    },
    {
      number: '100%',
      label: {
        vi: 'Đạt Chuẩn Ngôn Ngữ',
        en: 'Language Proficiency',
      },
      desc: {
        vi: 'Học sinh hoàn thành lớp 8 đạt IELTS 5.5+ và học sinh THPT đạt IELTS 7.0+ mở rộng cơ hội học bổng.',
        en: 'Students reach IELTS 5.5+ by Grade 8 and IELTS 7.0+ in High School, maximizing scholarship competitiveness.',
      },
    },
    {
      number: '21.5',
      label: {
        vi: 'Tín Chỉ Tú Tài Mỹ',
        en: 'US High School Credits',
      },
      desc: {
        vi: 'Tích lũy trọn vẹn theo khung kiểm định Cognia & WASC để tốt nghiệp với tư cách học sinh bản xứ Hoa Kỳ.',
        en: 'Earned under Cognia & WASC accreditation to graduate with the status of a native US high school student.',
      },
    },
    {
      number: '400+',
      label: {
        vi: 'Khóa Học Chuẩn Quốc Tế',
        en: 'Accredited US Courses',
      },
      desc: {
        vi: 'Kho học liệu số hóa của Edmentum bao gồm các môn nâng cao AP® được College Board phê duyệt.',
        en: 'Edmentum course catalog including College Board approved Advanced Placement (AP®) university-level subjects.',
      },
    },
  ],
  olympiad: {
    imageUrl: '/images/about/about-achievements.jpg',
    badge: 'SASMO • AMC • TIMO • Vanda',
    tag: {
      vi: 'Dấu Ấn Xuất Sắc',
      en: 'Outstanding Milestone',
    },
    title: {
      vi: 'Đấu trường Học thuật & Trải nghiệm Công nghệ',
      en: 'Academic Olympiads & Applied Innovation',
    },
    desc: {
      vi: 'Học sinh EPath thường xuyên thử thách và đạt giải cao tại các kỳ thi Olympic quốc tế như IMEC, STEMCO, GMEC, TIMO; đồng thời trực tiếp sáng tạo các dự án Robotics, thiết kế in 3D thực nghiệm tại Makerspace FabLab EIU.',
      en: 'EPath learners regularly earn honors in global competitions (IMEC, STEMCO, GMEC, TIMO) and build applied robotics and 3D printing engineering projects at FabLab EIU.',
    },
    ctaText: {
      vi: 'Xem Lộ Trình Học Thuật',
      en: 'Explore Academic Pathways',
    },
    ctaLink: '/programs',
  },
}
