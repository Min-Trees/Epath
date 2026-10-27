import type { AdmissionsContentInput } from './cms-types'

export const DEFAULT_ADMISSIONS_DATA: AdmissionsContentInput = {
  hero: {
    badge: {
      vi: 'Tư vấn & Tuyển sinh K-12 Chuẩn Hoa Kỳ',
      en: 'US-Standard K-12 Admissions & Advising',
    },
    title: {
      vi: 'Khởi Đầu Hành Trình Học Thuật Quốc Tế Bền Vững',
      en: 'Begin Your Global Academic Journey',
    },
    subtitle: {
      vi: 'Lộ trình rõ ràng từ đánh giá năng lực đầu vào đến nhận Bằng Tú tài Mỹ Cognia & WASC. Tối ưu chi phí giáo dục chỉ bằng 1/3 trường quốc tế.',
      en: 'A structured pathway from diagnostic testing to Cognia & WASC US High School Diploma at 1/3 of international school costs.',
    },
    imageUrl: '/images/admissions/admissions-hero.jpg',
    floatingBadgeTitle: {
      vi: 'Bằng Tú Tài Mỹ Cognia & WASC',
      en: 'Cognia & WASC US Diploma',
    },
    floatingBadgeSubtitle: {
      vi: 'Được công nhận chuyển tiếp toàn cầu',
      en: 'Globally Recognized Credential',
    },
    primaryCtaText: {
      vi: 'Đăng ký tư vấn lộ trình ngay',
      en: 'Register for Free Consultation',
    },
    secondaryCtaText: {
      vi: 'Xem gói học phí',
      en: 'View Tuition Packages',
    },
  },
  trustBadges: [
    {
      icon: 'ShieldCheck',
      color: '#2E4A9E',
      title: {
        vi: 'Kiểm Định Kép Hoa Kỳ',
        en: 'US Dual Accreditation',
      },
      desc: {
        vi: 'Cognia & WASC công nhận',
        en: 'Cognia & WASC Certified',
      },
    },
    {
      icon: 'Coins',
      color: '#5C9024',
      title: {
        vi: 'Chi Phí Bền Vững',
        en: '1/3 Tuition Advantage',
      },
      desc: {
        vi: 'Bằng 1/3 trường quốc tế',
        en: 'Save 67% vs Int\'l Schools',
      },
    },
    {
      icon: 'FileCheck2',
      color: '#F26522',
      title: {
        vi: 'Khảo Sát Chuẩn Xác',
        en: 'Diagnostic Assessment',
      },
      desc: {
        vi: 'Test Exact Path miễn phí',
        en: 'Exact Path Benchmark',
      },
    },
    {
      icon: 'UserCheck',
      color: '#1E3570',
      title: {
        vi: 'Cố Vấn 1:1 Đồng Hành',
        en: '1:1 Academic Advisor',
      },
      desc: {
        vi: 'Theo sát & báo cáo định kỳ',
        en: 'Weekly Progress Reports',
      },
    },
  ],
  stepsSection: {
    badge: {
      vi: 'Quy trình tuyển sinh chuẩn mực',
      en: 'Standardized Admissions Process',
    },
    title: {
      vi: 'Quy Trình Nhập Học 5 Bước Minh Bạch & Tối Ưu',
      en: '5-Step Transparent & Streamlined Admissions Pathway',
    },
    subtitle: {
      vi: 'Lộ trình tuyển sinh cá nhân hóa, từ khảo sát năng lực đầu vào chuẩn Hoa Kỳ đến khi nhận Bằng Tú tài Mỹ Cognia & WASC.',
      en: 'A personalized admissions journey from US-standard diagnostic testing to achieving the Cognia & WASC US High School Diploma.',
    },
    showSteps: true,
  },
  tuition: {
    badge: {
      vi: 'Đầu tư giáo dục bền vững',
      en: 'Sustainable Investment',
    },
    title: {
      vi: 'Gói Học Phí & Chính Sách Tài Chính Minh Bạch',
      en: 'Tuition Packages & Transparent Financial Policy',
    },
    subtitle: {
      vi: 'EPath cung cấp các lộ trình học tập linh hoạt theo năng lực và mục tiêu từng học sinh, tối ưu ngân sách gia đình với chất lượng quốc tế được kiểm định.',
      en: 'EPath offers flexible learning tracks tailored to each student\'s goals, optimizing family investment with accredited US quality.',
    },
    tracks: [
      {
        id: 'foundation',
        programKey: 'kindergarten',
        badge: {
          vi: 'Mầm non & Khởi đầu',
          en: 'Early Foundation',
        },
        title: {
          vi: 'Foundation Track',
          en: 'Foundation Track',
        },
        target: {
          vi: 'Mầm non & Lớp 1 – 2',
          en: 'Kindy & Grade 1–2',
        },
        hours: {
          vi: '3 – 5 giờ / tuần',
          en: '3 – 5 hrs / week',
        },
        desc: {
          vi: 'Thẩm thấu tiếng Anh tự nhiên qua Cambridge Phonics, Early Math và học tập tương tác đa giác quan.',
          en: 'Natural English phonics, early math thinking, and topic-based interactive learning.',
        },
        highlights: {
          vi: [
            'Giáo viên quốc tế & song ngữ',
            'Chuẩn Cambridge English',
            'Sĩ số nhỏ, tương tác liên tục',
          ],
          en: [
            'International & bilingual faculty',
            'Official Cambridge English standard',
            'Small class size with high engagement',
          ],
        },
        popular: false,
        badgeBg: '#EAEFFB',
        badgeColor: '#2E4A9E',
      },
      {
        id: 'standard',
        programKey: 'elementary',
        badge: {
          vi: 'Tiểu học & THCS',
          en: 'Elementary & Middle',
        },
        title: {
          vi: 'Standard & Advanced',
          en: 'Standard & Advanced',
        },
        target: {
          vi: 'Lớp 3 – Lớp 8',
          en: 'Grade 3 – Grade 8',
        },
        hours: {
          vi: '5 – 7 giờ / tuần',
          en: '5 – 7 hrs / week',
        },
        desc: {
          vi: 'Toán & Khoa học bằng Tiếng Anh chuẩn Edmentum US Common Core kết hợp phát triển IELTS học thuật.',
          en: 'US Common Core Math & Science via Edmentum plus Cambridge/IELTS academic preparation.',
        },
        highlights: {
          vi: [
            'Tài khoản Edmentum 12 tháng',
            'Học song song trường công',
            'Cố vấn 1:1 kèm cặp tiến độ',
          ],
          en: [
            '12-month licensed Edmentum access',
            'Flexible schedule alongside school',
            '1:1 mentor tracking & skill tutoring',
          ],
        },
        popular: false,
        badgeBg: '#EDF7E2',
        badgeColor: '#5C9024',
      },
      {
        id: 'dual-diploma',
        programKey: 'high-dual-diploma',
        badge: {
          vi: 'Song bằng Hoa Kỳ',
          en: 'US Dual Diploma',
        },
        title: {
          vi: 'Dual Diploma Pathway',
          en: 'US Dual Diploma',
        },
        target: {
          vi: 'Lớp 9 – Lớp 12',
          en: 'Grade 9 – Grade 12',
        },
        hours: {
          vi: '5 Tín chỉ Mỹ tích lũy',
          en: '5 US Credits earned',
        },
        desc: {
          vi: 'Hoàn thành 5 tín chỉ Mỹ với EdOptions Academy, nhận đồng thời Bằng THPT Việt Nam và Tú tài Mỹ.',
          en: 'Complete 5 required US credits with EdOptions Academy to earn both VN and US diplomas.',
        },
        highlights: {
          vi: [
            'Bằng Tú tài Mỹ Cognia & WASC',
            'Lợi thế vượt trội xét tuyển ĐH',
            'Chương trình song bằng phổ biến',
          ],
          en: [
            'Cognia & WASC accredited US Diploma',
            'Significant edge for university admissions',
            'Most popular high school pathway',
          ],
        },
        popular: true,
        badgeBg: '#FDF0EA',
        badgeColor: '#F26522',
      },
      {
        id: 'fulltime-homeschool',
        programKey: 'high-fulltime-homeschool',
        badge: {
          vi: 'Homeschool Toàn phần',
          en: 'Fulltime Homeschool',
        },
        title: {
          vi: 'Fulltime US Diploma',
          en: 'Fulltime US Diploma',
        },
        target: {
          vi: 'Lớp 9 – Lớp 12',
          en: 'Grade 9 – Grade 12',
        },
        hours: {
          vi: '21.5 Tín chỉ chuẩn Hoa Kỳ',
          en: '21.5 US Common Core Credits',
        },
        desc: {
          vi: 'Học toàn thời gian với tư cách học sinh chính thức của trường phổ thông Mỹ trực thuộc Edmentum International.',
          en: 'Fulltime enrollment as an official US high school student under Edmentum International.',
        },
        highlights: {
          vi: [
            'Bảng điểm & Bằng Tú tài Mỹ 100%',
            'Cố vấn chuẩn bị hồ sơ du học',
            'Chuyển tiếp thẳng đại học quốc tế',
          ],
          en: [
            '100% official US transcripts & diploma',
            'Comprehensive 1:1 college counseling',
            'Direct pathway to global universities',
          ],
        },
        popular: false,
        badgeBg: '#EAEFFB',
        badgeColor: '#1E3570',
      },
    ],
  },
  financialPolicy: {
    badge: {
      vi: 'Mô hình Blended Learning tối ưu',
      en: 'Blended Learning Model',
    },
    leftBoxTitle: {
      vi: 'Vì sao lộ trình tại EPath tối ưu ngân sách cho gia đình?',
      en: 'Why is EPath the most cost-efficient pathway for families?',
    },
    leftBoxDesc: {
      vi: 'Thông qua mô hình học tập kết hợp (Blended Learning) trên nền tảng số hóa của Edmentum International cùng sự đồng hành của đội ngũ giáo viên tại Campus, EPath loại bỏ những chi phí cơ sở vật chất cồng kềnh không cần thiết, tập trung toàn bộ nguồn lực vào chất lượng giảng dạy, cố vấn học thuật 1:1 và chứng nhận quốc tế.',
      en: 'By leveraging Edmentum\'s digital curriculum and campus-based teachers, EPath eliminates bloated campus overheads and invests directly in faculty excellence, 1:1 mentorship, and accredited diploma credentials.',
    },
    leftBoxImage: '/images/admissions/admissions-consultation.jpg',
    leftBoxBadge: {
      vi: 'Kiểm định Cognia & WASC',
      en: 'Cognia & WASC Certified',
    },
    buttonText: {
      vi: 'Nhận Bảng Báo Học Phí Chi Tiết',
      en: 'Request Detailed Tuition Plan',
    },
    rightBoxTitle: {
      vi: '5 Cam Kết Quyền Lợi Tài Chính Minh Bạch:',
      en: '5 Core Financial Guarantees:',
    },
    guarantees: [
      {
        title: {
          vi: 'Biểu phí minh bạch, không chi phí ẩn',
          en: 'Transparent Agreement, Zero Hidden Fees',
        },
        desc: {
          vi: 'Toàn bộ chi phí đào tạo và bản quyền học liệu được nêu rõ trước niên khóa, cam kết không phát sinh bất kỳ khoản phụ phí nào.',
          en: 'Clear fee schedule with zero surprise costs throughout the academic school year.',
        },
      },
      {
        title: {
          vi: 'Tài khoản Edmentum bản quyền 12 tháng',
          en: '12-Month Licensed Edmentum Account',
        },
        desc: {
          vi: 'Kho bài giảng số hóa không giới hạn với hơn 400 môn học chuẩn Common Core và chứng nhận Cognia & WASC.',
          en: 'Full access to 400+ digital courses aligned with US Common Core and accredited by Cognia & WASC.',
        },
      },
      {
        title: {
          vi: 'Khảo sát đầu vào & Tư vấn 1:1 miễn phí',
          en: 'Free Diagnostic Test & 1:1 Consultation',
        },
        desc: {
          vi: 'Hoàn toàn miễn phí bài khảo sát Exact Path Diagnostic và buổi phân tích báo cáo cùng chuyên gia.',
          en: 'Complimentary diagnostic testing and personalized roadmap strategy consultation.',
        },
      },
      {
        title: {
          vi: 'Học bổng học thuật cho học sinh xuất sắc',
          en: 'Merit Scholarships for High Achievers',
        },
        desc: {
          vi: 'Chính sách học bổng khuyến học dành cho các học sinh đạt thành tích cao trong học tập và các kỳ thi quốc tế.',
          en: 'Scholarships awarded to students demonstrating exceptional academic and Olympiad performance.',
        },
      },
      {
        title: {
          vi: 'Chi phí bền vững, hiệu quả dài hạn',
          en: 'Sustainable & Long-Term Efficiency',
        },
        desc: {
          vi: 'Thụ hưởng giáo dục Hoa Kỳ đẳng cấp với mức đầu tư hợp lý, hoàn thành trọn vẹn lộ trình học tập từ K–12.',
          en: 'Access elite US education at optimal cost, ensuring smooth academic progression from K to 12.',
        },
      },
    ],
  },
  campusSection: {
    badge: {
      vi: 'Địa chỉ & Thông tin liên hệ',
      en: 'Address & Contact Information',
    },
    title: {
      vi: 'Thông Tin Liên Hệ & Trải Nghiệm Campus',
      en: 'Campus Contact & Tour Information',
    },
    subtitle: {
      vi: 'Phụ huynh luôn được chào đón đến thăm quan cơ sở vật chất và trao đổi trực tiếp cùng ban giám đốc học thuật.',
      en: 'Parents are always welcome to tour our campus and meet our academic leadership team.',
    },
    campusImage: '/images/admissions/admissions-campus.jpg',
    addressLabel: {
      vi: 'Địa chỉ campus',
      en: 'Campus address',
    },
    addressValue: {
      vi: '38 Trần Phú, Phường Thủ Dầu Một, Hồ Chí Minh',
      en: '38 Tran Phu Street, Thu Dau Mot Ward, Ho Chi Minh City',
    },
    hotline: '0937 514 896',
    hotlineNote: {
      vi: 'Hỗ trợ tư vấn học vụ 24/7',
      en: '24/7 Academic Support',
    },
    email: 'infor@epath.edu.vn',
    workingHours: {
      vi: 'Thứ 2 – Thứ 7: 08:00 – 17:30',
      en: 'Mon – Sat: 08:00 – 17:30',
    },
    tourTitle: {
      vi: 'Hẹn Lịch Thăm Quan Campus',
      en: 'Schedule a Campus Tour',
    },
    tourDesc: {
      vi: 'Trải nghiệm không gian học tập thực tế và trao đổi 1:1 với Ban Giám Đốc Học Vụ.',
      en: 'Tour our modern classrooms and speak directly with academic directors.',
    },
  },
  formSection: {
    badge: {
      vi: 'Đồng hành cùng gia đình',
      en: 'Admissions & Mentorship',
    },
    title: {
      vi: 'Bắt đầu hành trình học tập của con cùng EPath',
      en: 'Begin Your Child\'s Learning Journey with EPath',
    },
    description: {
      vi: 'Mỗi học sinh có một năng lực, sở thích và định hướng khác nhau. EPath Education đồng hành cùng phụ huynh trong việc tìm hiểu chương trình học, đánh giá nhu cầu và xây dựng lộ trình giáo dục phù hợp cho từng giai đoạn phát triển của học sinh.',
      en: 'Each student has unique strengths, interests, and aspirations. EPath Education partners with parents to explore curricula, evaluate needs, and tailor educational pathways suited to each developmental stage.',
    },
    confidentialityNote: {
      vi: '🔒 EPath cam kết bảo mật 100% thông tin phụ huynh và học sinh.',
      en: '🔒 EPath commits to 100% confidentiality of your contact details.',
    },
  },
}
