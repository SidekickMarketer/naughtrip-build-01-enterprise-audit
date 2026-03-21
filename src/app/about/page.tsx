"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
export default function AboutPage() {
  const careerItems = [
    {
      company: "Sidekick Marketer",
      headline: "Founder & Principal",
      detail: "Founded a growth consultancy that designs and runs revenue systems for service-based companies. Built marketing platforms, automated lead pipelines, and set up analytics.",
    },
    {
      company: "RDI Corporation",
      headline: "Director of Marketing",
      detail: "Recruited to rebuild marketing for a $100M+ B2B professional services company. Reorganized an eight-person team, implemented HubSpot as the core marketing automation platform, overhauled the website, and built sales enablement tools that helped close enterprise contracts.",
    },
    {
      company: "Nikki Martinkovic Design Studio",
      headline: "Co-Founder & Head of BD",
      detail: "Co-founded and scaled a design studio to $8.5M in sales and 650+ retail and enterprise clients. Built and led a team of 7 employees and 15 contractors across production, design, and delivery.",
    },
    {
      company: "Freshly Baked Company",
      headline: "Founding COO",
      detail: "Founding COO of a regulated manufacturing startup. Grew revenue from $0 to $2.4M in year one by building the B2B sales engine and landing distributor partnerships.",
    },
    {
      company: "Uber",
      headline: "Head of Experiential Marketing",
      detail: "Employee #184. Directed East Coast experiential marketing during hyper-growth. Managed a 200-person field team and built scalable playbooks across NY, NJ, and CT markets.",
    },
    {
      company: "Marketing Werks",
      headline: "Account Manager",
      detail: "Managed Verizon's $7M NFL sponsorship across 15 stadiums. Renewed a $1.5M sponsorship and generated $264K in incremental revenue through fan engagement programs.",
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-[color:var(--bg)] min-h-screen">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section - Two Column */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase border border-[color:var(--teal)]/20">
                <div className="w-2 h-2 rounded-full bg-[color:var(--teal)] animate-pulse" />
                Background
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[color:var(--navy)] font-display leading-[1.1]">
                Why Kyle
              </h1>

              <p className="text-xl text-[color:var(--navy)] font-semibold leading-relaxed max-w-lg">
                I build marketing systems inside organizations where growth has outpaced the tools supporting it. Regulated industries. Complex organizations. Multi-brand portfolios.
              </p>
            </motion.div>

            {/* Right Column - The Pattern Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-[color:var(--navy)] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <span className="text-[color:var(--teal-light)] text-xs font-bold tracking-widest uppercase mb-6 block">
                    The Pattern
                  </span>

                  <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight font-display">
                    Insurance intermediaries grow by making it easier for agents to place business with them. Digital experience is the new competitive advantage.
                  </h3>

                  <div className="space-y-4 text-gray-400 leading-relaxed">
                    <p>
                      Apex Intermediaries&apos; product is access: 190 programs across 400+ carriers and the underwriting expertise that retail agents can&apos;t build alone. When the digital experience makes that access easy, agents place more business.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What I Would Own - Dark Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[color:var(--navy)] rounded-3xl p-12 md:p-16 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[color:var(--teal)]/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
                <div>
                  <span className="text-[color:var(--teal-light)] text-xs font-bold tracking-widest uppercase mb-4 block">
                    WHAT THIS ROLE OWNS
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold font-display max-w-2xl">
                    The scope I&apos;d own from day one.
                  </h2>
                </div>

                <a
                  href="/kyle-naughtrip-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white text-sm font-bold hover:bg-white/20 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                {[
                  { title: "Digital strategy", desc: "How Apex Intermediaries shows up across web, email, and social channels — 11 properties, 3 divisions. SEO, AEO, and GEO." },
                  { title: "Marketing technology", desc: "How Dynamics 365, Power BI, GA4, App Insights, and current marketing automation tools connect into one system." },
                  { title: "Content systems", desc: "How underwriters and program managers contribute expertise that marketing turns into compliant, on-brand content at scale." },
                  { title: "Analytics & reporting", desc: "How leadership sees what's actually driving digital engagement and agent adoption." },
                  { title: "Team leadership", desc: "How to structure, resource, and lead a marketing team across 3 divisions, 31 brands, and multiple time zones." },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-[color:var(--teal)]/50 pl-6">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Where This Operating Model Comes From */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[color:var(--surface)] rounded-3xl p-12 md:p-16 shadow-[var(--shadow-soft)] border border-[color:var(--border)]"
          >
            <span className="text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase mb-4 block">
              CAREER
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--navy)] mb-6 font-display">
              Where this operating model comes from
            </h2>
            <p className="text-lg text-[color:var(--muted)] mb-12 max-w-3xl">
              Six roles, one thread: every company needed the infrastructure before it needed the campaigns.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {careerItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white border border-[color:var(--border)] rounded-xl p-5 hover:border-[color:var(--teal)]/50 hover:shadow-md transition-all h-full flex flex-col"
                >
                  <div className="text-[color:var(--navy)] font-bold mb-1">{item.company}</div>
                  <div className="text-[color:var(--teal)] text-sm font-semibold mb-3">{item.headline}</div>
                  <p className="text-[color:var(--muted)] text-sm leading-relaxed flex-1">{item.detail}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-[color:var(--border)] text-center">
              <p className="text-xl text-[color:var(--navy)] font-semibold italic">
                Find where the systems don&apos;t exist, build them, and make them scale.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Contact CTA */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[color:var(--surface)] rounded-3xl p-12 md:p-16 shadow-[var(--shadow-soft)] border border-[color:var(--border)] text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--navy)] mb-10 font-display">
              Let&apos;s talk.
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:kyle@naughtrip.com"
                className="inline-flex items-center gap-3 px-6 py-4 bg-[color:var(--navy)] text-white rounded-full font-bold hover:opacity-90 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                kyle@naughtrip.com
              </a>

              <a
                href="https://linkedin.com/in/kylenaughtrip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-[color:var(--border)] text-[color:var(--navy)] rounded-full font-bold hover:border-[color:var(--navy)]/30 hover:shadow-md transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
