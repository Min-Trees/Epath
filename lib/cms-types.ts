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

// ----------- Review Workflow (8 trạng thái) -----------
export const REVIEW_STATUSES = [
  'DRAFT',
  'PENDING_REVIEW',
  'REJECTED',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'UNPUBLISHED',
  'ARCHIVED',
] as const

export const ReviewStatusSchema = z.enum(REVIEW_STATUSES)
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, { vi: string; en: string; color: string }> = {
  DRAFT: { vi: 'Bản nháp', en: 'Draft', color: '#6b7280' },
  PENDING_REVIEW: { vi: 'Chờ duyệt', en: 'Pending review', color: '#f59e0b' },
  REJECTED: { vi: 'Bị từ chối', en: 'Rejected', color: '#dc2626' },
  APPROVED: { vi: 'Đã duyệt', en: 'Approved', color: '#0ea5e9' },
  SCHEDULED: { vi: 'Đã lên lịch', en: 'Scheduled', color: '#8b5cf6' },
  PUBLISHED: { vi: 'Đã xuất bản', en: 'Published', color: '#16a34a' },
  UNPUBLISHED: { vi: 'Gỡ xuất bản', en: 'Unpublished', color: '#475569' },
  ARCHIVED: { vi: 'Lưu trữ', en: 'Archived', color: '#374151' },
}

/**
 * Audit & workflow fields được gắn vào mỗi CMS document.
 * Giúp UI/service xác định người tạo, người duyệt, lý do từ chối, thời điểm publish.
 */
export const ReviewAuditSchema = z.object({
  status: ReviewStatusSchema.default('DRAFT'),
  rejectionReason: z.string().default(''),
  scheduledAt: z.string().default(''), // ISO
  publishedAt: z.string().default(''), // ISO
  createdByUid: z.string().default(''),
  createdByEmail: z.string().default(''),
  createdByName: z.string().default(''),
  lastReviewerUid: z.string().default(''),
  lastReviewerEmail: z.string().default(''),
  lastReviewerName: z.string().default(''),
  submittedAt: z.string().default(''), // ISO - when moved to PENDING_REVIEW
  reviewedAt: z.string().default(''), // ISO - when APPROVED/REJECTED
})
export type ReviewAudit = z.infer<typeof ReviewAuditSchema>

export const ReviewEventSchema = z.object({
  id: z.string().optional(),
  from: ReviewStatusSchema,
  to: ReviewStatusSchema,
  actorUid: z.string().default(''),
  actorEmail: z.string().default(''),
  actorName: z.string().default(''),
  comment: z.string().default(''),
  scheduledAt: z.string().default(''),
  at: z.union([z.date(), z.string()]).optional(),
})
export type ReviewEvent = z.infer<typeof ReviewEventSchema>

// ----------- Backup -----------
export const BackupTypeSchema = z.enum(['scheduled', 'manual', 'pre-restore'])
export type BackupType = z.infer<typeof BackupTypeSchema>

export const BackupStatusSchema = z.enum(['pending', 'running', 'completed', 'failed'])
export type BackupStatus = z.infer<typeof BackupStatusSchema>

export const BackupSchema = z.object({
  id: z.string().optional(),
  type: BackupTypeSchema,
  status: BackupStatusSchema.default('pending'),
  startedAt: z.string().default(''),
  finishedAt: z.string().default(''),
  gcsPrefix: z.string().default(''),
  collections: z.array(z.string()).default([]),
  triggeredByUid: z.string().default(''),
  triggeredByEmail: z.string().default(''),
  triggeredByName: z.string().default(''),
  sizeBytes: z.number().int().nonnegative().default(0),
  documentCount: z.number().int().nonnegative().default(0),
  retentionUntil: z.string().default(''),
  notes: z.string().default(''),
  error: z.string().default(''),
  createdAt: z.union([z.date(), z.string()]).optional(),
})
export type Backup = z.infer<typeof BackupSchema>
export type BackupInput = z.infer<typeof BackupSchema>

// ----------- Reviewable Base Mixin -----------
/**
 * Trộn các field review workflow vào bất kỳ schema Zod nào.
 * - Mặc định status = 'DRAFT' (an toàn cho nội dung mới).
 * - Áp dụng cho tất cả 13 collection public-facing.
 */
