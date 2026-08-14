import { MetadataRoute } from 'next'

/**
 * EPath Education Sitemap
 * Optimized for Google SEO with proper priority and change frequency
 * 
 * URL Structure:
 * - Vietnamese: /vi/*
 * - English: /en/*
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.epath.edu.vn'
  const now = new Date()
  
  // ==========================================
  // HIGHEST PRIORITY - Homepage & Core Pages
  // ==========================================
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vi`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // ==========================================
  // HIGH PRIORITY - Programs & Admissions
  // ==========================================
  const programPages: MetadataRoute.Sitemap = [
    // Programs page
    {
      url: `${baseUrl}/vi/programs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/programs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Admissions page
    {
      url: `${baseUrl}/vi/admissions`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/admissions`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // ==========================================
  // MEDIUM-HIGH PRIORITY - About & Contact
  // ==========================================
  const infoPages: MetadataRoute.Sitemap = [
    // About page
    {
      url: `${baseUrl}/vi/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Contact page
    {
      url: `${baseUrl}/vi/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // ==========================================
  // MEDIUM PRIORITY - Partners & Events
  // ==========================================
  const secondaryPages: MetadataRoute.Sitemap = [
    // Partners page
    {
      url: `${baseUrl}/vi/partners`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/partners`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Events page
    {
      url: `${baseUrl}/vi/events`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/events`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // ==========================================
  // SEO-FOCUSED URLS - Homeschool Keywords
  // These are virtual pages for SEO targeting
  // They should return proper content when accessed
  // ==========================================
  const seoPages: MetadataRoute.Sitemap = [
    // Homeschool main keyword pages
    {
      url: `${baseUrl}/vi/homeschool`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      // Note: This URL should be created as app/[locale]/homeschool/page.tsx
    },
    {
      url: `${baseUrl}/en/homeschool`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Homeschool benefits and info
    {
      url: `${baseUrl}/vi/homeschool/tai-sao-chon-homeschool`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/homeschool/why-choose-homeschool`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Comparison pages
    {
      url: `${baseUrl}/vi/homeschool/homeschool-vs-truong-quoc-te`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/homeschool/homeschool-vs-international-school`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // ==========================================
  // BLOG / KNOWLEDGE BASE
  // ==========================================
  const blogPages: MetadataRoute.Sitemap = [
    // Main blog page
    {
      url: `${baseUrl}/vi/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Blog posts - Education topics
    {
      url: `${baseUrl}/vi/blog/homeschool-la-gi`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog/what-is-homeschool`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vi/blog/giao-duc-tai-nha`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/homeschooling-in-vietnam`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vi/blog/chuong-trinh-homeschool-quoc-te`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/international-homeschool-program`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // FAQ pages
    {
      url: `${baseUrl}/vi/blog/homeschool-faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog/homeschool-faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // ==========================================
  // PROGRAMS BY LEVEL
  // ==========================================
  const levelPages: MetadataRoute.Sitemap = [
    // Kindergarten (Mầm non)
    {
      url: `${baseUrl}/vi/programs/mam-non`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/programs/kindergarten`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Elementary (Tiểu học)
    {
      url: `${baseUrl}/vi/programs/tieu-hoc`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/programs/elementary`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Middle School (THCS)
    {
      url: `${baseUrl}/vi/programs/trung-hoc-co-so`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/programs/middle-school`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // High School (THPT)
    {
      url: `${baseUrl}/vi/programs/trung-hoc-pho-thong`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/programs/high-school`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // ==========================================
  // SPECIALTY PROGRAMS
  // ==========================================
  const specialtyPages: MetadataRoute.Sitemap = [
    // Semi-Homeschool
    {
      url: `${baseUrl}/vi/programs/semi-homeschool`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/programs/semi-homeschool`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Full Homeschool
    {
      url: `${baseUrl}/vi/programs/homeschool-chinh-thuc`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/programs/full-homeschool`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Dual Diploma
    {
      url: `${baseUrl}/vi/programs/song-bang-dual-diploma`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/programs/dual-diploma`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // English Program
    {
      url: `${baseUrl}/vi/programs/chuong-trinh-tieng-anh`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/programs/english-program`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // ==========================================
  // COMBINE ALL SITEMAPS
  // ==========================================
  return [
    ...corePages,
    ...programPages,
    ...infoPages,
    ...secondaryPages,
    ...levelPages,
    ...specialtyPages,
    ...seoPages,
    ...blogPages,
  ]
}
