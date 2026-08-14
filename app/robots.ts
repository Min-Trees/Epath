import { MetadataRoute } from 'next'

/**
 * EPath Education Robots Configuration
 * Optimized for Google Search Console
 * 
 * Allows all crawlers to access public content
 * Blocks admin, API routes, and internal pages
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/login/',
          '/page-builder/',
          // Block CMS internal routes
          '/admin/*',
        ],
      },
      // Specific crawlers
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.epath.edu.vn/sitemap.xml',
  }
}
