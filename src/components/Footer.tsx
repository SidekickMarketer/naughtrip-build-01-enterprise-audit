"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STANDALONE_ROUTES = ["/beyond-portals/demo"];

export default function Footer() {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((route) => pathname.startsWith(route));

  if (isStandalone) return null;

  return (
    <footer className="border-t border-[color:var(--border)] mt-16 bg-[color:var(--surface-2)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Branding */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--navy)] text-white text-sm font-bold">
                K
              </span>
              <div>
                <div className="font-semibold text-[color:var(--navy)]">Kyle Naughtrip</div>
                <div className="text-sm text-[color:var(--teal)]">Digital Infrastructure Audit</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-[color:var(--muted)] max-w-sm leading-relaxed">
              An outside-in digital audit of a multi-brand insurance organization. Platform health, consolidation strategy, content engine, and AI agent prototype.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)] mb-4">Navigation</div>
            <nav className="space-y-3">
              <Link href="/platform-health" className="block text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors">Platform Health</Link>
              <Link href="/platform-strategy" className="block text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors">Platform Strategy</Link>
              <Link href="/roadmap" className="block text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors">Roadmap</Link>
              <Link href="/tool" className="block text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors">Content Engine</Link>
              <Link href="/beyond-portals" className="block text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors">Beyond Portals</Link>
              <Link href="/appendix" className="block text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors">Sources & Citations</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)] mb-4">Get in Touch</div>
            <div className="space-y-3">
              <a
                href="mailto:kyle@naughtrip.com"
                className="flex items-center gap-3 text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors group"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--surface)] border border-[color:var(--border)] group-hover:border-[color:var(--teal)] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                kyle@naughtrip.com
              </a>
              <a
                href="https://linkedin.com/in/kylenaughtrip"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[color:var(--navy)] hover:text-[color:var(--teal)] transition-colors group"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--surface)] border border-[color:var(--border)] group-hover:border-[color:var(--teal)] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[color:var(--border)]">
          <div className="text-xs text-[color:var(--muted)]">
            &copy; 2026 Kyle Naughtrip
          </div>
        </div>
      </div>
    </footer>
  );
}
