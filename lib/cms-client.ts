'use client'

/**
 * Lightweight typed CMS client. All requests are authenticated via the
 * HttpOnly session cookie set by /api/auth/login.
 */
import type {
  FAQInput,
  ProgramInput,
  PartnerInput,
  CmsEventInput,
  CoreValueInput,
  LearningPathwayInput,
  AdmissionStepInput,
  AchievementInput,
  TeamMemberInput,
  StatisticInput,
  TestimonialInput,
  SiteSettingsInput,
  HeroContentInput,
  AboutContentInput,
  FAQ,
  Program,
  Partner,
  CmsEvent,
  CoreValue,
  LearningPathway,
  AdmissionStep,
  Achievement,
  TeamMember,
  Statistic,
  Testimonial,
  SiteSettings,
  HeroContent,
  AboutContent,
} from './cms-types'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

function listUrl(name: string) {
  return `/api/cms/${name}`
}

export interface CmsListResponse<T> {
  items: T[]
}

export const cms = {
  faqs: {
    list: () => request<CmsListResponse<FAQ>>(listUrl('faqs')).then((r) => r.items),
    create: (data: FAQInput) =>
      request<{ id: string }>(listUrl('faqs'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<FAQInput>) =>
      request<{ ok: true }>(`${listUrl('faqs')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('faqs')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('faqs')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  programs: {
    list: () => request<CmsListResponse<Program>>(listUrl('programs')).then((r) => r.items),
    create: (data: ProgramInput) =>
      request<{ id: string }>(listUrl('programs'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<ProgramInput>) =>
      request<{ ok: true }>(`${listUrl('programs')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('programs')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('programs')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  partners: {
    list: () => request<CmsListResponse<Partner>>(listUrl('partners')).then((r) => r.items),
    create: (data: PartnerInput) =>
      request<{ id: string }>(listUrl('partners'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<PartnerInput>) =>
      request<{ ok: true }>(`${listUrl('partners')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('partners')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('partners')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  events: {
    list: () => request<CmsListResponse<CmsEvent>>(listUrl('events')).then((r) => r.items),
    create: (data: CmsEventInput) =>
      request<{ id: string }>(listUrl('events'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CmsEventInput>) =>
      request<{ ok: true }>(`${listUrl('events')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('events')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('events')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  coreValues: {
    list: () => request<CmsListResponse<CoreValue>>(listUrl('core-values')).then((r) => r.items),
    create: (data: CoreValueInput) =>
      request<{ id: string }>(listUrl('core-values'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CoreValueInput>) =>
      request<{ ok: true }>(`${listUrl('core-values')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('core-values')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('core-values')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  pathways: {
    list: () => request<CmsListResponse<LearningPathway>>(listUrl('pathways')).then((r) => r.items),
    create: (data: LearningPathwayInput) =>
      request<{ id: string }>(listUrl('pathways'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<LearningPathwayInput>) =>
      request<{ ok: true }>(`${listUrl('pathways')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('pathways')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('pathways')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  admissionSteps: {
    list: () => request<CmsListResponse<AdmissionStep>>(listUrl('admission-steps')).then((r) => r.items),
    create: (data: AdmissionStepInput) =>
      request<{ id: string }>(listUrl('admission-steps'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<AdmissionStepInput>) =>
      request<{ ok: true }>(`${listUrl('admission-steps')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('admission-steps')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('admission-steps')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  achievements: {
    list: () => request<CmsListResponse<Achievement>>(listUrl('achievements')).then((r) => r.items),
    create: (data: AchievementInput) =>
      request<{ id: string }>(listUrl('achievements'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<AchievementInput>) =>
      request<{ ok: true }>(`${listUrl('achievements')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('achievements')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('achievements')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  team: {
    list: () => request<CmsListResponse<TeamMember>>(listUrl('team')).then((r) => r.items),
    create: (data: TeamMemberInput) =>
      request<{ id: string }>(listUrl('team'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TeamMemberInput>) =>
      request<{ ok: true }>(`${listUrl('team')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('team')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('team')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  statistics: {
    list: () => request<CmsListResponse<Statistic>>(listUrl('statistics')).then((r) => r.items),
    create: (data: StatisticInput) =>
      request<{ id: string }>(listUrl('statistics'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<StatisticInput>) =>
      request<{ ok: true }>(`${listUrl('statistics')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('statistics')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('statistics')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  testimonials: {
    list: () => request<CmsListResponse<Testimonial>>(listUrl('testimonials')).then((r) => r.items),
    create: (data: TestimonialInput) =>
      request<{ id: string }>(listUrl('testimonials'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TestimonialInput>) =>
      request<{ ok: true }>(`${listUrl('testimonials')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('testimonials')}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ ok: true }>(`${listUrl('testimonials')}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
  },
  siteSettings: {
    list: () => request<CmsListResponse<SiteSettings>>(listUrl('site-settings')).then((r) => r.items),
    create: (data: SiteSettingsInput) =>
      request<{ id: string }>(listUrl('site-settings'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<SiteSettingsInput>) =>
      request<{ ok: true }>(`${listUrl('site-settings')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('site-settings')}/${id}`, { method: 'DELETE' }),
  },
  heroContent: {
    list: () => request<CmsListResponse<HeroContent>>(listUrl('hero-content')).then((r) => r.items),
    create: (data: HeroContentInput) =>
      request<{ id: string }>(listUrl('hero-content'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<HeroContentInput>) =>
      request<{ ok: true }>(`${listUrl('hero-content')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('hero-content')}/${id}`, { method: 'DELETE' }),
  },
  aboutContent: {
    list: () => request<CmsListResponse<AboutContent>>(listUrl('about-content')).then((r) => r.items),
    create: (data: AboutContentInput) =>
      request<{ id: string }>(listUrl('about-content'), { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<AboutContentInput>) =>
      request<{ ok: true }>(`${listUrl('about-content')}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ ok: true }>(`${listUrl('about-content')}/${id}`, { method: 'DELETE' }),
  },
}