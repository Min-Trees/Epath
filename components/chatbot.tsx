'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Bot, User, ChevronRight, GraduationCap,
  DollarSign, Clock, Award, Phone, Mail, Check, ThumbsUp, ThumbsDown,
  Sparkles, FileText, Users, Globe, BookOpen, MapPin, Calendar,
  Loader2, Building2, Heart, TrendingUp, Maximize2, Baby, ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { extractTopics, summarizeConversation, type LeadPayload } from '@/lib/google-sheets'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  rating?: 'up' | 'down' | null
  showRating?: boolean
}

interface TopicQA {
  id: string
  label: string
  icon: React.ElementType
  questions: { q: string; a: string }[]
}

// Full Q&A Database from EPath
const qaDatabase: TopicQA[] = [
  {
    id: 'gioi-thieu',
    label: 'Giới thiệu EPath',
    icon: Sparkles,
    questions: [
      {
        q: 'EPath là gì? EPath dạy chương trình gì?',
        a: 'EPath Education cung cấp các giáo dục dành cho học sinh từ Mầm non đến Trung học, với định hướng học tập linh hoạt theo mô hình Semi-Homeschool và Homeschool chuẩn quốc tế.\n\nChương trình kết hợp:\n- Các môn học học thuật chuẩn Mỹ (ELA, Math, Science, Social Study...)\n- Tiếng Anh học thuật\n- Luyện thi chứng chỉ quốc tế và các kỳ thi Olympiad\n- Hoạt động ngoại khóa và phát triển kỹ năng học tập\n\nEPath hướng đến việc giúp học sinh xây dựng nền tảng để sẵn sàng cho các lộ trình Homeschool quốc tế, song bằng hoặc chuyển tiếp quốc tế với chi phí tối ưu hơn so với mô hình trường quốc tế truyền thống.'
      },
      {
        q: 'Homeschooling là gì?',
        a: 'Homeschooling là hình thức học tập cá nhân hóa, trong đó học sinh được xây dựng lộ trình học riêng phù hợp với năng lực, tốc độ học tập và định hướng tương lai của mình.\n\nHọc sinh có thể học:\n- Trực tiếp tại trung tâm\n- Trực tuyến tại nhà\n- Hoặc kết hợp linh hoạt giữa Online và Onsite\n\nTại EPath, chương trình Homeschool được triển khai theo định hướng quốc tế, kết hợp giữa học thuật chuẩn Mỹ, cố vấn học tập và theo dõi tiến độ cá nhân hóa. Học sinh có thể hướng đến Bằng Tú tài Mỹ, Song bằng Việt Nam – Mỹ, hoặc các chương trình chuyển tiếp quốc tế.'
      },
      {
        q: 'Homeschool có phải là tự học ở nhà không?',
        a: 'Không.\n\nHomeschool là một mô hình giáo dục có định hướng, với chương trình học rõ ràng, mục tiêu học tập cụ thể, cố vấn học tập và hệ thống theo dõi tiến độ xuyên suốt. Trong khi đó, tự học hoàn toàn là việc học sinh tự tìm tài liệu và tự quản lý việc học mà không có lộ trình hay hệ thống hỗ trợ chính thức.\n\nTại EPath, cô đồng hành cùng gia đình trong từng giai đoạn phát triển của học sinh từ Mầm non đến Trung học, với các chương trình được kiểm định bởi Cognia và WASC.'
      },
      {
        q: 'Homeschool có phù hợp với mọi học sinh không?',
        a: 'Không. Mô hình này thường phù hợp với những học sinh:\n\n- Có khả năng học tập độc lập\n- Có tính tự giác\n- Cần sự linh hoạt về thời gian hoặc địa điểm học tập'
      },
      {
        q: 'Chương trình này có phải là Chương trình Homeschool hay không?',
        a: 'Hiện tại, EPath Education đang triển khai 2 định hướng học tập:\n\n1. Chương trình tiêu chuẩn (Semi-Homeschool): Học sinh được tiếp cận chương trình phổ thông Mỹ với các môn học như ELA, Toán và Science nhằm xây dựng nền tảng học thuật và Tiếng Anh quốc tế, nhưng không nhận bảng điểm chính thức từ đối tác quốc tế.\n\n2. Chương trình Homeschooling: Học sinh theo học chính thức các môn từ chương trình phổ thông Quốc tế. EPath đóng vai trò cố vấn học tập, theo dõi tiến độ và hỗ trợ học thuật xuyên suốt. Học sinh sẽ có bảng điểm chính thức và bằng Tú Tài sau khi hoàn thành chương trình.'
      },
      {
        q: 'Homeschool và Semi-Homeschool khác nhau chỗ nào?',
        a: 'Homeschool và Semi-Homeschool tại EPath đều hướng đến giáo dục cá nhân hóa và định hướng quốc tế, tuy nhiên khác nhau ở mô hình học tập và mức độ đồng hành với trường truyền thống.\n\nHomeschool: Học sinh theo học trực tuyến theo chương trình phổ thông quốc tế, đặc biệt phổ biến tại Hoa Kỳ. Các chương trình đối tác của EPath được công nhận bởi Cognia và WASC.\n\nSemi-Homeschool: Mô hình kết hợp giữa trường học truyền thống và học tập cá nhân hóa. Học sinh vẫn học tại trường chính nhưng tham gia thêm các lớp tại EPath để tăng cường Tiếng Anh học thuật, Toán, Khoa học theo chuẩn quốc tế.'
      },
      {
        q: 'Dual Diploma/Song bằng là gì?',
        a: 'Dual Diploma là chương trình cho phép học sinh học đồng thời chương trình THPT Việt Nam và chương trình THPT Hoa Kỳ. Học sinh vẫn tiếp tục học tại trường hiện tại và học thêm các môn học theo chương trình Hoa Kỳ.\n\nSau khi hoàn thành đầy đủ yêu cầu của cả hai hệ thống, học sinh có cơ hội nhận hai bằng tốt nghiệp gồm tốt nghiệp PTTH Việt nam và PTTH Mỹ.'
      },
      {
        q: 'Chương trình có thể thay thế trường quốc tế được không?',
        a: 'Hoàn toàn có thể, đặc biệt với các gia đình định hướng Homeschool Toàn phần.\n\nTại EPath, học sinh có thể theo học chương trình phổ thông Quốc Tế thông qua các đối tác giáo dục quốc tế của EPath hoặc từng bước hướng đến mục tiêu đạt bằng Tú tài Mỹ với mức chi phí tối ưu hơn đáng kể so với mô hình trường quốc tế truyền thống.\n\nBên cạnh học thuật, EPath vẫn chú trọng phát triển kỹ năng xã hội, khả năng tương tác và làm việc nhóm thông qua các hoạt động ngoại khóa, dự án học tập và hoạt động cộng đồng định kỳ.'
      },
      {
        q: 'Chương trình khác gì với các Trung tâm Anh ngữ?',
        a: 'Tại EPath, học sinh không chỉ học Tiếng Anh giao tiếp để lấy chứng chỉ Cambridge hay các lớp học thuật đơn lẻ, mà được phát triển đồng thời:\n\n- Tiếng Anh học thuật (Academic English / ELA)\n- Toán và Science theo chuẩn quốc tế\n- Kỹ năng tự học và tư duy học tập quốc tế\n- Năng lực sử dụng Tiếng Anh như một công cụ học tập thực tế\n\nHọc sinh tại EPath được học và đánh giá thông qua hệ thống Exact Path và Courseware của Edmentum Hoa Kỳ — nền tảng giáo dục được công nhận bởi Cognia và WASC.'
      },
      {
        q: 'Tại sao chọn Edmentum?',
        a: 'EPath lựa chọn Edmentum vì đây không chỉ là một chương trình học online, mà là một hệ sinh thái giáo dục quốc tế được nhiều trường học và tổ chức giáo dục sử dụng để:\n\n- Đánh giá và theo dõi năng lực học sinh\n- Cá nhân hóa lộ trình học tập\n- Hỗ trợ linh hoạt chuyển tiếp giữa các môi trường giáo dục quốc tế\n\nTừ năm 2022, EPath đã hợp tác cùng Edmentum – tổ chức giáo dục Hoa Kỳ hàng đầu trong lĩnh vực EdTech.'
      },
      {
        q: 'Học phí EPath thấp, chất lượng thế nào?',
        a: 'Nhiều phụ huynh thường nghĩ rằng học phí thấp hơn đồng nghĩa với chất lượng thấp hơn. Tuy nhiên, định hướng của EPath Education không phải cắt giảm chất lượng học thuật, mà tối ưu mô hình vận hành để nhiều gia đình Việt Nam có thể tiếp cận giáo dục quốc tế dễ dàng hơn.\n\nEPath tập trung vào những giá trị cốt lõi:\n- Hệ thống học tập và đánh giá quốc tế từ Edmentum Hoa Kỳ\n- Nội dung học thuật theo chuẩn quốc tế\n- Đội ngũ giáo viên và cố vấn học tập\n- Lộ trình học tập cá nhân hóa\n- Mô hình Blended Learning (Online + Onsite)\n\nGiá trị mà EPath hướng đến là xây dựng lộ trình học tập quốc tế hiệu quả, bền vững và phù hợp hơn với nhu cầu thực tế của các gia đình.'
      }
    ]
  },
  {
    id: 'do-tuoi',
    label: 'Độ tuổi & Lộ trình',
    icon: Calendar,
    questions: [
      {
        q: 'Chương trình tuyển sinh độ tuổi nào?',
        a: 'EPath Education tuyển sinh học sinh từ Mầm non đến Trung học với lộ trình học tập được thiết kế theo từng độ tuổi và năng lực.\n\nMầm non (3–6 tuổi):\nHọc sinh được làm quen với Tiếng Anh học thuật thông qua Phonics (Ngữ âm Tiếng Anh), kết hợp nền tảng Toán và Khoa học. Mục tiêu là xây dựng khả năng ngôn ngữ và tư duy học tập sớm, đồng thời hướng đến Chứng chỉ Cambridge Starters trước khi vào lớp 1.\n\nTiểu học & Trung học:\nTùy theo năng lực và định hướng, phụ huynh có thể lựa chọn:\n- Chương trình Tiêu chuẩn: Các môn học chính là Ngữ văn Mỹ và Toán, giảng dạy ở cấp độ kiến thức nền tảng, không cung cấp bảng điểm.\n- Chương trình Quốc Tế: Học sinh từ Year 3 trở lên học 4 môn với bảng điểm được cung cấp mỗi cuối năm học.'
      },
      {
        q: 'Tại sao phải bắt đầu học từ Mầm Non?',
        a: 'Thật ra điều này còn tùy vào định hướng và sự ưu tiên của mỗi gia đình. Học sinh hoàn toàn có thể bắt đầu tham gia EPath từ Tiểu học.\n\nTuy nhiên, nếu trẻ được tiếp cận từ Mầm non, lộ trình học tập ở các cấp độ sau thường sẽ nhẹ nhàng và thuận lợi hơn rất nhiều. Tại EPath, học sinh sẽ dần làm quen với English Language Arts (ELA) như một ngôn ngữ học thuật thứ hai.\n\nViệc tiếp cận sớm từ Mầm non giúp trẻ hấp thụ ngôn ngữ tự nhiên hơn, tự tin hơn khi vào Tiểu học và hạn chế áp lực phải bổ sung quá nhiều kiến thức.'
      },
      {
        q: 'Chương trình có yêu cầu đầu vào không?',
        a: 'Có. Để đánh giá chính xác năng lực tiếng Anh và kiến thức học thuật, EPath sẽ thực hiện bài đánh giá đầu vào (Diagnostic Test) trên nền tảng Exact Path từ Edmentum International.\n\nSau bài đánh giá, phụ huynh sẽ nhận được báo cáo chi tiết về năng lực của học sinh theo từng kỹ năng và môn học, đồng thời đối chiếu với các tiêu chuẩn học thuật quốc tế. Dựa trên kết quả đó, Nhà Trường sẽ tư vấn lộ trình học tập và xếp lớp phù hợp nhất.'
      },
      {
        q: 'Mất bao lâu để tham gia Homeschool chính thức?',
        a: 'Thời gian để học sinh tham gia Chương trình Homeschool chính thức sẽ tùy thuộc vào năng lực Tiếng Anh, khả năng học thuật, kỹ năng tự học của từng học sinh cũng như sự đồng hành của gia đình.\n\nTrong suốt lộ trình tại EPath, học sinh sẽ được theo dõi thông qua các bài đánh giá định kỳ nhằm xác định mức độ sẵn sàng về ngôn ngữ và học thuật. Khi đạt đủ năng lực phù hợp, Nhà trường sẽ tư vấn để học sinh chuyển sang chương trình Homeschool chính thức.'
      },
      {
        q: 'Tại sao không dạy giáo trình Homeschool ngay từ đầu?',
        a: 'Rào cản lớn nhất của học sinh Việt Nam khi bắt đầu Chương trình Homeschool chính thức là khả năng ngôn ngữ và kỹ năng tự học trên nền tảng online.\n\nNếu chưa có nền tảng đủ vững hoặc thiếu sự đồng hành từ người lớn, trẻ sẽ rất dễ bị quá tải, mất động lực và khó theo lâu dài.\n\nEPath lựa chọn xây dựng nền tảng trước về:\n- Tiếng Anh học thuật\n- Kỹ năng học tập quốc tế\n- Khả năng tự học và quản lý việc học\n\nMục tiêu của EPath không phải để trẻ "học sớm", mà là học đúng thời điểm và đủ năng lực để phát triển bền vững.'
      },
      {
        q: 'Khai giảng lúc nào và thời lượng ra sao?',
        a: 'EPath tuyển sinh xuyên suốt năm học. Sau bài đánh giá đầu vào, học sinh sẽ được tư vấn và xếp lớp phù hợp với độ tuổi, năng lực Tiếng Anh và nền tảng học thuật hiện tại.\n\nChương trình học tại EPath được thiết kế theo mô hình học kỳ tương tự các trường quốc tế, bao gồm:\n- 3 học kỳ chính khóa\n- 1 học kỳ Hè\n\nCác lớp nền tảng (Pre-Level) nhằm giúp học sinh làm quen với phương pháp học tập, xây dựng nền tảng ngôn ngữ và học thuật trước khi bước vào các cấp độ chính thức.'
      },
      {
        q: 'Lịch học ra sao?',
        a: 'Lịch học tổng quát sẽ được thông báo trong biểu phí và thông tin tuyển sinh của từng chương trình.\n\nThời khoá biểu chi tiết cho từng lớp sẽ do Bộ phận Học vụ sắp xếp và gửi đến phụ huynh trước mỗi niên khoá hoặc học kỳ.'
      },
      {
        q: 'Học bao lâu thì có kết quả?',
        a: 'EPath Education không vận hành theo mô hình các khóa học ngắn hạn, mà xây dựng một lộ trình học tập mang tính dài hạn và liên tục.\n\nMục tiêu của EPath không chỉ dừng lại ở việc cải thiện khả năng Tiếng Anh, mà còn giúp học sinh từng bước hình thành:\n- Năng lực học thuật bằng Tiếng Anh\n- Tư duy học tập quốc tế\n- Khả năng tự học và quản lý việc học\n- Nền tảng cho các lộ trình song bằng, Homeschool hoặc chuyển tiếp quốc tế\n\nHiệu quả tại EPath thường được nhìn nhận theo từng học kỳ và quá trình phát triển lâu dài.'
      },
      {
        q: 'Học Homeschool có thể xét tuyển vào đại học quốc tế không?',
        a: 'Hoàn toàn có thể. Nhiều trường đại học quốc tế vẫn tiếp nhận học sinh theo mô hình Homeschool. Điều quan trọng là học sinh cần có:\n\n- Hồ sơ học tập rõ ràng\n- Bảng điểm minh bạch\n- Chương trình học được công nhận\n- Các minh chứng học thuật phù hợp\n\nĐây là lý do EPath đầu tư bài bản cho khâu lựa chọn chương trình và đối tác học thuật uy tín.'
      },
      {
        q: 'EPath có tương đương IB hoặc A-Level không?',
        a: 'EdOptions Academy (Đối tác học thuật trực tiếp của EPath), IB và A-Level là ba hệ thống giáo dục khác nhau:\n\n- EdOptions Academy cấp bằng THPT Hoa Kỳ\n- IB là chương trình Tú tài Quốc tế\n- A-Level là chương trình THPT Anh Quốc\n\nCả ba đều có thể được sử dụng để ứng tuyển vào các trường đại học quốc tế.'
      }
    ]
  },
  {
    id: 'chat-luong',
    label: 'Chất lượng & Giáo viên',
    icon: Award,
    questions: [
      {
        q: 'Bằng cấp của các GV là gì? Có đủ khả năng dạy chương trình quốc tế?',
        a: 'Đội ngũ giáo viên tại EPath không chỉ dừng ở các chứng chỉ giảng dạy Tiếng Anh như TESOL/TEFL, mà được định hướng và đào tạo để có đủ năng lực giảng dạy các nội dung phổ thông ở từng cấp độ học tập.\n\nGiáo viên tại EPath sẽ được đồng hành chuyên môn bởi Edmentum International. Đối với các cấp độ cao hơn và lộ trình Homeschool chính thức, học sinh sẽ dần chuyển sang học trực tiếp với các chương trình quốc tế thuộc hệ sinh thái đối tác, bao gồm các lớp học với giáo viên certified từ Hoa Kỳ.'
      },
      {
        q: 'Sĩ số lớp học bao nhiêu?',
        a: 'Sĩ số lớp học tại EPath không quá 20 học sinh/lớp nhằm đảm bảo giáo viên có thể theo sát quá trình học tập và hỗ trợ từng học sinh. Mỗi lớp sẽ có:\n- 1 Giáo viên Chính\n- 1 Cố vấn học tập\n\nTỷ lệ giáo viên được phân bổ theo từng cấp độ:\n\nMầm non: Học sinh học 3 buổi/tuần, mỗi buổi 1 giờ với 02 buổi Giáo viên Nước ngoài và 01 buổi Giáo viên Việt Nam.\n\nTiểu học & THCS: Học sinh học 4 buổi/tuần (02 buổi Online 60 phút + 02 buổi Onsite cuối tuần 90 phút).'
      },
      {
        q: 'Tutor là gì?',
        a: 'Tutor là các buổi học bổ trợ nhằm giúp học sinh củng cố kiến thức sau mỗi chủ đề học và tự tin hơn trước khi chuyển sang nội dung tiếp theo.\n\nỞ cấp độ Mầm Non, trẻ chủ yếu xây dựng nền tảng ngôn ngữ và làm quen với kỹ năng học thuật nên chưa cần học Tutor riêng. Giáo viên sẽ trực tiếp chia nhóm và ôn tập cho các con ngay trong các buổi học chính.'
      },
      {
        q: 'Lỡ bé theo không kịp có hỗ trợ gì không?',
        a: 'Nếu học sinh gặp khó khăn hoặc theo chưa kịp chương trình, EPath sẽ luôn có giải pháp hỗ trợ nhằm giúp con củng cố kiến thức và theo kịp lộ trình học tập.\n\nVới mô hình học tập theo học kỳ gồm 3 học kỳ chính khóa và 1 học kỳ Hè, học sinh sẽ tham gia các bài đánh giá định kỳ 2 lần mỗi học kỳ. Nếu kết quả dưới mức yêu cầu (<65%), Nhà trường sẽ sắp xếp các buổi hỗ trợ học thuật tập trung vào những nội dung học sinh còn yếu hoặc chưa nắm vững.'
      },
      {
        q: 'Phụ huynh theo dõi tiến độ học tập thế nào?',
        a: 'Hàng tuần, giáo viên EPath sẽ giao bài tập trên nền tảng học tập online. Kết quả học tập và quá trình tiến bộ của học sinh sẽ được hệ thống tự động ghi nhận và cập nhật.\n\nTrong trường hợp phụ huynh gặp khó khăn khi theo dõi kết quả học tập của con, giáo viên phụ trách lớp sẽ hỗ trợ hướng dẫn cách theo dõi và đọc report trên hệ thống.\n\nNgoài ra, mỗi tháng EPath sẽ gửi report tổng hợp kết quả bài tập và các bài kiểm tra online của học sinh đến phụ huynh.'
      },
      {
        q: 'Chương trình có cam kết đầu ra?',
        a: 'EPath Education không vận hành theo mô hình cam kết đầu ra ngắn hạn theo từng khóa học, mà xây dựng lộ trình học tập dài hạn với hệ thống đánh giá định kỳ tương tự các trường quốc tế.\n\nĐối với môn Tiếng Anh, học sinh được phát triển theo khung năng lực Cambridge Assessment English phù hợp với từng độ tuổi. EPath đặt mục tiêu giúp học sinh từng bước sở hữu các chứng chỉ Cambridge English sớm hơn độ tuổi thông thường.\n\nTùy theo năng lực, học sinh có thể được tư vấn tham gia các kỳ thi quốc tế như: Cambridge English, IELTS, SAT/ACT, Olympiad quốc tế.'
      },
      {
        q: 'Học sinh nhận bằng cấp gì khi học tại EPath?',
        a: 'Sau khi hoàn thành mỗi cấp độ, học sinh sẽ nhận giấy chứng nhận hoàn thành cấp độ theo mẫu của Edmentum International.\n\nNgoài giấy chứng nhận hoàn thành khóa học, học sinh sẽ nhận các báo cáo đánh giá định kỳ. Trong suốt lộ trình học, Nhà Trường sẽ theo dõi năng lực và sự tiến bộ của học sinh để định hướng phụ huynh đăng ký các bài đánh giá năng lực hoặc chứng chỉ quốc tế phù hợp ở từng giai đoạn.'
      },
      {
        q: 'SAT là gì?',
        a: 'SAT là bài thi đánh giá năng lực học thuật được nhiều trường đại học tại Hoa Kỳ và trên thế giới sử dụng trong quá trình xét tuyển.\n\nBài thi tập trung vào:\n- Đọc hiểu học thuật\n- Ngữ pháp và kỹ năng viết\n- Toán học\n- Tư duy phân tích và giải quyết vấn đề\n\nCó thể hiểu đơn giản, SAT giống như một "bài kiểm tra đầu vào đại học" giúp các trường đánh giá khả năng học tập của học sinh.'
      },
      {
        q: 'ACT là gì?',
        a: 'ACT cũng là một bài thi xét tuyển đại học tương tự SAT.\n\nACT đánh giá:\n- Tiếng Anh\n- Toán học\n- Đọc hiểu\n- Khoa học\n\nNhiều trường đại học chấp nhận cả SAT và ACT. Học sinh thường lựa chọn bài thi phù hợp với điểm mạnh của mình.'
      },
      {
        q: 'SAT và ACT khác nhau như thế nào?',
        a: 'Mục đích của hai bài thi gần như giống nhau: hỗ trợ xét tuyển đại học.\n\nĐiểm khác biệt chính:\n- SAT chú trọng nhiều hơn vào tư duy phân tích và giải quyết vấn đề.\n- ACT có thêm phần Khoa học và tốc độ làm bài thường nhanh hơn.\n\nHiện nay phần lớn trường đại học quốc tế đều chấp nhận cả hai chứng chỉ.'
      },
      {
        q: 'AP là gì?',
        a: 'AP (Advanced Placement) là chương trình các môn học nâng cao theo chuẩn đại học dành cho học sinh Trung học phổ thông.\n\nVí dụ: AP Calculus, AP Physics, AP Chemistry, AP Biology, AP Economics.\n\nAP không phải là bài thi đầu vào đại học mà là minh chứng cho thấy học sinh đã học những môn học ở trình độ cao hơn chương trình phổ thông thông thường.\n\nĐiều này giúp:\n- Hồ sơ nổi bật hơn khi nộp đại học\n- Tăng cơ hội nhận học bổng\n- Có thể được quy đổi tín chỉ ở một số trường đại học quốc tế'
      },
      {
        q: 'Học IELTS có thay thế được SAT/ACT không?',
        a: 'Không. IELTS và SAT/ACT đánh giá hai năng lực hoàn toàn khác nhau.\n\n- IELTS đánh giá khả năng sử dụng tiếng Anh (Nghe/Nói/Đọc/Viết).\n- SAT/ACT đánh giá khả năng học tập các môn chuyên ngành bằng tiếng Anh.\n\nMột học sinh IELTS 8.0 vẫn có thể gặp khó khăn với SAT/ACT nếu chưa được rèn luyện tư duy Toán học, đọc hiểu học thuật và kỹ năng phân tích.'
      },
      {
        q: 'EPath chuẩn bị cho SAT, ACT và AP như thế nào?',
        a: 'Tại EPath, cô tập trung xây dựng nền tảng học thuật từ sớm thông qua các môn:\n- English Language Arts (ELA)\n- Mathematics\n- Science\n\nĐây chính là những năng lực cốt lõi mà học sinh cần có trước khi bước vào các chương trình SAT, ACT, AP, Song bằng, Tú tài Quốc tế hoặc các lộ trình đại học quốc tế.\n\nThay vì chỉ luyện thi ở giai đoạn cuối, EPath hướng đến việc giúp học sinh xây dựng nền tảng học thuật bền vững để sẵn sàng cho nhiều lựa chọn giáo dục quốc tế khác nhau.'
      },
      {
        q: 'Nếu đã có SAT hoặc ACT thì có cần IELTS không?',
        a: 'Trong nhiều trường hợp vẫn cần.\n\nSAT và ACT không thay thế cho chứng chỉ năng lực tiếng Anh quốc tế.'
      },
      {
        q: 'Hồ sơ đại học quốc tế gồm những gì?',
        a: 'Thông thường bao gồm:\n- Học bạ\n- Bằng tốt nghiệp\n- IELTS/TOEFL\n- SAT/ACT (nếu yêu cầu)\n- Bài luận cá nhân\n- Thư giới thiệu\n- Hồ sơ hoạt động ngoại khóa'
      },
      {
        q: 'Từ lớp mấy nên bắt đầu chuẩn bị hồ sơ đại học?',
        a: 'Lý tưởng nhất là từ THCS để học sinh có đủ thời gian xây dựng nền tảng học thuật, tiếng Anh và hồ sơ cá nhân một cách bền vững.'
      }
    ]
  },
  {
    id: 'co-so',
    label: 'Cơ sở vật chất',
    icon: Building2,
    questions: [
      {
        q: 'Học ở đâu?',
        a: 'EPath Education hiện triển khai chương trình học tại các cơ sở:\n\n1. EPath Campus (Tiểu học – THCS):\n   Số 38 Trần Phú, phường Thủ Dầu Một, TP.HCM\n\n2. Trường Little People Lào Cai (Mầm non):\n   178 Lào Cai, phường Thủ Dầu Một, TP.HCM\n\n3. Trường Little People Lái Thiêu (Mầm non):\n   44B Nguyễn Văn Tiết, phường Lái Thiêu, TP.HCM\n\nTùy theo độ tuổi và chương trình đăng ký, học sinh sẽ được tư vấn và sắp xếp học tại cơ sở phù hợp nhằm đảm bảo môi trường học tập hiệu quả và thuận tiện nhất cho gia đình.'
      },
      {
        q: 'Tại sao cần tham gia các hoạt động ngoại khoá?',
        a: 'Các hoạt động ngoại khóa đóng vai trò rất quan trọng trong quá trình phát triển toàn diện của học sinh.\n\nĐối với lứa tuổi Mầm non và Tiểu học, ngoại khóa giúp học sinh phát triển kỹ năng xã hội, khả năng giao tiếp, tư duy quan sát, làm việc nhóm và tăng cường trải nghiệm thực tế.\n\nĐối với độ tuổi Trung học, các hoạt động ngoại khóa còn góp phần xây dựng hồ sơ học tập (Student Profile), hỗ trợ định hướng tuyển sinh vào các trường chất lượng cao hoặc săn học bổng.\n\nCác buổi ngoại khóa thường được tổ chức trong bán kính khoảng 1 giờ di chuyển từ cơ sở học và diễn ra định kỳ mỗi 6 tuần xuyên suốt năm học.'
      }
    ]
  },
  {
    id: 'hoc-phi',
    label: 'Học phí & Tài chính',
    icon: DollarSign,
    questions: [
      {
        q: 'Học phí như thế nào?',
        a: 'EPath Education công bố Biểu phí cho các Khối lớp từ Mầm non đến Trung học (Chương trình Tiểu học tiêu chuẩn & Chương trình Tiểu học Quốc tế) mỗi năm.\n\nĐể nhận thông tin chi tiết về học phí, quý phụ huynh vui lòng liên hệ trực tiếp bộ phận tư vấn của EPath để được hỗ trợ phù hợp với lộ trình của con.'
      },
      {
        q: 'Nhà trường có ưu đãi học phí gì không?',
        a: 'EPath Education hiện có các chính sách ưu đãi học phí theo từng thời điểm tuyển sinh, chương trình học và lộ trình đăng ký của học sinh.\n\nMột số chính sách ưu đãi có thể bao gồm:\n- Ưu đãi thanh toán theo học kỳ/năm học\n- Chính sách anh/chị/em\n- Ưu đãi dành cho học sinh Little People\n- Các chương trình tuyển sinh hoặc học bổng theo từng giai đoạn\n\nĐể đảm bảo thông tin chính xác và được cập nhật mới nhất, ba mẹ vui lòng liên hệ bộ phận tư vấn của EPath.'
      },
      {
        q: 'Thời hạn đóng phí thế nào?',
        a: 'Phụ huynh có thể lựa chọn đóng học phí theo: Tháng / Học kỳ / năm học với từng ưu đãi khác nhau theo từng thời điểm.\n\nĐể đảm bảo việc sắp xếp lớp học và kế hoạch học tập cho học sinh, thời hạn thanh toán học phí là trước ngày 27 của kỳ học liền trước đó theo thông báo từ Nhà trường.'
      },
      {
        q: 'Quy định hoàn phí của nhà trường?',
        a: 'Hiện tại, EPath Education chưa áp dụng chính sách hoàn học phí sau khi học sinh đã hoàn tất đăng ký và giữ chỗ lớp học.\n\nĐối với các trường hợp đặc biệt liên quan đến bảo lưu hoặc thay đổi lộ trình học tập, Nhà trường sẽ xem xét và hỗ trợ giải quyết theo từng trường hợp cụ thể nhằm đảm bảo phù hợp với tình hình thực tế của học sinh và gia đình.'
      },
      {
        q: 'Tỷ lệ tăng học phí hằng năm như thế nào?',
        a: 'Không cố định, tăng khi các chi phí đầu vào tăng (lương GV, Nhân viên) hoặc có biến động lớn về tỷ giá tiêu dùng.\n\nCác khoản phí của đối tác thứ ba sẽ tăng khi đối tác tăng phí (Edmentum & các NXB Giáo trình).\n\nMức tăng có thể cam kết không quá 10%/năm (nếu có).'
      }
    ]
  }
]