export const reviewable = z.object({
  status: ReviewStatusSchema.default('DRAFT'),
  rejectionReason: z.string().default(''),
  scheduledAt: z.string().default(''),
  publishedAt: z.string().default(''),
  createdByUid: z.string().default(''),
  createdByEmail: z.string().default(''),
  createdByName: z.string().default(''),
  lastReviewerUid: z.string().default(''),
  lastReviewerEmail: z.string().default(''),
  lastReviewerName: z.string().default(''),
  submittedAt: z.string().default(''),
  reviewedAt: z.string().default(''),
})

// ----------- FAQ -----------
export const FAQSchema = z.object({
  id: z.string().optional(),
  question: LocalizedStringSchema,
  answer: LocalizedStringSchema,
  category: z.enum(['admissions', 'program', 'general']),
  imageUrl: z.string().url().or(z.literal('')).default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
}).merge(reviewable)
export type FAQInput = z.infer<typeof FAQSchema>
export type FAQ = Omit<FAQInput, 'id'> & { id: string }

// ----------- Core Value -----------
export const CoreValueSchema = z.object({
  id: z.string().optional(),
  icon: z.string().default('Compass'),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  imageUrl: z.string().url().or(z.literal('')).default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
}).merge(reviewable)
export type CoreValueInput = z.infer<typeof CoreValueSchema>
export type CoreValue = Omit<CoreValueInput, 'id'> & { id: string }

// ----------- Learning Pathway -----------
export const LearningPathwaySchema = z.object({
  id: z.string().optional(),
  level: z.enum(['kindergarten', 'elementary', 'middle', 'high']),
  step: z.string().default('01'),
  title: LocalizedStringSchema,
  subtitle: LocalizedStringSchema.optional().default({ vi: '', en: '' }),
  description: LocalizedStringSchema.optional().default({ vi: '', en: '' }),
  modelTag: LocalizedStringSchema.optional().default({ vi: '', en: '' }),
  badges: z.string().or(z.array(z.string())).optional().default(''),
  objectives: z.array(LocalizedStringSchema).or(z.array(z.string())).default([]),
  outcomes: LocalizedStringSchema.optional().default({ vi: '', en: '' }),
  imageUrl: z.string().default(''),
  ctaUrl: z.string().default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
}).merge(reviewable)
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
}).merge(reviewable)
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
}).merge(reviewable)
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
  coverImage: z.string().url().or(z.literal('')).default(''), // backward compat alias
  imageUrl: z.string().url().or(z.literal('')).default(''),
  registerUrl: z.string().url().or(z.literal('')).default(''),
  status: EventStatusEnum,
  isFeatured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
}).merge(reviewable)
export type CmsEventInput = z.infer<typeof EventSchema>
export type CmsEvent = Omit<CmsEventInput, 'id'> & { id: string }

// ----------- Admission Step -----------
export const AdmissionStepSchema = z.object({
  id: z.string().optional(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  icon: z.string().default('ListChecks'),
  imageUrl: z.string().url().or(z.literal('')).default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  stepNumber: z.number().int().nonnegative().optional(),
}).merge(reviewable)
export type AdmissionStepInput = z.infer<typeof AdmissionStepSchema>
export type AdmissionStep = Omit<AdmissionStepInput, 'id'> & { id: string }

// ----------- Achievement -----------
export const AchievementSchema = z.object({
  id: z.string().optional(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  images: z.array(z.string()).default([]),
  coverImage: z.string().url().or(z.literal('')).default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
}).merge(reviewable)
export type AchievementInput = z.infer<typeof AchievementSchema>
export type Achievement = Omit<AchievementInput, 'id'> & { id: string }

// ----------- Team Member / Faculty -----------
export const TeamMemberSchema = z.object({
  id: z.string().optional(),
  name: LocalizedStringSchema.or(z.string().min(1)),
  role: LocalizedStringSchema.or(z.string()).default({ vi: '', en: '' }),
  tag: LocalizedStringSchema.optional().default({ vi: '', en: '' }),
  bio: LocalizedStringSchema.or(z.string()).default({ vi: '', en: '' }),
  avatarUrl: z.string().default(''),
  point1: LocalizedStringSchema.optional().default({ vi: '', en: '' }),
  point2: LocalizedStringSchema.optional().default({ vi: '', en: '' }),
  highlights: z.array(LocalizedStringSchema).or(z.array(z.string())).optional().default([]),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
}).merge(reviewable)
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

// ----------- Media (S3 / Viettel Cloud Storage uploaded files) -----------
export const MediaSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1), // S3 object key
  url: z.string().min(1), // public URL returned to the client
  bucket: z.string().default(''),
  fileName: z.string().default(''),
  mimeType: z.string().default(''),
  size: z.number().int().nonnegative().default(0),
  folder: z.string().default('cms'),
  uploadedBy: z.string().default(''),
  uploaderEmail: z.string().default(''),
  uploaderName: z.string().default(''),
  uploadedAt: z.string().default(''), // ISO timestamp
  altText: z.string().default(''),
})
export type MediaInput = z.infer<typeof MediaSchema>
export type Media = Omit<MediaInput, 'id'> & { id: string }

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
  activityLogs: 'activityLogs',
  leads: 'leads',
  blogPosts: 'blogPosts',
  navigation: 'navigation',
  media: 'media',
  backups: 'backups',
} as const

