/**
 * Admin segment layout.
 *
 * - Skips the public Header / Footer (no marketing chrome inside admin).
 * - Bypasses the [locale] dynamic segment so admin URLs stay flat
 *   (e.g. /admin/login instead of /vi/admin/login).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>
}
