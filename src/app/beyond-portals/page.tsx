"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

export default function BeyondPortalsPage() {
  return (
    <div className="pt-32 pb-24 bg-[color:var(--bg)] min-h-screen">
      <div className="px-4 md:px-8 max-w-5xl mx-auto">

        {/* ─── Hero ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase border border-[color:var(--teal)]/20 mb-8">
            Prototype
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--navy)] leading-[1.1] tracking-tight font-display mb-6">
            One Front Door for All of Apex
          </h1>

          <p className="text-lg text-[color:var(--muted)] leading-relaxed mb-8 max-w-2xl mx-auto">
            Agents ask one question: &ldquo;Can you write this risk?&rdquo; Today that means navigating 12+ websites across three divisions. This prototype replaces that with a single discovery interface that matches appetite, routes across divisions, and surfaces cross-sell &mdash; all from one search.
          </p>

          <Link
            href="/beyond-portals/demo"
            className="inline-flex items-center justify-center gap-2 bg-[color:var(--navy)] text-white px-8 py-4 rounded-full text-base font-bold hover:opacity-95 hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Launch the Prototype
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ─── Product Preview ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          {/* Browser frame */}
          <div className="rounded-2xl border border-[color:var(--border)] shadow-2xl shadow-gray-200/50 overflow-hidden bg-white">
            {/* Browser chrome */}
            <div className="bg-[color:var(--surface-2)] border-b border-[color:var(--border)] px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs text-[color:var(--muted)] border border-[color:var(--border)] font-mono">
                apex-intermediaries.com/discover
              </div>
            </div>

            {/* Mock UI */}
            <div className="p-6 md:p-10 bg-[#f8f9fa]">
              <div className="flex gap-6">
                {/* Sidebar mock */}
                <div className="hidden md:block w-56 shrink-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pipeline</div>
                    {[
                      { label: "Cannabis — CO", status: "Matched", color: "#D97706" },
                      { label: "School District — WA", status: "Pre-Qualified", color: "#3B82F6" },
                      { label: "Trucking Fleet — TX", status: "Application Started", color: "#8B5CF6" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                          <div className="text-xs font-medium text-gray-800">{item.label}</div>
                          <div className="text-[10px] text-gray-400">{item.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main content mock */}
                <div className="flex-1 space-y-4">
                  {/* Search bar */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm text-gray-800">Cannabis dispensary in Colorado, $2M revenue, need property and GL</span>
                  </div>

                  {/* Result cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { program: "Cannabis Property & GL", division: "Apex Programs", confidence: "95%", color: "#16A34A" },
                      { program: "Cannabis Product Liability", division: "Apex Programs", confidence: "88%", color: "#16A34A" },
                    ].map((card, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{card.division}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${card.color}15`, color: card.color }}>{card.confidence} match</span>
                        </div>
                        <div className="text-sm font-bold text-gray-800">{card.program}</div>
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-[color:var(--teal)] cursor-default">Start Application &rarr;</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cross-sell teaser */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cross-Sell Opportunities</div>
                    <div className="flex flex-wrap gap-2">
                      {["Cyber Liability", "Earthquake", "Excess Liability"].map((item) => (
                        <span key={item} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Three Value Props ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              title: "Discovery",
              description: "One search across 62 Programs, Atlas practice areas, and 115 Specialty programs. Describe the risk, get matched instantly.",
            },
            {
              title: "Routing",
              description: "Standard risk goes to Exchange. Complex or E&S goes to Atlas. Niche goes to Specialty. The agent never has to figure out which division.",
            },
            {
              title: "Cross-Sell",
              description: "Every interaction surfaces 2-5 additional lines across divisions that the agent didn't ask about. The revenue multiplier.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[color:var(--surface)] rounded-2xl p-6 border border-[color:var(--border)] shadow-[var(--shadow-soft)]"
            >
              <h3 className="text-sm font-bold text-[color:var(--navy)] mb-2">{item.title}</h3>
              <p className="text-sm text-[color:var(--muted)] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </motion.div>

        {/* ─── Bottom CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[color:var(--navy)] rounded-2xl p-8 md:p-12 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display">
              Try it yourself.
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Describe any risk. Watch it match across all three divisions and surface cross-sell the agent didn&apos;t ask about.
            </p>
            <Link
              href="/beyond-portals/demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-[color:var(--navy)] px-8 py-4 rounded-full text-base font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Launch Prototype
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
