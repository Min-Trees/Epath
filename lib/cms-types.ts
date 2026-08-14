// Shared types and Zod validators for the CMS data model.
import { z } from 'zod'

export type Locale = 'vi' | 'en'

export const LOCALES: Locale[] = ['vi', 'en']

export const LocalizedStringSchema = z.object({
  vi: z.string(),
  en: z.string(),
})
export type LocalizedString = z.infer<typeof LocalizedStringSchema>

export const LocalizedRichTextSchema = LocalizedStringSchema
export type LocalizedRichText = LocalizedString

// ----------- FAQ -----------
export const FAQSchema = z.object({
  id: z.string().optional(),
  question: LocalizedStringSchema,
  answer: LocalizedStringSchema,
  category: z.enum(['admissions', 'program', 'general']),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type FAQInput = z.infer<typeof FAQSchema>
export type FAQ = Omit<FAQInput, 'id'> & { id: string }

// ----------- Core Value -----------
export const CoreValueSchema = z.object({
  id: z.string().optional(),
  icon: z.string().default('Compass'),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type CoreValueInput = z.infer<typeof CoreValueSchema>
export type CoreValue = Omit<CoreValueInput, 'id'> & { id: string }

// ----------- Learning Pathway -----------
export const LearningPathwaySchema = z.object({
  id: z.string().optional(),
  level: z.enum(['kindergarten', 'elementary', 'middle', 'high']),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  objectives: z.array(LocalizedStringSchema).default([]),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type LearningPathwayInput = z.infer<typeof LearningPathwaySchema>
export type LearningPathway = Omit<LearningPathwayInput, 'id'> & { id: string }

// ----------- Program -----------
export const ProgramLevelEnum = z.enum([
  'kindergarten',
  'elementary',
  'middle',
  'high',
])

export const ProgramSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  level: ProgramLevelEnum,
  title: LocalizedStringSchema,
  shortDescription: LocalizedStringSchema,
  content: LocalizedStringSchema,
  ageRange: z.string().default(''),
  objectives: z.array(LocalizedStringSchema).default([]),
  highlights: z.array(LocalizedStringSchema).default([]),
  imageUrl: z.string().url().or(z.literal('')).default(''),
  ctaLabel: LocalizedStringSchema.optional(),
  ctaUrl: z.string().default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  status: z.enum(['draft', 'published']).default('draft'),
})
export type ProgramInput = z.infer<typeof ProgramSchema>
export type Program = Omit<ProgramInput, 'id'> & { id: string }

// ----------- Partner -----------
export const PartnerCategoryEnum = z.enum([
  'curriculum',
  'certification',
  'lab',
  'other',
])

export const PartnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  logoUrl: z.string().url().or(z.literal('')).default(''),
  website: z.string().url().or(z.literal('')).default(''),
  category: PartnerCategoryEnum,
  description: LocalizedStringSchema,
  features: z.array(LocalizedStringSchema).default([]),
  isFeatured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type PartnerInput = z.infer<typeof PartnerSchema>
export type Partner = Omit<PartnerInput, 'id'> & { id: string }

// ----------- Event -----------
export const EventStatusEnum = z.enum(['upcoming', 'ongoing', 'completed', 'cancelled'])

export const EventSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: LocalizedStringSchema,
  shortDescription: LocalizedStringSchema,
  content: LocalizedStringSchema,
  startDate: z.string().min(1), // ISO date string
  endDate: z.string().optional().default(''),
  location: z.string().default(''),
  imageUrl: z.string().url().or(z.literal('')).default(''),
  registerUrl: z.string().url().or(z.literal('')).default(''),
  status: EventStatusEnum,
  isFeatured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type CmsEventInput = z.infer<typeof EventSchema>
export type CmsEvent = Omit<CmsEventInput, 'id'> & { id: string }

// ----------- Admission Step -----------
export const AdmissionStepSchema = z.object({
  id: z.string().optional(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  icon: z.string().default('ListChecks'),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type AdmissionStepInput = z.infer<typeof AdmissionStepSchema>
export type AdmissionStep = Omit<AdmissionStepInput, 'id'> & { id: string }

// ----------- Achievement -----------
export const AchievementSchema = z.object({
  id: z.string().optional(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  images: z.array(z.string().url()).default([]),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type AchievementInput = z.infer<typeof AchievementSchema>
export type Achievement = Omit<AchievementInput, 'id'> & { id: string }

// ----------- Team Member -----------
export const TeamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  role: LocalizedStringSchema,
  bio: LocalizedStringSchema,
  avatarUrl: z.string().url().or(z.literal('')).default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type TeamMemberInput = z.infer<typeof TeamMemberSchema>
export type TeamMember = Omit<TeamMemberInput, 'id'> & { id: string }

// ----------- Page Section -----------
import { z as zns } from 'zod'
export const PageSlugSchema = zns.enum([
  'home',
  'about',
  'programs',
  'partners',
  'admissions',
  'events',
])
export type PageSlug = zns.infer<typeof PageSlugSchema>

export const SectionTypeSchema = zns.enum([
  'hero',
  'intro',
  'vision',
  'mission',
  'coreValues',
  'learningPathways',
  'stepModel',
  'statistics',
  'testimonials',
  'partners',
  'achievements',
  'whyEdmentum',
  'faqs',
  'admissionSteps',
  'pricing',
  'team',
  'cta',
])
export type SectionType = zns.infer<typeof SectionTypeSchema>

export interface PageSection {
  id: string
  pageId: PageSlug
  type: SectionType
  order: number
  isActive: boolean
  data: Record<string, unknown>
}

// ----------- Reorder helper -----------
export const ReorderSchema = z.object({
  ids: z.array(z.string()).min(1),
})
export type ReorderInput = z.infer<typeof ReorderSchema>

export const CollectionNames = {
  faqs: 'faqs',
  coreValues: 'coreValues',
  learningPathways: 'learningPathways',
  programs: 'programs',
  partners: 'partners',
  events: 'events',
  admissionSteps: 'admissionSteps',
  achievements: 'achievements',
  teamMembers: 'teamMembers',
  pages: 'pages',
  statistics: 'statistics',
  testimonials: 'testimonials',
  siteSettings: 'siteSettings',
  heroContent: 'heroContent',
  aboutContent: 'aboutContent',
} as const

export type CollectionName = (typeof CollectionNames)[keyof typeof CollectionNames]

// ----------- Statistics -----------
export const StatisticSchema = z.object({
  id: z.string().optional(),
  label: LocalizedStringSchema,
  value: z.string().min(1), // e.g., "10+", "100%", "5000"
  suffix: z.string().default(''), // e.g., "+", "%", " students"
  icon: z.string().default('TrendingUp'),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type StatisticInput = z.infer<typeof StatisticSchema>
export type Statistic = Omit<StatisticInput, 'id'> & { id: string }

// ----------- Testimonial -----------
export const TestimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  role: z.string().default(''), // e.g., "Phụ huynh học sinh", "Học sinh"
  avatarUrl: z.string().url().or(z.literal('')).default(''),
  content: LocalizedStringSchema,
  rating: z.number().int().min(1).max(5).default(5),
  isFeatured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
})
export type TestimonialInput = z.infer<typeof TestimonialSchema>
export type Testimonial = Omit<TestimonialInput, 'id'> & { id: string }

// ----------- Site Settings (Contact Info, Social Links, etc.) -----------
export const SiteSettingsSchema = z.object({
  id: z.string().optional(),
  // Contact Information
  address: LocalizedStringSchema,
  phone: z.string().default(''),
  email: z.string().default(''),
  zaloUrl: z.string().url().or(z.literal('')).default(''),
  facebookUrl: z.string().url().or(z.literal('')).default(''),
  youtubeUrl: z.string().url().or(z.literal('')).default(''),
  hotline: z.string().default(''),
  // Business Hours
  workingHours: LocalizedStringSchema,
  // Map
  mapEmbedUrl: z.string().url().or(z.literal('')).default(''),
  mapCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  // Footer
  footerDescription: LocalizedStringSchema,
  // Copyright
  copyrightText: z.string().default(''),
})
export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>
export type SiteSettings = Omit<SiteSettingsInput, 'id'> & { id: string }

// ----------- Hero Content -----------
export const HeroContentSchema = z.object({
  id: z.string().optional(),
  pageId: PageSlugSchema,
  welcome: LocalizedStringSchema,
  title: LocalizedStringSchema,
  subtitle: LocalizedStringSchema,
  description: LocalizedStringSchema,
  ctaLabel: LocalizedStringSchema,
  ctaUrl: z.string().default('#programs'),
  secondaryCtaLabel: LocalizedStringSchema.optional(),
  secondaryCtaUrl: z.string().default('#contact'),
  videoUrl: z.string().url().or(z.literal('')).default(''),
  videoThumbnail: z.string().url().or(z.literal('')).default(''),
  backgroundImage: z.string().url().or(z.literal('')).default(''),
  isActive: z.boolean().default(true),
})
export type HeroContentInput = z.infer<typeof HeroContentSchema>
export type HeroContent = Omit<HeroContentInput, 'id'> & { id: string }

// ----------- About Page Content -----------
export const AboutContentSchema = z.object({
  id: z.string().optional(),
  // Intro Section
  introTitle: LocalizedStringSchema,
  introContent: LocalizedStringSchema,
  // Vision
  visionTitle: LocalizedStringSchema,
  visionContent: LocalizedStringSchema,
  // Mission
  missionTitle: LocalizedStringSchema,
  missionContent: LocalizedStringSchema,
  // Milestones (stored as JSON string of array)
  milestones: z.string().default('[]'), // JSON array of { year, title, description }
  // About Hero Image
  heroImage: z.string().url().or(z.literal('')).default(''),
})
export type AboutContentInput = z.infer<typeof AboutContentSchema>
export type AboutContent = Omit<AboutContentInput, 'id'> & { id: string }