export type CollectionName = (typeof CollectionNames)[keyof typeof CollectionNames]

/**
 * 13 collection CMS public-facing có áp dụng review workflow.
 * Dùng cho queue review, backup, public API filter.
 */
export const REVIEWABLE_COLLECTIONS: CollectionName[] = [
  CollectionNames.faqs,
  CollectionNames.coreValues,
  CollectionNames.learningPathways,
  CollectionNames.programs,
  CollectionNames.partners,
  CollectionNames.events,
  CollectionNames.admissionSteps,
  CollectionNames.achievements,
  CollectionNames.teamMembers,
  CollectionNames.statistics,
  CollectionNames.testimonials,
  CollectionNames.blogPosts,
  CollectionNames.pages,
]

// ----------- Lead (inbound contact form / chatbot) -----------
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'archived'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LeadSourceEnum = z.enum(['chatbot', 'contact-form', 'zalo', 'manual', 'website', 'events'])
export type LeadSource = z.infer<typeof LeadSourceEnum>

export const LeadSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(''),
  phone: z.string().min(1),
  email: z.string().default(''),
  childAge: z.string().default(''),
  program: z.string().default(''),
  campus: z.string().default(''),
  topicsInterested: z.array(z.string()).default([]),
  conversationSummary: z.string().default(''),
  conversationCount: z.number().int().default(0),
  locale: z.string().default('vi'),
  source: LeadSourceEnum.default('chatbot'),
  status: z.enum(LEAD_STATUSES).default('new'),
  notes: z.string().default(''),
  assignedTo: z.string().default(''),
  // Firestore Timestamp objects (or JSON-serialized form) are passed
  // through unchanged; `lib/date-utils` normalizes every shape at render
  // time. Accept any value here to avoid type-narrowing surprises.
  createdAt: z.unknown().optional(),
  updatedAt: z.unknown().optional(),
  rejectionReason: z.string().optional(),
  scheduledAt: z.unknown().optional(),
  publishedAt: z.unknown().optional(),
})
export type LeadInput = z.infer<typeof LeadSchema>
export type Lead = Omit<LeadInput, 'id'> & { id: string }

// ----------- Blog Post -----------
export const BlogPostSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: LocalizedStringSchema,
  excerpt: LocalizedStringSchema,
  content: LocalizedStringSchema,
  coverImage: z.string().url().or(z.literal('')).default(''),
  coverImageAlt: z.string().default(''),
  tags: z.array(z.string()).default([]),
  category: z.string().default(''),
  author: z.string().default(''),
  publishedAt: z.string().default(''), // ISO; falls back to createdAt when missing
  isFeatured: z.boolean().default(false),
  readingTimeMinutes: z.number().int().min(1).default(5),
  seoTitle: LocalizedStringSchema.optional(),
  seoDescription: LocalizedStringSchema.optional(),
  order: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
}).merge(reviewable)
export type BlogPostInput = z.infer<typeof BlogPostSchema>
export type BlogPost = Omit<BlogPostInput, 'id'> & { id: string }

