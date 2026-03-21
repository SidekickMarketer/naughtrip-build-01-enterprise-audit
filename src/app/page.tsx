"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   CountUp – animates a number from 0 to target when in view
───────────────────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      const increment = to / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= to) {
          setCount(to);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, to]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {count}
      {suffix && (
        <span className="text-2xl md:text-3xl text-gray-400 ml-1 font-medium -translate-y-1">
          {suffix}
        </span>
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[color:var(--navy)] leading-[1.1] tracking-tight font-display">
              Hi, I&apos;m Kyle Naughtrip.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg md:text-xl text-[color:var(--navy)] font-semibold max-w-xl leading-relaxed"
          >
            I build marketing platforms inside complex, multi-brand organizations going through growth transitions.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-lg md:text-xl text-[color:var(--muted)] max-w-xl leading-relaxed"
          >
            Apex Intermediaries has the programs, the carriers, and the relationships. With marketing leadership now spanning all three divisions, there&apos;s a clear opportunity to connect the digital experience. One digital platform, one set of marketing tools, one way to measure what&apos;s working. This site is a working proposal for how to build it.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-sm text-[color:var(--muted)]/70 italic max-w-xl"
          >
            Note: This is an outside-in view built from public sources, website audits, and inferred stack signals. A full internal audit will refine assumptions in the opening phase.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="flex flex-col items-start gap-4"
          >
            <Link href="/roadmap">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-[color:var(--navy)] text-white px-8 py-4 rounded-full text-base font-bold hover:opacity-95 transition-all shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-0.5 group"
              >
                See the Strategic Roadmap
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-[color:var(--surface)] shadow-2xl shadow-gray-200/50 border border-[color:var(--border)]">
            <Image
              src="/kyle.jpeg"
              alt="Kyle Naughtrip"
              width={600}
              height={600}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────────
   Stats Section
───────────────────────────────────────────────────────────── */
function StatsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="bg-[color:var(--navy)] rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden"
      >
        {/* Header */}
        <div className="relative z-10 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div variants={itemVariants} className="max-w-3xl">
              <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 block">
                The Digital Gap
              </span>
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-none font-display tracking-tight">
                83%
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 font-medium mb-6 max-w-2xl leading-snug">
                of agents say they&apos;d write more business with carriers who provide real-time appetite and quoting within their management systems.
              </p>
              <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
                $20B+ in premiums. 400+ carriers. 190 programs. 3 divisions. 11 web properties ready to become one platform.
              </p>
              <p className="text-gray-200 text-base font-medium max-w-2xl mt-3">
                Digital experience drives agent adoption. Agent adoption drives premium volume.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="bg-[#252830] rounded-2xl p-8 border border-white/5 hover:border-[color:var(--teal)]/30 transition-colors duration-300 group"
          >
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 group-hover:text-gray-300 transition-colors">
              Agent Friction
            </h3>
            <div className="text-5xl md:text-6xl font-semibold text-white mb-4 tracking-tighter tabular-nums">
              <CountUp to={12} suffix="+" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              web properties across 3 divisions, each with its own brand, navigation, and tools. Connecting them into one digital platform gives agents a single path to place business across all programs.
              <span className="block text-xs text-gray-500 mt-2">Source: Digital Presence Audit, Feb 2026</span>
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="bg-[#252830] rounded-2xl p-8 border border-white/5 hover:border-[color:var(--teal)]/30 transition-colors duration-300 group"
          >
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 group-hover:text-gray-300 transition-colors">
              The Revenue Engine
            </h3>
            <div className="text-5xl md:text-6xl font-semibold text-white mb-4 tracking-tighter tabular-nums">
              $<CountUp to={20} suffix="B+" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              in premiums placed across Apex Programs, Atlas Specialty Group, and Apex Wholesale, making it one of the largest insurance intermediaries globally.
              <span className="block text-xs text-gray-500 mt-2">Source: Parent Company FY2025 Earnings</span>
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="bg-[#252830] rounded-2xl p-8 border border-white/5 hover:border-[color:var(--teal)]/30 transition-colors duration-300 group"
          >
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 group-hover:text-gray-300 transition-colors">
              High-Margin Business
            </h3>
            <div className="text-5xl md:text-6xl font-semibold text-white mb-4 tracking-tighter tabular-nums">
              <CountUp to={43} suffix="%" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              profit margin. When the business is this profitable, building the right digital platform to help agents find and sell programs pays off fast.
              <span className="block text-xs text-gray-500 mt-2">Source: Parent Company Q3 2025 Earnings</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="mt-10 text-xs text-gray-500">
          <Link href="/appendix" className="hover:text-gray-300 transition-colors underline underline-offset-2">
            Data sources: IVANS Agency-Carrier Connectivity Report (2024), Parent Company Earnings (Q3-Q4 2025), Digital Presence Audit
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Project Card
───────────────────────────────────────────────────────────── */
interface ProjectCardProps {
  number: string;
  category: string;
  title: string;
  description: string;
  variant: "dark" | "light";
  linkText?: string;
  index: number;
  href: string;
}

function ProjectCard({
  number,
  category,
  title,
  description,
  variant,
  linkText = "Explore",
  index,
  href,
}: ProjectCardProps) {
  const isDark = variant === "dark";

  return (
    <Link href={href} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className={`
          relative p-8 md:p-10 rounded-3xl flex flex-col transition-all duration-300 group h-full
          ${
            isDark
              ? "bg-[color:var(--navy)] text-white shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:shadow-gray-900/20"
              : "bg-[color:var(--surface)] text-[color:var(--navy)] border border-[color:var(--border)] shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/80 hover:border-gray-200"
          }
        `}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border
              ${isDark ? "bg-white/5 text-white border-white/10" : "bg-[color:var(--surface-2)] text-[color:var(--navy)] border-[color:var(--border)]"}
            `}
          >
            {number}
          </div>
          <span
            className={`
              text-xs font-bold tracking-widest uppercase
              ${isDark ? "text-gray-400" : "text-[color:var(--muted)]"}
            `}
          >
            {category}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold mb-4 font-display">{title}</h3>

        <p
          className={`
            mb-8 text-base leading-relaxed
            ${isDark ? "text-gray-300" : "text-[color:var(--muted)]"}
          `}
        >
          {description}
        </p>

        <div className="mt-auto">
          <div
            className={`
              flex items-center gap-2 text-sm font-bold transition-colors
              ${isDark ? "text-white group-hover:text-[color:var(--teal-light)]" : "text-[color:var(--navy)] group-hover:text-[color:var(--teal)]"}
            `}
          >
            {linkText}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   Projects Section
───────────────────────────────────────────────────────────── */
function ProjectsSection() {
  return (
    <section id="projects-section" className="px-4 md:px-8 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-4"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[color:var(--navy)] font-display">
          What&apos;s inside.
        </h2>
        <p className="text-xl text-[color:var(--muted)] max-w-2xl mx-auto">
          A strategic roadmap, a digital health dashboard, a working content engine, and the background to back it up.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 md:gap-8">
        <ProjectCard
          index={0}
          number="1"
          category="Strategy"
          title="Strategic Roadmap"
          description="Audit, architect, execute. A 30/60/90-day action plan plus Year One direction with concrete deliverables at every phase."
          variant="dark"
          linkText="See the plan"
          href="/roadmap"
        />

        <ProjectCard
          index={1}
          number="2"
          category="Analytics"
          title="Platform Health"
          description="Tracks digital performance and marketing tool coverage across all three Apex Intermediaries divisions."
          variant="light"
          linkText="See the dashboard"
          href="/platform-health"
        />

        <ProjectCard
          index={2}
          number="3"
          category="Content System"
          title="Content Engine"
          description="A working AI demo that drafts insurance marketing content across lines of business. Select a program, get a compliant first draft in seconds."
          variant="light"
          linkText="See how it works"
          href="/tool"
        />

        <ProjectCard
          index={3}
          number="4"
          category="Context"
          title="Why Kyle"
          description="How experience at Uber, a $100M+ B2B rebuild, and founding two companies maps directly to what this role requires."
          variant="light"
          linkText="See my background"
          href="/about"
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Final CTA Section
───────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="px-4 md:px-8 pb-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-3xl bg-[color:var(--navy)] p-8 text-white shadow-2xl shadow-gray-900/20 sm:p-10 lg:p-12 relative overflow-hidden"
      >
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              Let&apos;s talk.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <motion.a
              href="mailto:kyle@naughtrip.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[color:var(--navy)] shadow-lg transition-shadow hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Email me</span>
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/kylenaughtrip"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-[color:var(--bg)]">
      <Hero />
      <StatsSection />
      <ProjectsSection />
      <FinalCTA />
    </div>
  );
}
