import pandas as pd

df = pd.read_excel(r'D:\Job\Epath\Sitemap Epath.xlsx')

with open(r'D:\Job\Epath\Sitemap_Epath.md', 'w', encoding='utf-8') as f:
    f.write('# EPATH EDUCATION SITEMAP - 2025\n\n')
    
    def clean(val):
        if pd.isna(val):
            return ''
        return str(val).strip()
    
    # Main structure mapping based on the Excel columns
    sitemap = {
        'Trang chủ': {'en': 'Home', 'url': '', 'subs': []},
        'Giới thiệu': {'en': 'Introduction', 'url': 'https://ischool.themerex.net/about-us/', 'subs': [
            {'name': 'Về chúng tôi', 'en': 'About Us'},
            {'name': 'Tầm nhìn', 'en': 'Vision'},
            {'name': 'Sứ mệnh', 'en': 'Mission'},
            {'name': 'Giá trị cốt lõi', 'en': 'Core Values'},
            {'name': 'Lộ trình học tập tại EPath', 'en': 'EPath Learning Pathway'},
            {'name': 'Thành tích vượt trội', 'en': 'Achievements'},
            {'name': 'Khách hàng nói gì về EPath?', 'en': 'What Parents & Students Say About EPath?'},
            {'name': 'Đội ngũ giảng viên', 'en': 'Our Instructors', 'url': 'https://ischool.themerex.net/our-instructors/'},
        ]},
        'Chương trình & Dịch vụ': {'en': 'Products & Services', 'subs': [
            {'name': 'Kindy', 'subs': [
                {'name': 'Độ tuổi mầm non'},
                {'name': 'Base Path: Chương trình Tiếng Anh Bứt phá', 'en': 'SpeedUp English Programme'},
                {'name': 'Khóa học Nền tảng Học thuật Quốc tế', 'en': 'Academic Foundation Programme'},
            ]},
            {'name': 'Elementary', 'subs': [
                {'name': 'Độ tuổi tiểu học'},
                {'name': 'Base Path', 'en': 'Exact Path'},
                {'name': 'Prime Path Courseware'},
                {'name': 'Chương trình Tiểu học Mỹ', 'en': 'US Elementary Official Curriculum'},
            ]},
            {'name': 'Middle School', 'subs': [
                {'name': 'Độ tuổi Trung học Cơ sở'},
                {'name': 'Base Path: Chương trình Tiếng Anh Bứt phá', 'en': 'SpeedUp English Programme'},
                {'name': 'Prime Path: Chương trình Trung học Mỹ', 'en': 'US Middle School Official Curriculum'},
            ]},
            {'name': 'High School', 'subs': [
                {'name': 'Độ tuổi Trung học Phổ thông'},
                {'name': 'Base Path: US Dual High School Diploma', 'en': 'Chương trình Song bằng'},
                {'name': 'Prime Path: US High School Diploma', 'en': 'Chương trình Tú Tài Mỹ'},
            ]},
            {'name': 'Phát triển năng lực Cá nhân', 'en': 'Personal Development', 'subs': [
                {'name': 'Khóa học Kỹ năng, Ngoại khóa, Trải nghiệm', 'en': 'Beyond the Classroom Portfolio'},
            ]},
            {'name': 'Cố vấn lộ trình học tập Quốc tế', 'en': 'International Pathway'},
        ]},
        'Đối tác Quốc tế': {'en': 'International Partners', 'subs': [
            {'name': 'Edmentum International', 'url': 'https://ischool.themerex.net/our-services/', 'subs': [
                {'name': 'Giới thiệu về Edmentum International', 'en': 'About Edmentum International'},
                {'name': 'Vì sao chọn Edmentum International?', 'en': 'Why Choose Edmentum International?'},
            ]},
            {'name': 'Cambridge ESOL'},
            {'name': 'Fablab - EIU'},
            {'name': 'Định hướng giáo dục tại EPath', 'en': 'Educational Approach at EPath'},
        ]},
        'Tuyển sinh': {'en': 'Admissions', 'subs': [
            {'name': 'Chính sách tài chính', 'en': 'Tuition & Financial Policy', 'url': 'https://ischool.themerex.net/pricing/'},
            {'name': 'Câu hỏi thường gặp', 'en': 'Frequently Asked Questions (FAQ)', 'url': 'https://ischool.themerex.net/faqs/'},
            {'name': 'Liên hệ tư vấn', 'en': 'Consultation & Enquiry', 'url': 'https://ischool.themerex.net/contact-us/'},
        ]},
        'Sự kiện': {'en': 'Events', 'subs': [
            {'name': 'Cập nhật mới', 'en': 'Latest News', 'url': 'https://ischool.themerex.net/blog-grid/'},
            {'name': 'Sự kiện nổi bật', 'en': 'Featured Events'},
        ]},
    }
    
    def write_item(item, level=0):
        indent = '  ' * level
        name = item.get('name', '')
        en = item.get('en', '')
        url = item.get('url', '')
        
        if level == 0:
            prefix = '##'
        elif level == 1:
            prefix = '###'
        else:
            prefix = '-'
        
        if name:
            if level < 2:
                display = f"{name}"
                if en:
                    display += f" ({en})"
                f.write(f'{prefix} {display}\n')
            else:
                display = name
                if en:
                    display = f'{name} - {en}'
                f.write(f'{indent}{prefix} {display}\n')
        
        if url:
            f.write(f'{indent}  - Link: {url}\n')
        
        if 'subs' in item:
            for sub in item['subs']:
                write_item(sub, level + 1)
            f.write('\n')
    
    # Write homepage
    f.write('## Trang chủ (Home)\n\n')
    
    for section, data in sitemap.items():
        if section == 'Trang chủ':
            continue
        item = {'name': section, 'en': data.get('en', '')}
        write_item(item, 0)
        if 'subs' in data:
            for sub in data['subs']:
                write_item(sub, 1)
            f.write('\n')

    f.write('---\n\n*Generated from Sitemap EPath.xlsx*\n')

print('Done! File saved to D:\\Job\\Epath\\Sitemap_Epath.md')
