"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const nav = [
  { href: "/platform-health", label: "Platform Health" },
  { href: "/platform-strategy", label: "Platform Strategy" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/tool", label: "Content Engine" },
  { href: "/beyond-portals", label: "Beyond Portals" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10">
        <div
          className={[
            "mt-3 sm:mt-4 rounded-2xl border border-[color:var(--border)] backdrop-blur-xl transition-all duration-300",
            scrolled
              ? "bg-white/90 shadow-[var(--shadow)]"
              : "bg-white/70 shadow-[var(--shadow-soft)]",
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--navy)] text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-105">
                K
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[color:var(--navy)]">Kyle Naughtrip</div>
                <div className="text-xs font-medium text-[color:var(--teal)]">Digital Infrastructure Audit</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-[color:var(--navy)] text-white shadow-sm"
                        : "text-[color:var(--navy)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--navy)]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden sm:flex items-center gap-3" />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[color:var(--navy)] p-2 rounded-xl hover:bg-[color:var(--surface-2)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[color:var(--border)] px-4 py-4">
              <div className="space-y-1">
                {nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={[
                        "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-[color:var(--navy)] text-white"
                          : "text-[color:var(--navy)] hover:bg-[color:var(--surface-2)]",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/roadmap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-[color:var(--teal)] px-4 py-3 text-sm font-semibold text-white text-center mt-3"
                >
                  See the Plan →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
