"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Search,
  Lightbulb,
  Star,
  Map,
  Hammer,
  Rocket,
  GitMerge,
  BarChart3,
  Settings,
  Eye,
} from "lucide-react";


/* ─────────────────────────────────────────────────────────────
   Progress Navigation (Sticky)
───────────────────────────────────────────────────────────── */
function ProgressNav() {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const phases = ["phase-1", "phase-2", "phase-3", "beyond-90"];
      const offset = 300;

      for (const phase of phases) {
        const element = document.getElementById(phase);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < offset && rect.bottom > offset) {
            setActivePhase(phase);
            return;
          }
        }
      }

      const p1 = document.getElementById("phase-1");
      if (p1 && p1.getBoundingClientRect().top > offset) {
        setActivePhase(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPhase = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const phases = [
    {
      id: "phase-1",
      label: "Phase 1",
      sub: "Days 1–30",
      activeColor: "bg-gradient-to-r from-[color:var(--teal)] to-amber-500",
    },
    {
      id: "phase-2",
      label: "Phase 2",
      sub: "Days 31–60",
      activeColor: "bg-gradient-to-r from-blue-700 to-blue-500",
    },
    {
      id: "phase-3",
      label: "Phase 3",
      sub: "Days 61–90",
      activeColor: "bg-gradient-to-r from-amber-700 to-[color:var(--teal)]",
    },
    {
      id: "beyond-90",
      label: "Beyond 90",
      sub: "Days 91+",
      activeColor: "bg-gradient-to-r from-[color:var(--navy)] to-[color:var(--teal)]",
    },
  ];

  return (
    <div className="sticky top-24 z-30 mb-16 px-4 pointer-events-none">
      <div className="max-w-fit mx-auto bg-white/80 backdrop-blur-md border border-[color:var(--border)] shadow-lg shadow-gray-900/5 rounded-full p-1.5 pointer-events-auto">
        <div className="flex items-center gap-1">
          {phases.map((phase) => {
            const isActive = activePhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => scrollToPhase(phase.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-white" : "text-[color:var(--muted)] hover:text-[color:var(--navy)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePhase"
                    className={`absolute inset-0 ${phase.activeColor} shadow-sm rounded-full`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 leading-none">
                  <span className="font-bold">{phase.label}</span>
                  <span
                    className={`text-[10px] uppercase tracking-wider ${
                      isActive ? "text-white/80" : "text-[color:var(--muted)]"
                    }`}
                  >
                    {phase.sub}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function RoadmapPage() {
  return (
    <div className="pt-32 pb-24 bg-[color:var(--bg)] min-h-screen">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase border border-[color:var(--teal)]/20">
              <Target className="w-3 h-3" />
              Strategy
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[color:var(--navy)] leading-[1.1] tracking-tight font-display">
              Strategic Roadmap
            </h1>

            <p className="text-lg md:text-xl text-[color:var(--muted)] max-w-xl leading-relaxed">
              A 90-day action plan, then the long-term build. Each phase has concrete deliverables and a clear handoff to the next.
            </p>
          </motion.div>

          {/* The Approach - Dark Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="bg-[color:var(--navy)] rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6 block">
                  The Approach
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                  Audit, architect, execute. Systems first.
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Every acquisition-led organization has built digital systems independently — that&apos;s natural. The approach is to understand what exists, design a standard that respects how each division operates, and prove the value with measurable results before scaling. Benchmarks and visibility from day one.
                </p>

              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Progress Navigation */}
        <ProgressNav />

        {/* ==================== PHASE 1 ==================== */}
        <div id="phase-1" className="mb-32 scroll-mt-48">
          <div className="mb-12">
            <span className="text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase mb-3 block">
              Phase 1: Days 1–30
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--navy)] mb-4 font-display">
              Audit the Digital Landscape
            </h2>
            <p className="text-[color:var(--muted)] text-lg max-w-2xl">
              Understand how digital marketing actually works across 3 divisions before proposing changes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* What I'll Learn */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[color:var(--surface)] rounded-3xl p-8 md:p-10 border border-[color:var(--border)] shadow-lg shadow-gray-200/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[color:var(--navy)] text-white flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--navy)]">What I&apos;ll Learn</h3>
                  <p className="text-sm text-[color:var(--muted)]">Discovery and understanding</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Meet the leaders across Apex Programs, Atlas Specialty, and Apex Wholesale.",
                  "Audit all 11 web properties and social channels for SEO health, performance, and user experience.",
                  "Map the current marketing stack: Dynamics 365, Power BI, GA4, App Insights, plus current marketing automation (HubSpot on 3/11 properties) and existing project management tools.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[color:var(--muted)] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--navy)] mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What I'll Identify */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[color:var(--teal)] to-amber-500 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-[color:var(--teal)]/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">What I&apos;ll Identify</h3>
                  <p className="text-sm text-white/80">Key insights and opportunities</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Which digital touchpoints agents and brokers actually use vs. ignore.",
                  "Gaps between Apex Exchange and competitor platforms like RT Connector and AmWINS IQ.",
                  "How lead capture and submission routing works today — from web form to CRM to assignment to quote.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/95 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>

        {/* ==================== PHASE 2 ==================== */}
        <div id="phase-2" className="mb-32 scroll-mt-48">
          <div className="mb-12">
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3 block">
              Phase 2: Days 31–60
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--navy)] mb-4 font-display">
              Design the Standard
            </h2>
            <p className="text-[color:var(--muted)] text-lg max-w-2xl">
              One set of standards for how digital marketing runs across all 3 divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* What I'll Design */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[color:var(--surface)] rounded-3xl p-8 md:p-10 border border-[color:var(--border)] shadow-lg shadow-gray-200/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[color:var(--navy)] text-white flex items-center justify-center">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--navy)]">What I&apos;ll Design</h3>
                  <p className="text-sm text-[color:var(--muted)]">The playbook</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "One digital playbook covering brand standards, content rules, analytics, and marketing automation.",
                  "How the existing technology stack connects into one measurement system — including what to do with the HubSpot deployments already in place.",
                  "A content approach that can scale across 190 programs while keeping compliance built in.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[color:var(--muted)] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--navy)] mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What I'll Establish */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-700/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">What I&apos;ll Propose</h3>
                  <p className="text-sm text-white/80">For alignment and buy-in</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Shared KPIs and OKRs across all 3 divisions, aligned with division leadership.",
                  "A content workflow that includes Legal and Regulatory from the start, not as a bottleneck at the end.",
                  "Integration priorities: which web properties to consolidate first, which to preserve.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/95 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>

        {/* ==================== PHASE 3 ==================== */}
        <div id="phase-3" className="mb-32 scroll-mt-48">
          <div className="mb-12">
            <span className="text-amber-700 text-xs font-bold tracking-widest uppercase mb-3 block">
              Phase 3: Days 61–90
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--navy)] mb-4 font-display">
              Launch and Measure
            </h2>
            <p className="text-[color:var(--muted)] text-lg max-w-2xl">
              Execute the first initiatives and build real-time visibility into digital performance across all 3 divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* What I'll Measure */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[color:var(--surface)] rounded-3xl p-8 md:p-10 border border-[color:var(--border)] shadow-lg shadow-gray-200/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[color:var(--navy)] text-white flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--navy)]">What I&apos;ll Measure</h3>
                  <p className="text-sm text-[color:var(--muted)]">Metrics and tracking</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Stand up an initial measurement baseline using existing analytics — GA4, email metrics, and social data — to show what's working before the full Dynamics 365 integration.",
                  "Track agent digital engagement, content performance, and brand consistency scores by division.",
                  "Identify areas of friction from pilot initiatives and prioritize quick fixes.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[color:var(--muted)] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--navy)] mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What I'll Present */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-amber-700 to-[color:var(--teal)] rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-amber-700/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">What I&apos;ll Present</h3>
                  <p className="text-sm text-white/80">Results and next steps</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Review dashboard results and pilot findings with the executive team and division heads.",
                  "Highlight where pilot programs are already moving the needle and where they need adjustment.",
                  "Lay out the Year One roadmap for the full buildout.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/95 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>

        {/* ==================== BEYOND 90 DAYS ==================== */}
        <div id="beyond-90" className="scroll-mt-48">
          <div className="bg-[color:var(--navy)] rounded-3xl p-12 pb-10 md:p-16 md:pb-12 text-white shadow-2xl shadow-gray-900/30 relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[color:var(--teal)]/20 to-amber-700/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-blue-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-[color:var(--teal-light)] text-xs font-bold tracking-widest uppercase mb-3 block">
                    Beyond 90 Days
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
                    Scale and Connect
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl">
                    The rest of Year One focuses on connecting the Dynamics 365 stack and scaling what works. As E&amp;S market growth moderates after seven consecutive years of double-digit expansion, the advantage shifts to operational excellence.
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: GitMerge,
                    title: "Connect the Measurement Stack",
                    desc: "Link Dynamics 365 and Dataverse to Power BI for full-funnel visibility — from digital touchpoint through policy outcome.",
                    gradient: "from-[color:var(--teal)] to-amber-500",
                  },
                  {
                    icon: Settings,
                    title: "Resolve Marketing Automation",
                    desc: "Evaluate the path forward: consolidate existing HubSpot, migrate to Customer Insights – Journeys within Dynamics 365, or run a phased hybrid.",
                    gradient: "from-blue-700 to-blue-500",
                  },
                  {
                    icon: BarChart3,
                    title: "Executive Dashboard",
                    desc: "Deliver a Power BI dashboard showing agent engagement, content performance, and digital health by division — shared KPIs across the organization.",
                    gradient: "from-amber-700 to-[color:var(--teal)]",
                  },
                  {
                    icon: Map,
                    title: "Extend to Apex Wholesale Properties",
                    desc: "Roll out the digital playbook to Apex Wholesale-acquired properties as they come online through the integration timeline.",
                    gradient: "from-purple-700 to-indigo-500",
                  },
                  {
                    icon: TrendingUp,
                    title: "SEO, AEO & GEO Strategy",
                    desc: "Deploy consistent search optimization across all properties — traditional SEO plus Answer Engine and Generative Engine optimization.",
                    gradient: "from-[color:var(--teal)] to-blue-500",
                  },
                  {
                    icon: Star,
                    title: "Attribution Tracking",
                    desc: "Build toward end-to-end measurement: content to agent engagement to submission to bound premium, connected through GA4 Measurement Protocol and Dynamics 365.",
                    gradient: "from-amber-500 to-amber-700",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors duration-300"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-white/10">
                <Link
                  href="/platform-health"
                  className="flex items-center gap-2 bg-white text-[color:var(--navy)] px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors shadow-xl min-w-[200px] justify-center"
                >
                  See Platform Health
                </Link>
                <Link
                  href="/tool"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-sm font-bold border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all min-w-[200px] justify-center"
                >
                  See Content Engine
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
