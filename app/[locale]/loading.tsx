/**
 * Route-level loading skeleton.
 *
 * Why this exists:
 *   - In dev mode, switching to a route Next.js hasn't compiled yet
 *     blocks until webpack finishes (~500-1000ms, see dev log).
 *     Without a loading state the user sees a blank page and reads
 *     it as "the site is slow".
 *   - Showing a non-blocking skeleton keeps the perceived latency
 *     well under what a blank screen would feel like.
 *
 * The skeleton mirrors the hero + section pattern so the layout
 * doesn't jump when the real content swaps in.
 */
export default function LocaleLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="pt-20">
      {/* Hero skeleton */}
      <div className="pt-12 pb-20 bg-gradient-to-br from-[#3A53A3] to-[#2E4389]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-10 md:h-12 w-3/4 mx-auto rounded-lg bg-white/15 animate-pulse mb-6" />
            <div className="h-5 w-2/3 mx-auto rounded bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-white shadow-sm p-6 border border-[#3A53A3]/10"
                style={{
                  // Stagger the pulse so it feels alive rather than
                  // everything blinking in lock-step.
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-[#3A53A3]/10 animate-pulse mb-4" />
                <div className="h-4 w-2/3 rounded bg-[#3A53A3]/10 animate-pulse mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200/80 animate-pulse" />
                  <div className="h-3 w-5/6 rounded bg-gray-200/80 animate-pulse" />
                  <div className="h-3 w-4/6 rounded bg-gray-200/80 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}