// Quick questions for initial display
const quickQuestions = [
  { icon: GraduationCap, question: 'EPath là gì?', answer: qaDatabase[0].questions[0].a, category: 'gioi-thieu' },
  { icon: DollarSign, question: 'Học phí', answer: qaDatabase[4].questions[0].a, category: 'hoc-phi' },
  { icon: Clock, question: 'Lịch học', answer: qaDatabase[1].questions[6].a, category: 'do-tuoi' },
  { icon: Award, question: 'Bằng cấp quốc tế', answer: qaDatabase[0].questions[6].a, category: 'gioi-thieu' },
  { icon: FileText, question: 'Đăng ký nhập học', answer: 'Để đăng ký nhập học tại EPath, quý phụ huynh có thể liên hệ trực tiếp bộ phận tư vấn. Cô sẽ hỗ trợ các bước đăng ký và sắp xếp lịch kiểm tra đầu vào cho con.', category: 'contact' },
]

type ChatStep = 'main' | 'topics' | 'topic_questions' | 'contact'

interface PreChatLead {
  name: string
  phone: string
  // Whether this lead has already been POSTed to /api/chatbot/lead
  // (which fans out to Google Sheets + Zalo). Used so the later
  // "Đăng ký tư vấn" submit doesn't double-notify the sales team.
  notified?: boolean
}

function isValidVietnamPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s+\-().]/g, '')
  // Accept 10-11 digit Vietnamese numbers (0xxx or +84xxx → 9xxx), or 8-15
  // digit international format as a safety net.
  return /^(\d{9,11})$/.test(cleaned) || /^\d{8,15}$/.test(cleaned)
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [preChatLead, setPreChatLead] = useState<PreChatLead | null>(null)
  const [preChatForm, setPreChatForm] = useState<PreChatLead>({ name: '', phone: '' })
  const [preChatError, setPreChatError] = useState<string | null>(null)
  const [preChatSubmitting, setPreChatSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào anh/chị! 👋 Em là Cô Hương — Cố vấn Học tập tại EPath Education.\n\nEm có thể hỗ trợ anh/chị tìm hiểu về:\n• Giới thiệu EPath & các lộ trình học tập\n• Độ tuổi & chương trình phù hợp cho con\n• Lịch học, học phí & chính sách\n• Đánh giá năng lực đầu vào & đăng ký tư vấn\n\nAnh/chị muốn em hỗ trợ về vấn đề nào trước ạ? Cứ hỏi cô bất cứ điều gì nhé! 😊',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatStep, setChatStep] = useState<ChatStep>('main')
  const [selectedTopic, setSelectedTopic] = useState<TopicQA | null>(null)
  // Track every topic the user asked about so the sales team can see
  // the breadth of interest (not just the last clicked topic).
  const [topicsInterested, setTopicsInterested] = useState<string[]>([])
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    childAge: '',
    program: '',
    campus: '',
    note: '',
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Mobile experience: track whether the on-screen keyboard is open,
  // and use visualViewport height so the chat panel never gets clipped
  // by the iOS keyboard (a common cause of "can't see the input" bugs).
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  // Track user message count so we can gently prompt for contact info after
  // they've asked 3+ questions and haven't left their info yet.
  const [ctaReminderSent, setCtaReminderSent] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Prevent scroll-to-bottom during topic-question animations so user
  // doesn't get yanked upward when new items appear at the bottom.
  const scrollLockRef = useRef(false)

  const isUserAtBottom = () => {
    const container = messagesContainerRef.current
    if (!container) return true
    const threshold = 100 // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  const scrollToBottom = () => {
    if (scrollLockRef.current) return
    if (!isUserAtBottom()) return // Don't scroll if user is reading older content
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping, isOpen])

  // Track on-screen keyboard via the visualViewport API so the chat panel
  // shrinks to fit, and the input stays visible above the keyboard.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vv = window.visualViewport
    const handleResize = () => {
      // The keyboard is "open" when the visual viewport shrinks by a noticeable amount.
      // Using a small threshold avoids false positives on desktop URL bar changes.
      const heightDiff = window.innerHeight - vv.height
      setKeyboardOpen(heightDiff > 150)
    }
    vv.addEventListener('resize', handleResize)
    handleResize()
    return () => vv.removeEventListener('resize', handleResize)
  }, [])

  // -------------------------------------------------------------
  // Persist chat session in localStorage so reloads / tab reopens
  // don't wipe the conversation or the half-filled contact form.
  // -------------------------------------------------------------
  // Versioned so a future schema change can ignore old payloads.
  const STORAGE_KEY = 'epath:chatbot:session:v1'
  // Sessions older than this are considered stale (30 days).
  const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
  // Hydration flag: only mutate state from localStorage once, on mount,
  // otherwise we overwrite storage with the initial (empty) state on
  // every re-render.
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hydratedRef.current) return
    hydratedRef.current = true
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        savedAt?: number
        preChatLead?: PreChatLead | null
        messages?: Message[]
        chatStep?: ChatStep
        selectedTopic?: TopicQA | null
        topicsInterested?: string[]
        contactForm?: typeof contactForm
        ctaReminderSent?: boolean
      }
      if (!parsed || typeof parsed !== 'object') return
      // Drop stale sessions so we don't load a conversation that
      // doesn't reflect the user's current intent.
      if (!parsed.savedAt || Date.now() - parsed.savedAt > SESSION_TTL_MS) {
        window.localStorage.removeItem(STORAGE_KEY)
        return
      }
      if (parsed.preChatLead) setPreChatLead(parsed.preChatLead)
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        // Rehydrate Date objects (JSON.stringify turns them into strings).
        setMessages(
          parsed.messages.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        )
      }
      if (parsed.chatStep) setChatStep(parsed.chatStep)
      if (parsed.selectedTopic !== undefined) setSelectedTopic(parsed.selectedTopic)
      if (Array.isArray(parsed.topicsInterested))
        setTopicsInterested(parsed.topicsInterested)
      if (parsed.contactForm) setContactForm(parsed.contactForm)
      if (typeof parsed.ctaReminderSent === 'boolean')
        setCtaReminderSent(parsed.ctaReminderSent)
    } catch (err) {
      // Corrupted JSON or storage disabled — fail silently and start fresh.
      console.warn('[chatbot] failed to restore session:', err)
    }
    // Intentionally empty deps: this runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!hydratedRef.current) return
    // Skip persisting until the chat has actually been used — otherwise
    // we clutter storage with the default state from every visitor.
    const hasContent =
      messages.length > 1 ||
      !!preChatLead ||
      topicsInterested.length > 0 ||
      !!contactForm.name ||
      !!contactForm.phone ||
      !!contactForm.email ||
      !!contactForm.note
    if (!hasContent) return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          preChatLead,
          messages,
          chatStep,
          selectedTopic,
          topicsInterested,
          contactForm,
          ctaReminderSent,
        })
      )
    } catch {
      // Storage full / disabled — don't crash the chat.
    }
  }, [
    messages,
    preChatLead,
    chatStep,
    selectedTopic,
    topicsInterested,
    contactForm,
    ctaReminderSent,
    STORAGE_KEY,
  ])

  // Listener so other tabs / a manual clear in DevTools stay in sync.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      if (!e.newValue) {
        // Storage was cleared externally — reset to a fresh chat.
        handleResetSession()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // handleResetSession is declared later as a const; referencing it
    // here works because both run on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY])

  // Reset session to initial state when user clicks "Làm mới".
  const handleResetSession = () => {
    setChatStep('main')
    setPreChatLead(null)
    setPreChatForm({ name: '', phone: '' })
    setSelectedTopic(null)
    setTopicsInterested([])
    setCtaReminderSent(false)
    setInputValue('')
    setIsTyping(false)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Xin chào anh/chị! 👋 Em là Cô Hương — Cố vấn Học tập tại EPath Education.\n\nEm có thể hỗ trợ anh/chị tìm hiểu về:\n• Giới thiệu EPath & các lộ trình học tập\n• Độ tuổi & chương trình phù hợp cho con\n• Lịch học, học phí & chính sách\n• Đánh giá năng lực đầu vào & đăng ký tư vấn\n\nAnh/chị muốn em hỗ trợ về vấn đề nào trước ạ? Cứ hỏi cô bất cứ điều gì nhé! 😊',
        timestamp: new Date(),
      },
    ])
    setContactForm({
      name: '',
      phone: '',
      email: '',
      childAge: '',
      program: '',
      campus: '',
      note: '',
    })
    // Drop persisted state too, so the next reload starts fresh.
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
    }
  }

  useEffect(() => {
    // Only reset on the false → true transition so we don't wipe state
    // while the chat is still mounted but momentarily hidden.
    if (!isOpen) return
    // If we restored a session from localStorage, keep it — the user
    // expects their conversation to still be there.
    if (hydratedRef.current && messages.length > 1) return
    handleResetSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const addMessage = (role: 'user' | 'assistant', content: string, showRating = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      showRating,
    }
    setMessages((prev) => {
      const next = [...prev, newMessage]
      // After 3+ user messages (not counting the greeting), if the user
      // hasn't given their phone, nudge them once.
      if (
        role === 'user' &&
        !preChatLead?.phone &&
        !ctaReminderSent &&
        next.filter((m) => m.role === 'user').length >= 3
      ) {
        setCtaReminderSent(true)
        // Use setTimeout so this is added after the current batch renders.
        setTimeout(() => {
          addMessage(
            'assistant',
            'Nếu anh/chị muốn được tư vấn chi tiết hơn về lộ trình cho con, có thể để lại SĐT — cô tư vấn viên sẽ gọi lại trong 24h ạ.',
            false
          )
        }, 100)
      }
      return next
    })
  }

  const updateMessageRating = (messageId: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, rating, showRating: false } : msg
      )
    )
  }

  const findBestAnswer = (question: string): string | null => {
    const lowerQuestion = question.toLowerCase()

    // Search in all topics
    for (const topic of qaDatabase) {
      for (const item of topic.questions) {
        const lowerQ = item.q.toLowerCase()
        if (lowerQuestion.includes(lowerQ) || lowerQ.includes(lowerQuestion)) {
          return item.a
        }
      }
    }

    // Keyword matching
    const keywords: Record<string, string> = {
      'epath là gì': qaDatabase[0].questions[0].a,
      'giới thiệu': qaDatabase[0].questions[0].a,
      'homeschooling': qaDatabase[0].questions[1].a,
      'homeschool': qaDatabase[0].questions[1].a,
      'tự học': qaDatabase[0].questions[2].a,
      'semi': qaDatabase[0].questions[5].a,
      'song bằng': qaDatabase[0].questions[6].a,
      'dual diploma': qaDatabase[0].questions[6].a,
      'thay thế trường quốc tế': qaDatabase[0].questions[7].a,
      'trung tâm anh ngữ': qaDatabase[0].questions[8].a,
      'edmentum': qaDatabase[0].questions[9].a,
      'học phí': qaDatabase[4].questions[0].a,
      'chi phí': qaDatabase[4].questions[0].a,
      'giá': qaDatabase[4].questions[0].a,
      'ưu đãi': qaDatabase[4].questions[1].a,
      'đóng phí': qaDatabase[4].questions[2].a,
      'hoàn phí': qaDatabase[4].questions[3].a,
      'tăng phí': qaDatabase[4].questions[4].a,
      'độ tuổi': qaDatabase[1].questions[0].a,
      'tuyển sinh': qaDatabase[1].questions[0].a,
      'mầm non': qaDatabase[1].questions[0].a,
      'tiểu học': qaDatabase[1].questions[0].a,
      'bắt đầu': qaDatabase[1].questions[1].a,
      'đầu vào': qaDatabase[1].questions[2].a,
      'diagnostic': qaDatabase[1].questions[2].a,
      'lịch học': qaDatabase[1].questions[6].a,
      'khai giảng': qaDatabase[1].questions[5].a,
      'kết quả': qaDatabase[1].questions[7].a,
      'đại học': qaDatabase[1].questions[8].a,
      'quốc tế': qaDatabase[1].questions[9].a,
      'ib': qaDatabase[1].questions[9].a,
      'a-level': qaDatabase[1].questions[9].a,
      'giáo viên': qaDatabase[2].questions[0].a,
      'sĩ số': qaDatabase[2].questions[1].a,
      'lớp học': qaDatabase[2].questions[1].a,
      'tutor': qaDatabase[2].questions[2].a,
      'hỗ trợ': qaDatabase[2].questions[3].a,
      'theo dõi': qaDatabase[2].questions[4].a,
      'cam kết': qaDatabase[2].questions[5].a,
      'bằng cấp': qaDatabase[2].questions[6].a,
      'sat': qaDatabase[2].questions[7].a,
      'act': qaDatabase[2].questions[8].a,
      'ap': qaDatabase[2].questions[10].a,
      'ielts': qaDatabase[2].questions[11].a,
      'hồ sơ': qaDatabase[2].questions[14].a,
      'cơ sở': qaDatabase[3].questions[0].a,
      'địa điểm': qaDatabase[3].questions[0].a,
      'ngoại khóa': qaDatabase[3].questions[1].a,
      'đăng ký': 'Để đăng ký nhập học tại EPath, quý phụ huynh vui lòng liên hệ trực tiếp bộ phận tư vấn. Cô sẽ hỗ trợ các bước đăng ký và sắp xếp lịch kiểm tra đầu vào cho con.',
      'liên hệ': 'Quý phụ huynh có thể liên hệ bộ phận tư vấn của EPath để được hỗ trợ chi tiết.',
    }

    for (const [keyword, answer] of Object.entries(keywords)) {
      if (lowerQuestion.includes(keyword)) {
        return answer
      }
    }

    return null
  }

  const CONTACT_INTENT_REGEX = /(đăng\s*ký|đăng\s*kí|nhập\s*học|ghi\s*danh|tư\s*vấn|liên\s*hệ|để\s*lại\s*(sđt|sđt|số\s*điện\s*thoại|thông\s*tin)|hotline)/i

  const handlePreChatSubmit = async () => {
    const name = preChatForm.name.trim()
    const phone = preChatForm.phone.trim()
    if (!name || !phone) {
      setPreChatError('Dạ anh/chị vui lòng nhập đầy đủ họ tên và số điện thoại ạ.')
      return
    }
    if (!isValidVietnamPhone(phone)) {
      setPreChatError('Số điện thoại chưa đúng định dạng. Anh/chị kiểm tra lại giúp em nhé (VD: 0912 345 678).')
      return
    }

    setPreChatSubmitting(true)
    setPreChatError(null)

    const lead: PreChatLead = { name, phone }
    setPreChatLead(lead)

    // Pre-fill the consultation form so the parent never has to re-type
    // the same name/phone when they later request a callback within
    // the same chat session.
    setContactForm((prev) => ({
      ...prev,
      name: prev.name || name,
      phone: prev.phone || phone,
    }))

    // Fire the lead to the backend immediately so the sales Zalo bot
    // gets pinged the moment the parent enters their info — they no
    // longer have to also fill out the bigger "Đăng ký tư vấn" form.
    // Fire-and-forget: we don't block the chat start on the network.
    void fetch('/api/chatbot/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email: '',
        childAge: '',
        program: '',
        campus: '',
        topicsInterested: [],
        conversationSummary: 'Pre-chat capture (chưa có nội dung tư vấn)',
        conversationCount: 0,
        locale: detectedLocale,
        source: 'chatbot-prechat',
      } satisfies LeadPayload),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.warn('[chatbot] pre-chat lead POST failed:', res.status)
        } else {
          // Mark as notified so the later "Đăng ký tư vấn" submit
          // (handleContactSubmit) doesn't fire a second Zalo message.
          setPreChatLead((prev) => (prev ? { ...prev, notified: true } : prev))
        }
      })
      .catch((err) => {
        console.warn('[chatbot] pre-chat lead POST error:', err)
      })

    // Greet them by first name so the rest of the conversation feels personal.
    const firstName = name.split(/\s+/).slice(-1)[0] || name
    addMessage(
      'assistant',
      `Cảm ơn anh/chị ${firstName} đã để lại thông tin ạ! 🌷\n\nEm là Cô Hương — Cố vấn Học tập tại EPath Education. Em sẵn sàng hỗ trợ anh/chị tìm hiểu về chương trình Tiểu học – THPT, lộ trình học tập, học phí, hoặc đăng ký tư vấn 1-1 với cô tư vấn viên.\n\nAnh/chị muốn em chia sẻ về vấn đề nào trước ạ?`,
    )

    setChatStep('main')
    setPreChatForm({ name: '', phone: '' })
    setPreChatSubmitting(false)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const userText = inputValue.trim()

    // Short-circuit: when the user clearly wants to register, open the
    // form immediately instead of waiting for the LLM round-trip. We still
    // show the user's message and a short assistant acknowledgement so the
    // flow stays natural.
    if (CONTACT_INTENT_REGEX.test(userText)) {
      addMessage('user', userText)
      setInputValue('')
      setIsTyping(false)
      setChatStep('contact')
      addMessage(
        'assistant',
        preChatLead
          ? `Dạ vâng ạ! Cô đã ghi nhận thông tin của anh/chị ${preChatLead.name} rồi. Anh/chị chỉ cần bổ sung thêm vài thông tin bên dưới để cô tư vấn viên gọi lại tư vấn chi tiết nhé ạ.`
          : 'Dạ, để EPath liên hệ tư vấn chi tiết cho anh/chị, em mời điền nhanh thông tin bên dưới nhé. Chỉ cần Họ tên, Số điện thoại và một vài thông tin cơ bản ạ.'
      )
      return
    }

    addMessage('user', userText)
    setInputValue('')
    setIsTyping(true)

    try {
      // Send the last few messages so the model has conversational context.
      // Skip the very first greeting to keep tokens low.
      const recentMessages = messages
        .filter((m) => m.id !== '1')
        .slice(-6)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: recentMessages,
          name: preChatLead?.name,
          phone: preChatLead?.phone,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success || typeof data.answer !== 'string') {
        throw new Error(data?.error || 'API error')
      }

      addMessage('assistant', data.answer, true)
    } catch (err) {
      console.error('Chatbot API failed:', err)
      // Graceful fallback if the API is unreachable.
      addMessage(
        'assistant',
        'Dạ em xin lỗi, hệ thống đang gặp chút trục trặc kỹ thuật. Anh/chị vui lòng thử lại sau hoặc để lại SĐT qua "Đăng ký tư vấn" để đội ngũ EPath liên hệ hỗ trợ trực tiếp ạ.',
        true
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (question: typeof quickQuestions[0]) => {
    // Lock scroll so the user isn't yanked upward when topic questions animate in.
    scrollLockRef.current = true
    addMessage('user', question.question)
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      addMessage('assistant', question.answer, true)
      // Unlock after messages have been added. The existing scrollToBottom
      // effect won't fire because of the lock; the next real scroll will
      // be driven by user interaction or the normal effect cycle.
      scrollLockRef.current = false
    }, 800)
  }

  const handleTopicClick = (topic: TopicQA) => {
    // Record interested topic without duplicates so the lead captures
    // the full breadth of questions the user asked about.
    setTopicsInterested((prev) =>
      prev.includes(topic.label) ? prev : [...prev, topic.label]
    )

    // Send intro message FIRST, then show topic questions buttons.
    // This way user reads the intro before seeing the question buttons.
    addMessage(
      'assistant',
      `📚 **${topic.label}**\n\nEm gợi ý một số câu hỏi phổ biến về ${topic.label.toLowerCase()}. Anh/chị chọn câu hỏi hoặc hỏi cô trực tiếp nhé!`
    )

    // Store selected topic and show buttons AFTER the message is added
    setTimeout(() => {
      setSelectedTopic(topic)
      setChatStep('topic_questions')
    }, 100)
  }

  const handleTopicQuestionClick = (question: { q: string; a: string }) => {
    scrollLockRef.current = true
    addMessage('user', question.q)

    setTimeout(() => {
      addMessage('assistant', question.a, true)
      scrollLockRef.current = false
    }, 600)
  }

  // Derive a stable locale string so the team can filter by VN/EN leads.
  const detectedLocale = useMemo(() => {
    if (typeof document === 'undefined') return 'vi'
    const seg = document.documentElement.lang || window.location.pathname.split('/').filter(Boolean)[0]
    return seg === 'en' ? 'en' : 'vi'
  }, [])

  const handleContactSubmit = async () => {
    const name = contactForm.name.trim()
    const phone = contactForm.phone.trim()
    if (!phone) return

    setIsSubmitting(true)
    setSubmitError(null)

    const { summary, userQuestionCount } = summarizeConversation(
      messages.map((m) => ({ role: m.role, content: m.content }))
    )

    // Build final topic list: combine user-clicked topics (high signal)
    // with keyword-extracted topics (covers free-form typing).
    const keywordTopics = extractTopics(
      messages.map((m) => ({ role: m.role, content: m.content }))
    )
    const combinedTopics = Array.from(
      new Set([...topicsInterested, ...keywordTopics])
    )

    // Merge the optional "note" into summary so it lands in the same
    // column instead of forcing a 14th sheet column.
    const note = contactForm.note.trim()
    const finalSummary = note ? `${summary}${summary ? '\n' : ''}Ghi chú: ${note}` : summary

    const payload: LeadPayload = {
      name,
      phone,
      email: contactForm.email,
      childAge: contactForm.childAge,
      program: contactForm.program,
      campus: contactForm.campus,
      topicsInterested: combinedTopics,
      conversationSummary: finalSummary,
      conversationCount: userQuestionCount,
      locale: detectedLocale,
      source: 'chatbot',
    }

    try {
      const response = await fetch('/api/chatbot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        const message =
          (typeof data?.error === 'string' && data.error) ||
          'Không thể gửi thông tin lúc này. Quý phụ huynh vui lòng thử lại sau.'
        setSubmitError(message)
        setIsSubmitting(false)
        return
      }

      addMessage(
        'assistant',
        `Cảm ơn ${name || 'quý phụ huynh'}!\n\nThông tin của anh/chị đã được cô ghi nhận. Cô tư vấn viên EPath sẽ liên hệ qua số ${phone} trong vòng 24 giờ để hỗ trợ chi tiết ạ.\n\nTrong thời gian chờ, anh/chị có thể tiếp tục hỏi cô bất kỳ điều gì về chương trình nhé.`,
        true
      )
      setContactForm({
        name: '',
        phone: '',
        email: '',
        childAge: '',
        program: '',
        campus: '',
        note: '',
      })
      setTopicsInterested([])
      setChatStep('main')
      setIsSubmitting(false)
    } catch (err) {
      console.error('Lead submit failed:', err)
      setSubmitError('Mất kết nối. Vui lòng thử lại sau.')
      setIsSubmitting(false)
    }
  }

  const handleBackToMain = () => {
    // From topics / topic_questions / contact, the back arrow must always
    // return to the pre-chat form so the user is forced to enter their
    // name + phone before they can chat. Going straight to 'main' would
    // let them bypass the lead capture.
    setChatStep('main')
    setSelectedTopic(null)
  }

  return (
    <>
      {/* Chat Button – respects iOS safe-area so the bubble isn't hidden
          behind the home indicator on notched devices.
          z-[70] keeps it above the header (z-60) so the floating
          launch button is always reachable. */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-6 z-[70] w-14 h-14 sm:w-14 sm:h-14 bg-gradient-to-br from-[#3A53A3] to-[#2E4389] rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {!isOpen && messages.length === 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-[#F05A28] rounded-full border-2 border-white"
          />
        )}
      </motion.button>

      {/* Chat Window
          - Mobile (default): full-screen sheet pinned to bottom, height uses
            `dvh` so the iOS URL bar / keyboard don't clip the input.
          - Desktop (sm+): floating 380 x 550px panel anchored bottom-right.
          - When the keyboard is detected we anchor the panel to the viewport
            top + safe area so nothing is hidden. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'fixed z-[70] bg-white shadow-2xl flex flex-col overflow-hidden border border-[#3A53A3]/20',
              // Mobile fullscreen sheet
              'inset-x-0 bottom-0 sm:inset-auto',
              'sm:rounded-2xl',
              // Mobile: full height with dvh (dynamic viewport height for iOS)
              'h-[100dvh] sm:h-[580px] sm:w-[380px]',
              'sm:bottom-20 sm:right-6'
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3A53A3] to-[#2E4389] p-3 sm:p-4 flex items-center gap-3 shrink-0">
              {chatStep !== 'main' && (
                <button
                  onClick={handleBackToMain}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Back to main"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
              )}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src="/epath-logo-small.svg" 
                  alt="EPath" 
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white hidden" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                  {'Cô Hương — Cố vấn Học tập'}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm truncate">
                  {chatStep === 'contact'
                    ? 'Đăng ký tư vấn 1-1'
                    : preChatLead
                    ? `Xin chào ${preChatLead.name} 👋`
                    : 'EPath Education'}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/80 text-xs">Online</span>
              </div>
              {/* "Làm mới" button */}
              <button
                onClick={handleResetSession}
                className="hidden sm:flex text-white/80 hover:text-white p-1 shrink-0 items-center gap-1 text-xs"
                aria-label="Làm mới hội thoại"
                title="Làm mới hội thoại"
              >
                <Sparkles className="w-4 h-4" />
                <span>Làm mới</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden text-white/90 hover:text-white p-1 -mr-1 shrink-0"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === 'user' ? 'bg-[#F05A28]' : 'bg-[#3A53A3]'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 max-w-full ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-[#F05A28] to-[#E04D1A] text-white rounded-br-sm shadow-lg shadow-[#F05A28]/20'
                        : 'bg-white text-[#231F20] rounded-bl-sm shadow-md'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                      
                      {/* Rating */}
                      {message.showRating && message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#3A53A3]/10">
                          <span className="text-xs text-[#666]">Câu trả lời này có hữu ích không?</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateMessageRating(message.id, 'up')}
                              className={`p-1.5 rounded-full transition-colors ${
                                message.rating === 'up' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'hover:bg-gray-100 text-gray-400'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateMessageRating(message.id, 'down')}
                              className={`p-1.5 rounded-full transition-colors ${
                                message.rating === 'down' 
                                  ? 'bg-red-100 text-red-600' 
                                  : 'hover:bg-gray-100 text-gray-400'
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#3A53A3] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[#3A53A3]/50 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Topic Questions */}
              {chatStep === 'topic_questions' && selectedTopic && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-[#3A53A3]/20 max-h-52 overflow-y-auto"
                >
                  <p className="text-xs text-[#666] mb-2 font-medium">Câu hỏi phổ biến:</p>
                  <div className="space-y-1">
                    {selectedTopic.questions.slice(0, 5).map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleTopicQuestionClick(q)}
                        className="w-full text-left bg-white px-3 py-2 rounded-lg text-xs text-[#231F20] border border-[#3A53A3]/15 hover:border-[#3A53A3]/40 hover:bg-[#3A53A3]/5 transition-colors duration-150 flex items-start gap-2"
                      >
                        <ChevronRight className="w-3 h-3 text-[#8BC53F] mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{q.q}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Questions Cards */}
              {chatStep === 'main' && preChatLead && messages.length <= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-2"
                >
                  <p className="text-xs text-[#666] font-medium px-1">
                    💡 Gợi ý câu hỏi phổ biến:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickQuestion(q)}
                        className="bg-white border border-[#3A53A3]/15 rounded-xl px-3 py-3 text-left hover:border-[#3A53A3]/30 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3A53A3]/10 to-[#2E4389]/10 flex items-center justify-center group-hover:from-[#3A53A3]/20 group-hover:to-[#2E4389]/20 transition-all">
                            <q.icon className="w-3.5 h-3.5 text-[#3A53A3]" />
                          </div>
                        </div>
                        <p className="text-xs font-medium text-[#231F20] leading-tight">{q.question}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Form */}
              {chatStep === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-white rounded-xl p-4 border border-[#3A53A3]/20 space-y-3"
                >
                  <div className="flex items-center gap-2 text-[#3A53A3]">
                    <ShieldCheck className="w-4 h-4" />
                    <p className="text-sm font-medium">Đăng ký tư vấn</p>
                  </div>
                  <p className="text-sm text-[#6B6B6B] text-center">
                    Để lại thông tin, cô tư vấn viên sẽ gọi lại trong 24 giờ ạ.
                  </p>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A53A3]/60 pointer-events-none" />
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="Họ và tên phụ huynh *"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:outline-none text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A53A3]/60 pointer-events-none" />
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Số điện thoại *"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:outline-none text-sm"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email (không bắt buộc)"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:outline-none text-sm"
                  />
                  <div className="relative">
                    <Baby className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A53A3]/60 pointer-events-none" />
                    <select
                      value={contactForm.childAge}
                      onChange={(e) => setContactForm({ ...contactForm, childAge: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:outline-none text-sm appearance-none"
                    >
                      <option value="">Độ tuổi của con</option>
                      <option value="3-5 tuổi (Mầm non)">3-5 tuổi (Mầm non)</option>
                      <option value="6-10 tuổi (Tiểu học)">6-10 tuổi (Tiểu học)</option>
                      <option value="11-14 tuổi (THCS)">11-14 tuổi (THCS)</option>
                      <option value="15-17 tuổi (THPT)">15-17 tuổi (THPT)</option>
                      <option value="Trên 18 tuổi">Trên 18 tuổi</option>
                    </select>
                  </div>
                  <select
                    value={contactForm.program}
                    onChange={(e) => setContactForm({ ...contactForm, program: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:outline-none text-sm appearance-none"
                  >
                    <option value="">Chương trình quan tâm</option>
                    <option value="Chương trình tiêu chuẩn (Semi-Homeschool)">
                      Tiêu chuẩn (Semi-Homeschool)
                    </option>
                    <option value="Chương trình Quốc tế (Homeschool)">
                      Quốc tế (Homeschool)
                    </option>
                    <option value="Song bằng / Dual Diploma">Song bằng / Dual Diploma</option>
                    <option value="Chương trình Tiếng Anh">Chương trình Tiếng Anh</option>
                    <option value="Luyện thi chứng chỉ (SAT/ACT/IELTS)">
                      Luyện thi chứng chỉ (SAT/ACT/IELTS)
                    </option>
                    <option value="Chưa xác định">Chưa xác định</option>
                  </select>
                  <select
                    value={contactForm.campus}
                    onChange={(e) => setContactForm({ ...contactForm, campus: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:outline-none text-sm appearance-none"
                  >
                    <option value="">Cơ sở quan tâm</option>
                    <option value="EPath Campus (Trần Phú, Thủ Dầu Một)">
                      EPath Campus (Trần Phú)
                    </option>
                    <option value="Little People Lào Cai">Little People Lào Cai</option>
                    <option value="Little People Lái Thiêu">Little People Lái Thiêu</option>
                    <option value="Học Online">Học Online</option>
                    <option value="Chưa xác định">Chưa xác định</option>
                  </select>
                  <textarea
                    placeholder="Ghi chú thêm (không bắt buộc)"
                    value={contactForm.note}
                    onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:outline-none text-sm resize-none"
                  />

                  {/* Show collected topics so the user sees what will be shared */}
                  {topicsInterested.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[11px] text-[#6B6B6B] mb-1.5">
                        Chủ đề bạn đã quan tâm:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {topicsInterested.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-1 rounded-full bg-[#3A53A3]/10 text-[#3A53A3]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <p className="text-xs text-red-600 text-center">{submitError}</p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactSubmit}
                    disabled={!(preChatLead?.phone || contactForm.phone).trim() || isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#3A53A3] to-[#2E4389] text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        Gửi thông tin tư vấn
                      </>
                    )}
                  </motion.button>
                  <p className="text-[10px] text-[#999] text-center leading-relaxed">
                    Bằng việc gửi thông tin, bạn đồng ý để EPath liên hệ tư vấn qua số điện thoại và email đã cung cấp.
                  </p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Topic/Contact Buttons */}
            {chatStep === 'main' && preChatLead && (
              <div className="px-4 py-3 border-t border-[#3A53A3]/10 bg-gradient-to-t from-white to-[#F8F9FA]">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { 
                      icon: GraduationCap, 
                      label: 'Tìm hiểu EPath',
                      action: () => {
                        setChatStep('topics')
                        addMessage('assistant', 'Dưới đây là các chủ đề EPath có thể hỗ trợ quý phụ huynh:')
                      },
                      color: 'bg-[#3A53A3]/10 text-[#3A53A3] hover:bg-[#3A53A3]/20'
                    },
                    { 
                      icon: FileText, 
                      label: 'Học phí',
                      action: () => handleQuickQuestion(quickQuestions[1]),
                      color: 'bg-[#8BC53F]/10 text-[#8BC53F] hover:bg-[#8BC53F]/20'
                    },
                    { 
                      icon: Clock, 
                      label: 'Lịch học',
                      action: () => handleQuickQuestion(quickQuestions[2]),
                      color: 'bg-[#F05A28]/10 text-[#F05A28] hover:bg-[#F05A28]/20'
                    },
                  ].map((btn, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={btn.action}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all duration-150 ${btn.color}`}
                    >
                      <btn.icon className="w-3.5 h-3.5" />
                      {btn.label}
                    </motion.button>
                  ))}
                </div>
                {/* Primary Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setChatStep('topics')
                      addMessage('assistant', 'Dưới đây là các chủ đề EPath có thể hỗ trợ quý phụ huynh:')
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#3A53A3]/10 px-3 py-2.5 rounded-xl text-xs text-[#3A53A3] whitespace-nowrap hover:bg-[#3A53A3]/20 transition-colors duration-150 font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Xem tất cả chủ đề
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setChatStep('contact')
                      addMessage('assistant', 'Vui lòng điền thông tin để EPath liên hệ tư vấn trực tiếp cho bạn:')
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#F05A28] to-[#E04D1A] px-3 py-2.5 rounded-xl text-xs text-white whitespace-nowrap hover:shadow-lg hover:shadow-[#F05A28]/20 transition-all duration-150 font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Đăng ký tư vấn
                  </motion.button>
                </div>
              </div>
            )}

            {/* Topic Grid */}
            {chatStep === 'topics' && (
              <div className="px-4 py-2 border-t border-[#3A53A3]/10 bg-white max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {qaDatabase.map((topic) => (
                    <motion.button
                      key={topic.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicClick(topic)}
                      className="flex items-center gap-2 bg-[#F8F9FA] px-3 py-2 rounded-lg text-xs text-[#231F20] hover:bg-[#3A53A3]/10 transition-colors duration-150"
                    >
                      <topic.icon className="w-4 h-4 text-[#8BC53F]" />
                      {topic.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input – keeps the bar above the iPhone home indicator. */}
            <div
              className="p-3 sm:p-4 bg-white border-t border-[#3A53A3]/20"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
            >
              {chatStep !== 'contact' && (
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    onFocus={() => {
                      setTimeout(scrollToBottom, 100)
                    }}
                    placeholder="Nhập câu hỏi cho Cô Hương..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#F8F9FA] border border-[#3A53A3]/20 focus:border-[#3A53A3] focus:ring-2 focus:ring-[#3A53A3]/10 focus:outline-none text-sm transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-12 h-12 bg-gradient-to-br from-[#3A53A3] to-[#2E4389] rounded-2xl flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-[#3A53A3]/20 transition-shadow hover:shadow-xl hover:shadow-[#3A53A3]/30"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
              {chatStep === 'contact' ? (
                <p className="text-[10px] text-[#666] text-center mt-1 leading-relaxed">
                  Vui lòng điền thông tin để nhận tư vấn chi tiết từ EPath.
                </p>
              ) : (
                <p className="text-[10px] text-[#666] text-center mt-2 leading-relaxed">
                  Cô Hương có thể không phản hồi chính xác 100%. Vui lòng liên hệ trực tiếp để được tư vấn chi tiết.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating label – desktop-only, hidden on small screens where
          the chat button itself is the primary CTA. */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="hidden md:block fixed bottom-5 right-24 z-[70]"
        >
          <div className="bg-white px-4 py-2.5 rounded-full shadow-xl border border-[#3A53A3]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-sm text-[#231F20] font-medium">Cô Hương đang online</p>
          </div>
        </motion.div>
      )}
    </>
  )
}
