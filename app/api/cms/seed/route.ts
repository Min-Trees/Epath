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
      body: {
        vi: 'EPath Education được hình thành từ một câu hỏi rất thực của phụ huynh tại hệ thống Mầm non Little People sau hơn 10 năm vận hành: <strong>"Sau Mầm non, con sẽ tiếp tục học theo lộ trình nào để không bị đứt gãy?"</strong><br/><br/>Từ nhu cầu đó, EPath ra đời như một lời giải có hệ thống — không chỉ là một chương trình học, mà là một lộ trình giáo dục xuyên suốt từ Tiểu học đến Trung học, giúp học sinh tiếp cận sớm với nền tảng học thuật quốc tế.<br/><br/>EPath được xây dựng trên niềm tin rằng: Một nền giáo dục hiệu quả không chỉ dừng lại ở việc truyền đạt kiến thức, mà cần tạo ra một hệ sinh thái học tập — nơi nhà trường, gia đình và các chuyên gia cùng đồng hành.<br/><br/>Thông qua mô hình học tập Blended Learning (kết hợp Trực tuyến và Trực tiếp), cùng Tổ chức giáo dục Edmentum International (USA) – được kiểm định bởi Cognia và WASC, EPath triển khai chương trình chuẩn hóa theo tiêu chuẩn quốc tế, đồng thời xây dựng cộng đồng phụ huynh có cùng định hướng & mục tiêu giáo dục.<br/><br/>Với đội ngũ giáo viên và cố vấn học tập chuyên môn cao, EPath tập trung phát triển năng lực học thuật, kỹ năng tự học và tư duy thế kỷ 21, giúp học sinh sẵn sàng chinh phục các chương trình quốc tế, đạt các chứng chỉ học thuật và hướng đến mục tiêu dài hạn là hội nhập vào môi trường giáo dục toàn cầu.',
        en: 'EPath Education was born from a real question asked by parents of the Little People Kindergarten system after 10+ years of operation: <strong>"After Kindergarten, what pathway should our child follow so it doesn\'t break?"</strong><br/><br/>From that need, EPath was created as a systematic answer — not just a curriculum but a continuous educational journey from Elementary through High School, helping students access international academic standards early.<br/><br/>EPath is built on the belief that an effective education is not only about knowledge transfer — it must create a learning ecosystem where school, family and experts walk together.<br/><br/>Through the Blended Learning model (online + on-site) and in partnership with Edmentum International (USA) — accredited by Cognia and WASC — EPath delivers internationally standardised programmes and a community of families with shared educational direction.<br/><br/>With a highly qualified teaching team and academic advisors, EPath focuses on academic competency, self-learning skills and 21st-century thinking — preparing students for international programmes, academic certifications and long-term global integration.',
      },
      order: 1,
      isActive: true,
    },
    {
      id: 'home-vision',
      type: 'vision',
      title: { vi: 'Tầm nhìn', en: 'Our Vision' },
      body: {
        vi: 'EPath hướng đến trở thành một giải pháp giáo dục toàn diện, nơi học sinh và phụ huynh được tiếp cận với định hướng giáo dục Phổ thông quốc tế một cách hiệu quả, rõ ràng và bền vững về chi phí.<br/><br/>EPath không chỉ cung cấp chương trình học, mà xây dựng một hành trình giáo dục xuyên suốt, kết nối giữa nhà trường, gia đình và các nguồn lực giáo dục trong và ngoài nước.<br/><br/><strong>Định hướng của EPath là: Đưa giáo dục quốc tế chất lượng cao trở nên dễ tiếp cận hơn với nhiều gia đình Việt Nam.</strong> Thông qua việc kết hợp công nghệ, đội ngũ giáo dục và mô hình học tập linh hoạt, EPath không ngừng mở rộng cơ hội học tập cùng các đối tác uy tín, giúp học sinh phát triển năng lực toàn diện, sẵn sàng hội nhập và theo đuổi hành trình học tập suốt đời trong môi trường toàn cầu.',
        en: 'EPath strives to become a holistic education solution that gives students and families efficient, transparent and cost-sustainable access to international-standard schooling.<br/><br/>We connect school, family and educational resources at home and abroad into a continuous educational journey.<br/><br/><strong>Our direction: Make high-quality international education more accessible to Vietnamese families.</strong> Through technology, our teaching team and a flexible learning model, EPath continuously expands learning opportunities with trusted partners, so students develop holistic competencies and are ready to integrate into a global learning environment for life.',
      },
      order: 2,
      isActive: true,
    },
    {
      id: 'home-mission',
      type: 'mission',
      title: { vi: 'Sứ mệnh', en: 'Our Mission' },
      body: {
        vi: 'Xây dựng một môi trường giáo dục kết nối giữa nhà trường – gia đình – chuyên gia, nơi học sinh được tiếp cận chương trình học chuẩn quốc tế, đồng thời tham gia các hoạt động học thuật, trải nghiệm và định hướng kỹ năng.<br/><br/>EPath cam kết đồng hành cùng phụ huynh trong việc phát triển toàn diện cho học sinh, không chỉ trong học tập mà còn trong năng lực tự học, tư duy và kỹ năng sống.',
        en: 'Build an educational environment that connects school – family – experts, where every student accesses international-standard curricula and engages in academic, experiential and skill-oriented programmes.<br/><br/>EPath partners with families to develop the whole learner — academically, intellectually and in life skills.',
      },
      order: 3,
      isActive: true,
    },
    {
      id: 'home-stats',
      type: 'statistics',
      title: { vi: 'Những con số ấn tượng', en: 'EPath at a Glance' },
      order: 5,
      isActive: true,
    },
    {
      id: 'home-whyEdmentum',
      type: 'whyEdmentum',
      title: { vi: 'Vì sao chọn Edmentum International?', en: 'Why Edmentum International?' },
      body: {
        vi: '<strong>1. Hệ sinh thái học thuật quốc tế có khả năng đo lường và chuyển đổi khách quan.</strong><br/><br/>Đối với bậc Tiểu học và Trung học cơ sở (trước lớp 9), Edmentum là một trong những hệ sinh thái học tập phù hợp với xu hướng giáo dục quốc tế hiện đại. Các nền tảng đánh giá và cá nhân hóa học tập của Edmentum hiện được nhiều trường học và tổ chức giáo dục quốc tế sử dụng nhằm:<br/>- Đánh giá năng lực, theo dõi năng lực học tập so với khung chuẩn của chương trình phổ thông quốc tế.<br/>- Hỗ trợ học sinh từ các chương trình quốc gia chuyển đổi lộ trình qua chương trình phổ thông quốc tế.<br/>- Đảm bảo tính khách quan và liên tục, giúp bộ phận chuyên môn và phụ huynh kịp thời cập nhật tình hình học tập.<br/><br/><strong>2. Nền tảng linh hoạt để mở rộng nhiều lộ trình quốc tế trong tương lai.</strong><br/><br/>Bên cạnh hệ sinh thái đánh giá và cá nhân hóa học tập, Edmentum còn là nền tảng học thuật được sử dụng trong nhiều chương trình Phổ thông Quốc tế, trong đó có các mô hình Dual Diploma (Song bằng) dành cho học sinh Trung học. Thông qua trường học trực tuyến EdOptions Academy thuộc hệ sinh thái Edmentum, từ lớp 9, học sinh có thể theo học chương trình Trung học phổ thông Hoa Kỳ theo hình thức tích lũy tín chỉ trực tuyến, song song với chương trình học tại các trường Công lập hoặc Tư thục trong nước.',
        en: '<strong>1. An international academic ecosystem that is measurable and objectively transferable.</strong><br/><br/>For Elementary and Middle School (before Grade 9), Edmentum is one of the most modern international-trend learning ecosystems. Schools and international education organisations use Edmentum\'s assessment and personalisation platforms to evaluate competency against international standards, support students transitioning from national to international programmes, and keep families and advisors continuously informed.<br/><br/><strong>2. A flexible platform to expand many future international pathways.</strong><br/><br/>Beyond assessment and personalisation, Edmentum is also the academic backbone for many international programmes — including Dual Diploma models for high schoolers. Through EdOptions Academy, from Grade 9 students can accumulate US high-school credits online, in parallel with their domestic Vietnamese schooling.',
      },
      order: 6,
      isActive: true,
    },
    {
      id: 'home-cta',
      type: 'cta',
      title: { vi: 'Sẵn sàng đồng hành cùng EPath?', en: 'Ready to walk with EPath?' },
      subtitle: {
        vi: 'Đăng ký tư vấn miễn phí để được định hướng lộ trình phù hợp nhất.',
        en: 'Register for a free consultation to receive the most suitable learning pathway guidance.',
      },
      order: 7,
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
        vi: 'Đánh giá năng lực (Assessment)',
        en: 'Assessment',
      },
      description: {
        vi: 'Học sinh được đánh giá đầu vào nhằm xác định trình độ hiện tại, điểm mạnh và những nội dung cần phát triển theo khung chuẩn phổ thông Mỹ.',
        en: 'An entry assessment identifies each student\'s current level, strengths and growth areas against the US Common Core standards.',
      },
      icon: 'ClipboardCheck',
      order: 0,
      isActive: true,
    },
    {
      title: {
        vi: 'Tư vấn lộ trình học tập cá nhân hóa',
        en: 'Personalised Pathway Planning',
      },
      description: {
        vi: 'Đội ngũ EPath xây dựng lộ trình học tập phù hợp với năng lực, mục tiêu và định hướng phát triển của từng học sinh.',
        en: 'The EPath team designs a learning pathway tailored to each student\'s ability, goals and long-term direction.',
      },
      icon: 'Map',
      order: 1,
      isActive: true,
    },
    {
      title: {
        vi: 'Mô hình học tập kết hợp (Blended Learning)',
        en: 'Blended Learning Model',
      },
      description: {
        vi: 'Học sinh học tập thông qua mô hình Blended Learning, kết hợp giữa học trực tuyến, học trực tiếp tại Campus và hệ thống học liệu số quốc tế. Mỗi học sinh được cấp tài khoản Edmentum có thời hạn 12 tháng.',
        en: 'Students learn via Blended Learning — combining online study, on-campus sessions and international digital resources. Each student is granted a 12-month Edmentum account.',
      },
      icon: 'Laptop',
      order: 2,
      isActive: true,
    },
    {
      title: {
        vi: 'Cố vấn học tập đồng hành xuyên suốt',
        en: 'Continuous Academic Advising',
      },
      description: {
        vi: 'Học sinh được theo dõi thường xuyên bởi đội ngũ Academic Advisors, đồng thời phụ huynh được cập nhật tiến độ và phối hợp xây dựng mục tiêu học tập dài hạn.',
        en: 'Academic Advisors monitor progress continuously. Parents receive regular updates and partner with EPath to set long-term learning goals.',
      },
      icon: 'MessageCircle',
      order: 3,
      isActive: true,
    },
    {
      title: {
        vi: 'Đánh giá liên tục & Ghi nhận thành tích',
        en: 'Continuous Assessment & Achievement',
      },
      description: {
        vi: 'Thông qua các bài đánh giá định kỳ, dự án học tập, hoạt động trải nghiệm và các kỳ thi học thuật, học sinh liên tục được ghi nhận sự tiến bộ và điều chỉnh lộ trình phù hợp.',
        en: 'Through periodic assessments, learning projects, experiential activities and academic competitions, progress is documented and pathways are adjusted.',
      },
      icon: 'Award',
      order: 4,
      isActive: true,
    },
  ],

  // ----------------------------------------------------------
  // LEARNING PATHWAYS
  // ----------------------------------------------------------
  learningPathways: [
    {
      level: 'kindergarten',
      title: {
        vi: 'Mầm non (Little People)',
        en: 'Kindergarten (Little People)',
      },
      description: {
        vi: 'Chương trình Mầm non hình thành nền tảng tiếng Anh theo chuẩn Cambridge, kết hợp hoạt động phát triển ngôn ngữ, tư duy toán sớm và trải nghiệm kỹ năng — tạo nền móng vững chắc để sẵn sàng bước vào môi trường học tập bằng tiếng Anh.',
        en: 'Our Kindergarten programme builds a Cambridge-aligned English foundation combined with early numeracy, language development and skill-building experiences — preparing children to enter English-medium learning with confidence.',
      },
      objectives: [
        { vi: 'SpeedUp English Programme', en: 'SpeedUp English Programme' },
        { vi: 'Nền tảng Toán – Khoa học sớm', en: 'Early Math & Science Foundations' },
        { vi: 'CLIL & Đọc viết sớm (Early Literacy)', en: 'CLIL & Early Literacy' },
      ],
      order: 0,
      isActive: true,
    },
    {
      level: 'elementary',
      title: {
        vi: 'Tiểu học (Elementary)',
        en: 'Elementary',
      },
      description: {
        vi: 'Chương trình Tiểu học theo chuẩn Common Core (Mỹ) thông qua hệ sinh thái Edmentum, gồm hai lộ trình: Foundation (Base Path) và Advanced (Prime Path) nhằm đáp ứng năng lực và định hướng quốc tế của từng học sinh.',
        en: 'The Elementary programme follows US Common Core standards via the Edmentum ecosystem, with two tracks — Base Path and Prime Path — that fit different ability levels and international aspirations.',
      },
      objectives: [
        { vi: 'Base Path (Foundation)', en: 'Base Path (Foundation)' },
        { vi: 'Prime Path (Advanced)', en: 'Prime Path (Advanced)' },
        { vi: 'SpeedUp English Programme', en: 'SpeedUp English Programme' },
        { vi: 'Academic Foundation Programme (ELA + Math + Science + Social Studies)', en: 'Academic Foundation Programme (ELA + Math + Science + Social Studies)' },
      ],
      order: 1,
      isActive: true,
    },
    {
      level: 'middle',
      title: {
        vi: 'Trung học Cơ sở (Middle School)',
        en: 'Middle School',
      },
      description: {
        vi: 'Chương trình THCS giúp học sinh chuyển từ "học bằng tiếng Anh" sang "tư duy và học tập độc lập bằng tiếng Anh", hướng đến IELTS 5.5+ và chuẩn bị cho các lộ trình quốc tế ở bậc THPT.',
        en: 'Middle School shifts students from "learning in English" to "thinking and studying independently in English", targeting IELTS 5.5+ and preparing them for international High School pathways.',
      },
      objectives: [
        { vi: 'Base Path (US Middle School)', en: 'Base Path (US Middle School)' },
        { vi: 'Prime Path (Advanced)', en: 'Prime Path (Advanced)' },
        { vi: 'IELTS Preparation 5.5+', en: 'IELTS Preparation 5.5+' },
      ],
      order: 2,
      isActive: true,
    },
    {
      level: 'high',
      title: {
        vi: 'Trung học Phổ thông (High School)',
        en: 'High School',
      },
      description: {
        vi: 'Chương trình THPT với hai lựa chọn chính: Dual Diploma (Song bằng Việt – Mỹ) và Fulltime Homeschool (chương trình Tú tài Mỹ toàn thời gian) thông qua EdOptions Academy, giúp học sinh chuẩn bị hồ sơ du học và đại học quốc tế.',
        en: 'High School offers two main paths: Dual Diploma (Vietnamese – US) and Fulltime Homeschool (US Diploma) via EdOptions Academy — fully preparing students for international university applications.',
      },
      objectives: [
        { vi: 'US Dual High School Diploma (Song bằng)', en: 'US Dual High School Diploma' },
        { vi: 'US High School Diploma (Fulltime Homeschool)', en: 'US High School Diploma (Fulltime Homeschool)' },
      ],
      order: 3,
      isActive: true,
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
        vi: 'US Dual High School Diploma – Chương trình Song bằng',
        en: 'US Dual High School Diploma',
      },
      shortDescription: {
        vi: 'Học sinh nhận đồng thời bằng THPT Việt Nam và bằng THPT Hoa Kỳ thông qua EdOptions Academy.',
        en: 'Earn both the Vietnamese High School Diploma and the US High School Diploma via EdOptions Academy.',
      },
      content: {
        vi: '<p>Dual Diploma là lộ trình học tập cho phép học sinh theo học đồng thời chương trình THPT Việt Nam và chương trình THPT Hoa Kỳ thông qua EdOptions Academy. Học sinh tiếp tục học tại trường hiện tại (Công lập / Tư thục) đồng thời hoàn thành các môn học và tín chỉ theo yêu cầu của Hoa Kỳ trên nền tảng học trực tuyến.</p><p>Sau khi hoàn thành yêu cầu của cả hai hệ thống, học sinh nhận <strong>Bằng THPT Việt Nam</strong> và <strong>Bằng THPT Hoa Kỳ</strong>.</p><p>Lộ trình đặc biệt phù hợp với học sinh muốn chuẩn bị hồ sơ du học hoặc mở rộng cơ hội xét tuyển đại học quốc tế trong tương lai.</p>',
        en: '<p>The Dual Diploma lets students pursue the Vietnamese High School Diploma and the US High School Diploma at the same time through EdOptions Academy. They stay enrolled in their current school (public or private) while earning US credits online.</p><p>On completion, students receive <strong>the Vietnamese High School Diploma</strong> and <strong>the US High School Diploma</strong>.</p><p>Ideal for students preparing international university applications or study-abroad portfolios.</p>',
      },
      ageRange: '15 – 18 tuổi',
      objectives: [
        { vi: 'Nhận song bằng Việt – Mỹ', en: 'Earn both Vietnamese & US diplomas' },
        { vi: 'Hồ sơ du học & đại học quốc tế', en: 'Study-abroad & international university portfolio' },
      ],
      highlights: [
        { vi: 'Học song song tại trường hiện tại', en: 'Concurrent study at current school' },
        { vi: 'EdOptions Academy (Edmentum)', en: 'EdOptions Academy (Edmentum)' },
      ],
      imageUrl: '',
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
        vi: 'US High School Diploma – Fulltime Homeschool (Chương trình Tú tài Mỹ)',
        en: 'US High School Diploma – Fulltime Homeschool',
      },
      shortDescription: {
        vi: 'Học toàn thời gian chương trình THPT Hoa Kỳ thông qua EdOptions Academy.',
        en: 'Fulltime US High School Diploma via EdOptions Academy.',
      },
      content: {
        vi: '<p>Học sinh học tập, tích lũy tín chỉ và hoàn thành yêu cầu tốt nghiệp hoàn toàn theo chương trình EdOptions Academy. Toàn bộ nội dung học tập, đánh giá và quản lý tiến độ được thực hiện theo tiêu chuẩn của hệ thống giáo dục Hoa Kỳ.</p><p>Phù hợp với gia đình theo đuổi giáo dục Hoa Kỳ toàn diện, cần sự linh hoạt về thời gian và địa điểm, có kế hoạch du học hoặc chuyển tiếp quốc tế.</p>',
        en: '<p>Students earn credits and graduate entirely through EdOptions Academy. Content, assessment and progress tracking all follow US education standards.</p><p>Ideal for families seeking a fully US-aligned education, with flexibility of time and place, and plans for study abroad or international transfer.</p>',
      },
      ageRange: '15 – 18 tuổi',
      objectives: [
        { vi: 'Tốt nghiệp THPT Hoa Kỳ', en: 'Graduate with a US High School Diploma' },
        { vi: 'Phát triển khả năng tự học & tự quản lý', en: 'Build strong self-learning & self-management skills' },
      ],
      highlights: [
        { vi: 'Học 100% trực tuyến', en: '100% online learning' },
        { vi: 'Linh hoạt thời gian & địa điểm', en: 'Flexible time & place' },
      ],
      imageUrl: '',
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
  // PARTNERS  (Edmentum, Cambridge, FabLab EIU)
  // ----------------------------------------------------------
  partners: [
    {
      name: 'Edmentum International',
      logoUrl: '',
      website: 'https://www.edmentum.com',
      category: 'curriculum',
      description: {
        vi: 'Edmentum International là tổ chức giáo dục hàng đầu đến từ Hoa Kỳ với hơn 60 năm phát triển trong lĩnh vực công nghệ giáo dục (EdTech), cung cấp hệ sinh thái học tập toàn diện cho học sinh từ Mầm non đến hết Trung học phổ thông (K–12). Hệ thống bao gồm: Chương trình học (Curriculum); Hệ thống đánh giá năng lực & cá nhân hóa bằng AI (Exact Path); Dịch vụ giảng dạy & hỗ trợ (Instructional Services – EdOptions Academy). Được kiểm định bởi Cognia và WASC.',
        en: 'Edmentum International is a leading US education organisation with 60+ years in EdTech. Its ecosystem covers Curriculum, AI-driven personalised assessment (Exact Path), and instructional services (EdOptions Academy) for K–12 learners. Accredited by Cognia and WASC.',
      },
      features: [
        { vi: 'Common Core chuẩn Mỹ', en: 'US Common Core standards' },
        { vi: 'AI cá nhân hóa (Exact Path)', en: 'AI personalisation (Exact Path)' },
        { vi: 'EdOptions Academy – Dual Diploma', en: 'EdOptions Academy – Dual Diploma' },
        { vi: 'Kiểm định Cognia & WASC', en: 'Cognia & WASC accredited' },
      ],
      isFeatured: true,
      order: 0,
      isActive: true,
    },
    {
      name: 'Cambridge Assessment English (ESOL)',
      logoUrl: '',
      website: 'https://www.cambridgeenglish.org',
      category: 'certification',
      description: {
        vi: 'Cambridge Assessment English (Đại học Cambridge, Vương quốc Anh) là tổ chức hàng đầu thế giới trong đánh giá và chứng nhận năng lực tiếng Anh, với hệ thống chứng chỉ được công nhận rộng rãi toàn cầu. EPath tích hợp khung năng lực Cambridge vào chương trình, giúp xác định trình độ, theo dõi tiến trình, định hướng các cột mốc Starters – Movers – Flyers và sẵn sàng học các môn quốc tế.',
        en: 'Cambridge Assessment English (University of Cambridge, UK) is the world\'s leading English assessment and certification body. EPath embeds the Cambridge framework to identify level, track progress, target Starters – Movers – Flyers milestones and prepare learners for international subjects.',
      },
      features: [
        { vi: 'Chứng chỉ quốc tế công nhận toàn cầu', en: 'Globally recognised certifications' },
        { vi: 'Starters – Movers – Flyers – KET – PET – IELTS', en: 'Starters – Movers – Flyers – KET – PET – IELTS' },
        { vi: 'Khung năng lực chuẩn quốc tế', en: 'International competency framework' },
      ],
      isFeatured: true,
      order: 1,
      isActive: true,
    },
    {
      name: 'FabLab EIU',
      logoUrl: '',
      website: 'https://eiu.edu.vn',
      category: 'lab',
      description: {
        vi: 'FabLab EIU là không gian sáng tạo (makerspace) trực thuộc Trường Đại học Quốc tế Miền Đông (EIU), nơi học sinh tiếp cận trực tiếp với các công nghệ hiện đại như thiết kế 3D, in 3D, lập trình, robotics và chế tạo sản phẩm. EPath hợp tác cùng FabLab EIU mang đến trải nghiệm ứng dụng cao trong lĩnh vực khoa học và công nghệ, giúp học sinh "biết làm" chứ không chỉ "hiểu bài".',
        en: 'FabLab EIU is the makerspace of East International University (EIU). Students get hands-on access to 3D design, 3D printing, programming, robotics and product fabrication. EPath partners with FabLab EIU so learners experience applied STEM and build 21st-century skills.',
      },
      features: [
        { vi: 'Thiết kế & in 3D', en: '3D design & printing' },
        { vi: 'Lập trình & Robotics', en: 'Programming & Robotics' },
        { vi: 'Chế tạo sản phẩm', en: 'Product fabrication' },
      ],
      isFeatured: false,
      order: 2,
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