// ----------- Activity Log -----------
export const ActivityActionSchema = z.enum([
  'create',
  'update',
  'delete',
  'reorder',
  'login',
  'logout',
  'submit_review',
  'approve',
  'reject',
  'publish',
  'unpublish',
  'archive',
  'schedule',
  'restore_draft',
  'backup_run',
  'backup_restore',
  'backup_prune',
  'backup_failed',
])
export type ActivityAction = z.infer<typeof ActivityActionSchema>

export const ActivityLogSchema = z.object({
  id: z.string().optional(),
  action: ActivityActionSchema,
  collection: z.string(), // e.g. "programs", "faqs", "auth"
  documentId: z.string().default(''),
  documentLabel: z.string().default(''), // human-readable identifier
  actorUid: z.string(),
  actorEmail: z.string().default(''),
  actorName: z.string().default(''),
  changes: z.record(z.unknown()).optional(), // diff for updates
  ip: z.string().default(''),
  userAgent: z.string().default(''),
  createdAt: z.union([z.date(), z.string()]).optional(),
})
export type ActivityLogInput = z.infer<typeof ActivityLogSchema>
export type ActivityLog = Omit<ActivityLogInput, 'id'> & { id: string }

// ----------- Statistics -----------
export const StatisticSchema = z.object({
  id: z.string().optional(),
  label: LocalizedStringSchema,
  value: z.string().min(1), // e.g., "10+", "100%", "5000"
  suffix: z.string().default(''), // e.g., "+", "%", " students"
  icon: z.string().default('TrendingUp'),
  imageUrl: z.string().url().or(z.literal('')).default(''),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
}).merge(reviewable)
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
}).merge(reviewable)
export type TestimonialInput = z.infer<typeof TestimonialSchema>
export type Testimonial = Omit<TestimonialInput, 'id'> & { id: string }

// ----------- Site Settings (Contact Info, Social Links, etc.) -----------
export const SiteSettingsSchema = z.object({
  id: z.string().optional(),
  // Legacy flat fields (backward compat with existing page code)
  addressVi: z.string().default(''),
  addressEn: z.string().default(''),
  contactEmail: z.string().default(''),
  workingHoursVi: z.string().default(''),
  workingHoursEn: z.string().default(''),
  // Logo & Brand
  logoUrl: z.string().url().or(z.literal('')).default(''),
  faviconUrl: z.string().url().or(z.literal('')).default(''),
  // Contact Information
  address: LocalizedStringSchema,
  phone: z.string().default(''),
  email: z.string().default(''),
  zaloUrl: z.string().url().or(z.literal('')).default(''),
  facebookUrl: z.string().url().or(z.literal('')).default(''),
  youtubeUrl: z.string().url().or(z.literal('')).default(''),
  tiktokUrl: z.string().url().or(z.literal('')).default(''),
  instagramUrl: z.string().url().or(z.literal('')).default(''),
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
  // Partners list (footer quick listing)
  partnersList: z.array(z.string()).default([]),
  footerPartnersTitle: LocalizedStringSchema.optional(),
  // Copyright
  copyrightText: z.string().default(''),
  // CTA banner
  ctaTitle: LocalizedStringSchema.optional(),
  ctaSubtitle: LocalizedStringSchema.optional(),
  ctaPrimaryLabel: LocalizedStringSchema.optional(),
  ctaPrimaryUrl: z.string().default(''),
  ctaSecondaryLabel: LocalizedStringSchema.optional(),
  ctaSecondaryUrl: z.string().default(''),
  ctaBackgroundImage: z.string().url().or(z.literal('')).default(''),
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
  // Faculty & Academic Board
  facultyTitle: LocalizedStringSchema.optional(),
  facultySubtitle: LocalizedStringSchema.optional(),
  // Milestones (stored as JSON string of array)
  milestones: z.string().default('[]'), // JSON array of { year, title, description }
  // About Hero Image
  heroImage: z.string().url().or(z.literal('')).default(''),
})
export type AboutContentInput = z.infer<typeof AboutContentSchema>
export type AboutContent = Omit<AboutContentInput, 'id'> & { id: string }