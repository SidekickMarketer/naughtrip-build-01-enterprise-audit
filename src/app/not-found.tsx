import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--navy)] text-white text-2xl font-bold mb-6">
          404
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-tight text-[color:var(--navy)]">
          Page not found
        </h1>

        <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--navy)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow)] hover:-translate-y-0.5"
          >
            Go Home
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/roadmap"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-3 text-sm font-semibold text-[color:var(--navy)] transition-all hover:bg-[color:var(--surface-2)]"
          >
            View Strategic Roadmap
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-[color:var(--border)]">
          <p className="text-xs text-[color:var(--muted)]">
            Looking for something specific?
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {[
              { href: "/roadmap", label: "Roadmap" },
              { href: "/platform-health", label: "Platform Health" },
              { href: "/tool", label: "Content Engine" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--navy)] hover:bg-[color:var(--surface-2)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
