# EPath Education Website

Website giáo dục EPath Education - Lộ trình học thuật quốc tế xuyên suốt từ Tiểu học đến THPT.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Animation**: Framer Motion
- **i18n**: next-intl (English & Vietnamese)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
epath-website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── programs/          # Programs page
│   ├── partners/          # Partners page
│   ├── admissions/        # Admissions page
│   ├── events/            # Events page
│   ├── contact/           # Contact page
│   └── admin/             # Admin dashboard
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Header, Footer)
│   └── sections/          # Homepage sections
├── lib/
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript interfaces
└── public/               # Static files
```

## Features

### Homepage Sections
1. Hero Section with animations
2. 6 Core Values grid
3. Learning Pathways cards (4 levels)
4. 5-Step Model timeline
5. Statistics counters with animation
6. Testimonials slider
7. Partner logos
8. FAQ accordion
9. CTA Banner

### Pages
- `/` - Homepage
- `/about` - About EPath
- `/programs` - Programs by level
- `/partners` - International partners
- `/admissions` - Tuition & enrollment
- `/events` - Events & activities
- `/contact` - Contact form

### Admin Dashboard
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard overview
- `/admin/programs` - Manage programs
- `/admin/faqs` - Manage FAQs

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy Blue | #003366 | Primary brand |
| Academic Gold | #E8A020 | CTA buttons |
| Growth Green | #1A7F5A | Secondary |
| Light BG | #F5F7FA | Background |
| Dark Text | #1A1A2E | Text |

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `GROQ_API_KEY` (for AI chatbot)
4. Deploy

## License

Private - All rights reserved.
