import { HomeSectionsRenderer } from '@/lib/page-renderer'

/**
 * The home page reads its section order from the Page Builder (`/admin/pages/home`).
 * When admins haven't configured anything yet, the renderer falls back to the
 * default layout (hero → core values → ... → CTA).
 */
export default async function HomePage() {
  return <HomeSectionsRenderer />
}