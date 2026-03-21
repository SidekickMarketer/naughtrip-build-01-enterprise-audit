"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import platformData from "../../../data/platform-health-data.json";

/* ─── SVG Icon Components ─── */
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

/* ─── Types ─── */
type SortColumn = "priority" | "techDebt" | "brandOverlap" | "migrationEase" | "agentImpact" | "trafficEst";
type SortDirection = "asc" | "desc";

interface ConsolidationProperty {
  url: string;
  name: string;
  division: string;
  techDebt: number;
  brandOverlap: number;
  migrationEase: number;
  agentImpact: number;
  trafficEst: number;
}

interface Weights {
  techDebt: number;
  brandOverlap: number;
  migrationEase: number;
  agentImpact: number;
  trafficEst: number;
}

/* ─── Constants ─── */
const DIVISION_COLORS: Record<string, string> = {
  "Apex Programs": "#182A53",
  "Atlas Specialty": "#c5923a",
  "Apex Wholesale": "#7D796D",
  Parent: "#4a7c59",
};

const DIVISION_BG: Record<string, string> = {
  "Apex Programs": "rgba(24, 42, 83, 0.04)",
  "Atlas Specialty": "rgba(197, 146, 58, 0.06)",
  "Apex Wholesale": "rgba(125, 121, 109, 0.05)",
  Parent: "rgba(74, 124, 89, 0.05)",
};

const CONSOLIDATION_DATA: ConsolidationProperty[] = [
  { url: "apex-programs.com", name: "Apex Programs", division: "Apex Programs", techDebt: 55, brandOverlap: 40, migrationEase: 70, agentImpact: 85, trafficEst: 80 },
  { url: "apex-exchange.com", name: "Apex Exchange", division: "Apex Programs", techDebt: 60, brandOverlap: 15, migrationEase: 10, agentImpact: 100, trafficEst: 90 },
  { url: "apex-group.com", name: "Apex General Insurance", division: "Apex Programs", techDebt: 65, brandOverlap: 90, migrationEase: 75, agentImpact: 50, trafficEst: 45 },
  { url: "protector-plans.com", name: "Protector Plans", division: "Apex Programs", techDebt: 35, brandOverlap: 30, migrationEase: 65, agentImpact: 60, trafficEst: 35 },
  { url: "western-markets.com", name: "Western Markets", division: "Apex Programs", techDebt: 90, brandOverlap: 70, migrationEase: 80, agentImpact: 40, trafficEst: 25 },
  { url: "atlas-specialty.com", name: "Atlas Specialty Group", division: "Atlas Specialty", techDebt: 45, brandOverlap: 20, migrationEase: 60, agentImpact: 75, trafficEst: 70 },
  { url: "summit-brokers.com", name: "Summit Brokers", division: "Atlas Specialty", techDebt: 55, brandOverlap: 50, migrationEase: 70, agentImpact: 55, trafficEst: 40 },
  { url: "summit-brokerage.com", name: "Summit Brokerage", division: "Atlas Specialty", techDebt: 20, brandOverlap: 50, migrationEase: 75, agentImpact: 45, trafficEst: 30 },
  { url: "apex-wholesale.com", name: "Apex Wholesale", division: "Apex Wholesale", techDebt: 55, brandOverlap: 35, migrationEase: 55, agentImpact: 70, trafficEst: 65 },
  { url: "pacific-insurance.com", name: "Pacific Insurance Group", division: "Apex Wholesale", techDebt: 55, brandOverlap: 45, migrationEase: 70, agentImpact: 40, trafficEst: 30 },
  { url: "apex-intermediaries.com", name: "Apex Intermediaries", division: "Parent", techDebt: 40, brandOverlap: 10, migrationEase: 50, agentImpact: 60, trafficEst: 50 },
];

const PRESETS: { label: string; description: string; weights: Weights }[] = [
  { label: "CIO Priority", description: "Reduce tech debt, ease migration", weights: { techDebt: 40, brandOverlap: 10, migrationEase: 30, agentImpact: 10, trafficEst: 10 } },
  { label: "CMO Priority", description: "Brand consistency, agent experience", weights: { techDebt: 10, brandOverlap: 35, migrationEase: 10, agentImpact: 30, trafficEst: 15 } },
  { label: "Quick Wins", description: "Easiest migrations first", weights: { techDebt: 25, brandOverlap: 15, migrationEase: 45, agentImpact: 10, trafficEst: 5 } },
];

const PROPERTY_TYPES = [
  {
    type: "A",
    label: "Division Landing Pages",
    count: "~3-4 sites",
    examples: "apex-programs.com, atlas-specialty.com, apex-wholesale.com",
    description: "These become section pages of the unified site.",
    color: "#182A53",
    borderColor: "border-l-[#182A53]",
  },
  {
    type: "B",
    label: "Brand & Agency Sites",
    count: "~60-80 estimated",
    examples: "Programs has 29 brands, Atlas has 30. Each acquired agency likely kept its own site.",
    description: "The bulk of the 70% that rolls up.",
    color: "#c5923a",
    borderColor: "border-l-[#c5923a]",
  },
  {
    type: "C",
    label: "Program Microsites",
    count: "~50-100+ estimated",
    examples: "Specialty alone has 115+ programs. Many likely have standalone landing pages.",
    description: "The long tail.",
    color: "#7D796D",
    borderColor: "border-l-[#7D796D]",
  },
  {
    type: "D",
    label: "The Platform",
    count: "1 site",
    examples: "apex-exchange.com. Angular SPA, legacy Java backend.",
    description: "Not a website. An application. Separate track.",
    color: "#5b6abf",
    borderColor: "border-l-[#5b6abf]",
  },
  {
    type: "E",
    label: "Legacy & Zombie Domains",
    count: "~50-100+ estimated",
    examples: "Pre-acquisition domains that still resolve. apex-group.com is an example.",
    description: "Automated discovery and triage.",
    color: "#b04040",
    borderColor: "border-l-[#b04040]",
  },
  {
    type: "F",
    label: "International",
    count: "unknown count",
    examples: "Atlas UK/Europe operations. WPML multilingual already on atlas-specialty.com.",
    description: "Different compliance, different approach.",
    color: "#2d7d6e",
    borderColor: "border-l-[#2d7d6e]",
  },
];

const TIER_DATA = [
  {
    tier: 1,
    title: "Consolidate Now",
    timeline: "Months 1-3",
    items: [
      "western-markets.com \u2192 apex-programs.com (worst performing site, Lighthouse 32, easy WordPress migration)",
      "apex-group.com \u2192 apex-programs.com (highest brand overlap, same HubSpot portal already)",
    ],
    impact: "Eliminates 2 sites, reduces page builder count, unifies Programs brand presence.",
  },
  {
    tier: 2,
    title: "Consolidate During Integration",
    timeline: "Months 3-9",
    items: [
      "apex-wholesale.com \u2192 apex-intermediaries.com/specialty (timing tied to major acquisition integration milestones)",
      "pacific-insurance.com \u2192 apex-intermediaries.com/specialty",
    ],
    impact: "Specialty division gets unified presence as Apex Wholesale brand transitions.",
  },
  {
    tier: 3,
    title: "Atlas Brand Decision",
    timeline: "Months 6-12",
    items: [
      "summit-brokers.com, summit-brokerage.com \u2014 keep distinct or fold into atlas-specialty.com?",
      "28 other Atlas brands not yet audited",
    ],
    impact: "Requires brand strategy decision before migration planning.",
  },
  {
    tier: 4,
    title: "Separate Track: Application Modernization",
    timeline: "Parallel",
    items: [
      "apex-exchange.com \u2014 NOT a website migration. Application platform (Angular + Java). CIO/CTO project.",
      "protector-plans.com \u2014 SSO integration (MiniOrange) requires IT coordination. May stay distinct.",
    ],
    impact: "Marketing provides UX requirements and agent journey data. IT owns the build.",
  },
];

const INTEGRATION_PRINCIPLES = [
  {
    number: "01",
    title: "One Agent, One Record",
    description: "Every touchpoint resolves to a single agent identity in D365. No more 3 sites = 3 unknown visitors.",
  },
  {
    number: "02",
    title: "Marketing Writes, IT Owns",
    description: "Marketing defines logic. IT owns infrastructure, governance, security. No shadow IT.",
  },
  {
    number: "03",
    title: "Microsoft-Native First",
    description: "D365, Power BI, Power Automate before third-party. Leverage existing licenses.",
  },
  {
    number: "04",
    title: "Federated, Not Centralized",
    description: "Same data layer, different customer journeys per division. Programs = self-serve. Atlas = relationship tools. Specialty = consultative nurture.",
  },
  {
    number: "05",
    title: "Designed for Acquisition",
    description: "Every component has a documented onboarding playbook. 43 acquisitions in 2025 means this is permanent, not one-time.",
  },
];

const BEFORE_AFTER = [
  { before: "7 page builders, 11+ sites", after: "1 CMS, unified component library" },
  { before: "3 HubSpot portals + 8 sites with nothing", after: "Single marketing automation connected to D365" },
  { before: "8 separate GA4 properties", after: "1 GA4 property, cross-domain tracking" },
  { before: "Zero web-to-CRM connection", after: "Every visitor matched to D365 contact" },
  { before: "No attribution to bound premium", after: "Full-funnel: impression \u2192 visit \u2192 quote \u2192 bind" },
  { before: "Each acquisition adds another site", after: "Acquisition playbook: 30-day migration template" },
];

/* ─── Fragmentation Diagram Data ─── */
interface FragNode {
  url: string;
  name: string;
  pageBuilder: string;
  hubspot: boolean;
  ga4: boolean;
}

const FRAG_ROWS: { division: string; color: string; nodes: FragNode[] }[] = [
  {
    division: "Apex Programs",
    color: "#182A53",
    nodes: [
      { url: "apex-programs.com", name: "Apex Programs", pageBuilder: "Genesis", hubspot: true, ga4: true },
      { url: "apex-exchange.com", name: "Apex Exchange", pageBuilder: "Angular SPA", hubspot: false, ga4: false },
      { url: "apex-group.com", name: "Apex General Insurance", pageBuilder: "WPBakery", hubspot: true, ga4: true },
      { url: "protector-plans.com", name: "Protector Plans", pageBuilder: "Divi", hubspot: false, ga4: false },
      { url: "western-markets.com", name: "Western Markets", pageBuilder: "WP Default", hubspot: false, ga4: true },
    ],
  },
  {
    division: "Atlas Specialty",
    color: "#c5923a",
    nodes: [
      { url: "atlas-specialty.com", name: "Atlas Specialty Group", pageBuilder: "Genesis", hubspot: false, ga4: true },
      { url: "summit-brokers.com", name: "Summit Brokers", pageBuilder: "BeTheme", hubspot: false, ga4: true },
      { url: "summit-brokerage.com", name: "Summit Brokerage", pageBuilder: "Custom", hubspot: false, ga4: true },
    ],
  },
  {
    division: "Apex Wholesale / Specialty",
    color: "#7D796D",
    nodes: [
      { url: "apex-wholesale.com", name: "Apex Wholesale", pageBuilder: "WPBakery", hubspot: true, ga4: true },
      { url: "pacific-insurance.com", name: "Pacific Insurance Group", pageBuilder: "WPBakery", hubspot: false, ga4: false },
    ],
  },
  {
    division: "Parent",
    color: "#4a7c59",
    nodes: [
      { url: "apex-intermediaries.com", name: "Apex Intermediaries", pageBuilder: "Elementor", hubspot: false, ga4: false },
    ],
  },
];

/* ─── Helper: get lighthouse & martech data for a property ─── */
function getPropertyData(url: string) {
  const lighthouse = platformData.webProperties.find((p) => p.url === url);
  const martech = platformData.propertyMarTech.find((p) => p.url === url);
  return { lighthouse, martech };
}

/* ─── Helper: compute priority score ─── */
function computePriority(prop: ConsolidationProperty, weights: Weights): number {
  return Math.round(
    (prop.techDebt * weights.techDebt +
      prop.brandOverlap * weights.brandOverlap +
      prop.migrationEase * weights.migrationEase +
      prop.agentImpact * weights.agentImpact +
      prop.trafficEst * weights.trafficEst) /
      100
  );
}

/* ─── Main Page Component ─── */
export default function PlatformStrategyPage() {
  const [weights, setWeights] = useState<Weights>({ techDebt: 30, brandOverlap: 25, migrationEase: 20, agentImpact: 15, trafficEst: 10 });
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<SortColumn>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedTiers, setExpandedTiers] = useState<Set<number>>(new Set([1]));

  /* Compute sorted data */
  const sortedData = useMemo(() => {
    const withPriority = CONSOLIDATION_DATA.map((p) => ({
      ...p,
      priority: computePriority(p, weights),
    }));

    return withPriority.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [weights, sortColumn, sortDirection]);

  /* Handle weight change */
  const handleWeightChange = (key: keyof Weights, value: number) => {
    setActivePreset(null);
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  /* Handle preset */
  const applyPreset = (index: number) => {
    setActivePreset(index);
    setWeights(PRESETS[index].weights);
  };

  /* Handle sort */
  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortColumn(col);
      setSortDirection("desc");
    }
  };

  /* Toggle row expansion */
  const toggleRow = (url: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  /* Toggle tier expansion */
  const toggleTier = (tier: number) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  /* Weight total for display */
  const weightTotal = weights.techDebt + weights.brandOverlap + weights.migrationEase + weights.agentImpact + weights.trafficEst;

  return (
    <div className="pt-32 pb-24 bg-[color:var(--bg)] min-h-screen">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">

        {/* ════════════════════════════════════════════════════════════
            SECTION 1: Hero
        ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase border border-[color:var(--teal)]/20">
              <LayersIcon className="w-3 h-3" />
              SYSTEMS INTEGRATION
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--navy)] leading-[1.08] tracking-tight font-display">
              200+ Properties. One Architecture. A Prioritized Path Forward.
            </h1>

            <p className="text-lg md:text-xl text-[color:var(--muted)] max-w-xl leading-relaxed">
              This page maps the current fragmentation across Apex&apos;s web properties, scores each for consolidation priority, and shows the target architecture that turns 200+ scattered sites into one unified platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="bg-[color:var(--navy)] rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-8 block">
                  The Scale
                </span>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: "200+", label: "Websites across the organization" },
                    { value: "7", label: "Different page builders across 11 audited" },
                    { value: "4", label: "Sites with zero analytics" },
                    { value: "0", label: "Unified agent identity" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-3xl md:text-4xl font-bold font-display text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400 leading-snug">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2: Property Type Breakdown
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="kicker text-[color:var(--teal)] mb-4 block">PROPERTY TAXONOMY</span>
            <h2 className="h2 text-[color:var(--navy)]">The 200+ categorized by type</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTY_TYPES.map((pt, i) => (
              <motion.div
                key={pt.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-[color:var(--border)] border-l-4 ${pt.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold"
                    style={{ backgroundColor: pt.color }}
                  >
                    {pt.type}
                  </span>
                  <div>
                    <div className="font-semibold text-[color:var(--navy)] text-sm">{pt.label}</div>
                    <div className="text-xs text-[color:var(--muted)]">{pt.count}</div>
                  </div>
                </div>
                <p className="text-sm text-[color:var(--muted)] leading-relaxed mb-3">{pt.examples}</p>
                <p className="text-sm font-semibold text-[color:var(--navy)] italic">&ldquo;{pt.description}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3: Current State — Tech Fragmentation
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="kicker text-[color:var(--teal)] mb-4 block">CURRENT STATE</span>
            <h2 className="h2 text-[color:var(--navy)]">Tech fragmentation across 11 audited properties</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg shadow-gray-200/50 border border-[color:var(--border)]">
            <div className="space-y-8 overflow-x-auto">
              {FRAG_ROWS.map((row) => (
                <div key={row.division}>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="text-sm font-bold text-[color:var(--navy)]">{row.division}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {row.nodes.map((node) => (
                      <div
                        key={node.url}
                        className="bg-[color:var(--surface-2)] rounded-2xl p-4 border border-[color:var(--border)] min-w-[200px] flex-1 max-w-[260px]"
                      >
                        <div className="text-xs font-bold text-[color:var(--navy)] mb-1 truncate">
                          {node.name}
                        </div>
                        <div className="text-[10px] text-[color:var(--muted)] mb-3 truncate">{node.url}</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                            style={{
                              backgroundColor: `${row.color}12`,
                              borderColor: `${row.color}30`,
                              color: row.color,
                            }}
                          >
                            {node.pageBuilder}
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              node.hubspot
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}
                          >
                            {node.hubspot ? (
                              <CheckIcon className="w-2.5 h-2.5" />
                            ) : (
                              <XIcon className="w-2.5 h-2.5" />
                            )}
                            HS
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              node.ga4
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}
                          >
                            {node.ga4 ? (
                              <CheckIcon className="w-2.5 h-2.5" />
                            ) : (
                              <XIcon className="w-2.5 h-2.5" />
                            )}
                            GA4
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Callout box */}
            <div className="mt-8 bg-[color:var(--navy)]/5 border border-[color:var(--navy)]/10 rounded-2xl p-6">
              <p className="text-sm text-[color:var(--navy)] font-semibold leading-relaxed">
                No unified agent identity. An agent visiting 3 different sites exists as 3 unknown visitors. No cross-property attribution. No way to know which marketing touchpoint drove a bound premium.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4: Consolidation Priority Matrix (Interactive)
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="kicker text-[color:var(--teal)] mb-4 block">INTERACTIVE TOOL</span>
            <h2 className="h2 text-[color:var(--navy)]">Consolidation Priority Matrix</h2>
            <p className="text-[color:var(--muted)] mt-3 max-w-2xl mx-auto">
              Adjust the weights to see how prioritization changes based on what matters most. Click any row to see full audit data.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg shadow-gray-200/50 border border-[color:var(--border)]">
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    activePreset === i
                      ? "bg-[color:var(--navy)] text-white border-[color:var(--navy)] shadow-md"
                      : "bg-white text-[color:var(--navy)] border-[color:var(--border)] hover:bg-[color:var(--surface-2)] hover:border-[color:var(--muted)]/30"
                  }`}
                >
                  {preset.label}
                  <span className="ml-2 text-xs opacity-60">{preset.description}</span>
                </button>
              ))}
            </div>

            {/* Weight Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 p-6 bg-[color:var(--surface-2)] rounded-2xl border border-[color:var(--border)]">
              {([
                { key: "techDebt" as const, label: "Tech Debt" },
                { key: "brandOverlap" as const, label: "Brand Overlap" },
                { key: "migrationEase" as const, label: "Migration Ease" },
                { key: "agentImpact" as const, label: "Agent Impact" },
                { key: "trafficEst" as const, label: "Traffic Est." },
              ]).map((dim) => (
                <div key={dim.key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[color:var(--navy)] uppercase tracking-wider">
                      {dim.label}
                    </label>
                    <span className="text-xs font-bold text-[color:var(--teal)]">{weights[dim.key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={weights[dim.key]}
                    onChange={(e) => handleWeightChange(dim.key, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #c5923a 0%, #c5923a ${weights[dim.key]}%, #e5e2dc ${weights[dim.key]}%, #e5e2dc 100%)`,
                    }}
                  />
                </div>
              ))}
              <div className="sm:col-span-2 lg:col-span-5 text-right">
                <span className={`text-xs font-semibold ${weightTotal === 100 ? "text-emerald-600" : "text-amber-600"}`}>
                  Total: {weightTotal}% {weightTotal !== 100 && "(adjust to 100% for accurate scoring)"}
                </span>
              </div>
            </div>

            {/* Sortable Table */}
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-[color:var(--border-strong)]">
                    {([
                      { col: "priority" as SortColumn, label: "Priority" },
                      { col: null, label: "Property" },
                      { col: "techDebt" as SortColumn, label: "Tech Debt" },
                      { col: "brandOverlap" as SortColumn, label: "Brand Overlap" },
                      { col: "migrationEase" as SortColumn, label: "Migration Ease" },
                      { col: "agentImpact" as SortColumn, label: "Agent Impact" },
                      { col: "trafficEst" as SortColumn, label: "Traffic" },
                    ]).map((header) => (
                      <th
                        key={header.label}
                        className={`pb-3 pr-4 text-xs font-bold text-[color:var(--muted)] uppercase tracking-widest ${
                          header.col ? "cursor-pointer hover:text-[color:var(--navy)] transition-colors select-none" : ""
                        } ${header.label === "Priority" ? "w-20" : ""}`}
                        onClick={() => header.col && handleSort(header.col)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {header.label}
                          {header.col && sortColumn === header.col && (
                            <ChevronDownIcon
                              className={`w-3 h-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {sortedData.map((prop) => {
                      const isExpanded = expandedRows.has(prop.url);
                      const { lighthouse, martech } = getPropertyData(prop.url);
                      return (
                        <motion.tr
                          key={prop.url}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-[color:var(--border)] cursor-pointer hover:bg-[color:var(--surface-2)]/50 transition-colors"
                          style={{ backgroundColor: isExpanded ? DIVISION_BG[prop.division] : undefined }}
                          onClick={() => toggleRow(prop.url)}
                        >
                          <td className="py-3.5 pr-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[color:var(--navy)] text-white text-sm font-bold shadow-sm">
                              {prop.priority}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: DIVISION_COLORS[prop.division] }}
                              />
                              <div>
                                <div className="text-sm font-semibold text-[color:var(--navy)]">{prop.name}</div>
                                <div className="text-[11px] text-[color:var(--muted)]">{prop.url}</div>
                              </div>
                              <ChevronDownIcon
                                className={`w-4 h-4 text-[color:var(--muted)] ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 text-sm text-[color:var(--navy)] font-medium">{prop.techDebt}</td>
                          <td className="py-3.5 pr-4 text-sm text-[color:var(--navy)] font-medium">{prop.brandOverlap}</td>
                          <td className="py-3.5 pr-4 text-sm text-[color:var(--navy)] font-medium">{prop.migrationEase}</td>
                          <td className="py-3.5 pr-4 text-sm text-[color:var(--navy)] font-medium">{prop.agentImpact}</td>
                          <td className="py-3.5 pr-4 text-sm text-[color:var(--navy)] font-medium">{prop.trafficEst}</td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Expanded Row Details (rendered outside table for proper layout) */}
              {sortedData.map((prop) => {
                const isExpanded = expandedRows.has(prop.url);
                const { lighthouse, martech } = getPropertyData(prop.url);

                return (
                  <AnimatePresence key={`detail-${prop.url}`}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="p-6 border-b border-[color:var(--border)] rounded-b-xl"
                          style={{ backgroundColor: DIVISION_BG[prop.division] }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Lighthouse Scores */}
                            {lighthouse && (
                              <div>
                                <h4 className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-widest mb-3">
                                  Lighthouse Scores
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  {[
                                    { label: "Performance", value: lighthouse.performance },
                                    { label: "SEO", value: lighthouse.seo },
                                    { label: "Accessibility", value: lighthouse.accessibility },
                                    { label: "Best Practices", value: lighthouse.bestPractices },
                                  ].map((metric) => (
                                    <div key={metric.label} className="bg-white/60 rounded-xl p-3 border border-[color:var(--border)]">
                                      <div className="text-[11px] text-[color:var(--muted)] mb-1">{metric.label}</div>
                                      <div
                                        className={`text-xl font-bold ${
                                          metric.value >= 90
                                            ? "text-emerald-600"
                                            : metric.value >= 50
                                            ? "text-amber-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {metric.value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {lighthouse.lcp_ms && (
                                  <div className="mt-3 text-xs text-[color:var(--muted)]">
                                    LCP: {(lighthouse.lcp_ms / 1000).toFixed(1)}s &middot; CLS: {lighthouse.cls} &middot; TBT: {lighthouse.tbt_ms}ms
                                  </div>
                                )}
                              </div>
                            )}

                            {/* MarTech Stack */}
                            {martech && (
                              <div>
                                <h4 className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-widest mb-3">
                                  MarTech Stack
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between bg-white/60 rounded-xl p-3 border border-[color:var(--border)]">
                                    <span className="text-xs text-[color:var(--muted)]">Platform</span>
                                    <span className="text-xs font-semibold text-[color:var(--navy)]">{martech.platform}</span>
                                  </div>
                                  <div className="flex items-center justify-between bg-white/60 rounded-xl p-3 border border-[color:var(--border)]">
                                    <span className="text-xs text-[color:var(--muted)]">Page Builder</span>
                                    <span className="text-xs font-semibold text-[color:var(--navy)]">{martech.pageBuilder}</span>
                                  </div>
                                  <div className="flex items-center justify-between bg-white/60 rounded-xl p-3 border border-[color:var(--border)]">
                                    <span className="text-xs text-[color:var(--muted)]">HubSpot</span>
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${martech.hubspot ? "text-emerald-600" : "text-red-500"}`}>
                                      {martech.hubspot ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                                      {martech.hubspot ? `Yes (Portal ${martech.hubspotPortal})` : "None"}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between bg-white/60 rounded-xl p-3 border border-[color:var(--border)]">
                                    <span className="text-xs text-[color:var(--muted)]">GA4</span>
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${martech.ga4 ? "text-emerald-600" : "text-red-500"}`}>
                                      {martech.ga4 ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                                      {martech.ga4 ? "Active" : "None"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 5: Migration Tiers
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="kicker text-[color:var(--teal)] mb-4 block">MIGRATION PLAN</span>
            <h2 className="h2 text-[color:var(--navy)]">Four tiers, sequenced by dependency</h2>
          </div>

          <div className="space-y-4">
            {TIER_DATA.map((tier) => {
              const isOpen = expandedTiers.has(tier.tier);
              return (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-[color:var(--border)] overflow-hidden"
                >
                  <button
                    onClick={() => toggleTier(tier.tier)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-[color:var(--surface-2)]/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="step-badge flex-shrink-0">{tier.tier}</span>
                      <div>
                        <div className="font-semibold text-[color:var(--navy)] text-lg font-display">
                          Tier {tier.tier} &mdash; {tier.title}
                        </div>
                        <div className="text-xs text-[color:var(--muted)] mt-0.5">{tier.timeline}</div>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-[color:var(--muted)] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                          <div className="border-t border-[color:var(--border)] pt-6 space-y-3">
                            {tier.items.map((item, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm text-[color:var(--navy)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--teal)] mt-2 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </div>
                            ))}
                            <div className="mt-4 bg-[color:var(--surface-2)] rounded-xl p-4 border border-[color:var(--border)]">
                              <span className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-widest">Impact</span>
                              <p className="text-sm text-[color:var(--navy)] mt-1 font-medium">{tier.impact}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 6: Future State Architecture
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="kicker text-[color:var(--teal)] mb-4 block">TARGET STATE</span>
            <h2 className="h2 text-[color:var(--navy)]">Four-layer architecture</h2>
            <p className="text-[color:var(--muted)] mt-3 max-w-2xl mx-auto">
              A Microsoft-native stack where each layer has a clear owner and every agent touchpoint connects to one data foundation.
            </p>
          </div>

          <div className="space-y-3">
            {/* Layer 1: Data Foundation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[color:var(--navy)] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-white text-[10px] font-bold">1</span>
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Data Foundation</span>
                  <span className="ml-auto text-[10px] text-gray-500 uppercase tracking-wider font-semibold">CIO/CTO Domain</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["D365 (CRM/CDP)", "Power BI (Reporting)", "Dataverse (Data Store)", "App Insights (Telemetry)"].map((item) => (
                    <div key={item} className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
                      <span className="text-sm font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>

            {/* Connection arrow */}
            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-[color:var(--navy)] to-[color:var(--navy)]/30" />
            </div>

            {/* Layer 2: Integration Layer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[color:var(--navy)]/90 rounded-3xl p-8 md:p-10 text-white shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-white text-[10px] font-bold">2</span>
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Integration Layer</span>
                <span className="ml-auto text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Shared Ownership</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["D365 Customer Insights Journeys", "Power Automate", "Exchange API", "Agent Onboarding API"].map((item) => (
                  <div key={item} className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
                    <span className="text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Connection arrow */}
            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-[color:var(--navy)]/30 to-[color:var(--teal)]/40" />
            </div>

            {/* Layer 3: MarTech Execution */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-gray-200/50 border border-[color:var(--border)]"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--teal)] text-white text-[10px] font-bold">3</span>
                <span className="text-xs font-bold tracking-widest uppercase text-[color:var(--teal)]">MarTech Execution</span>
                <span className="ml-auto text-[10px] text-[color:var(--muted)] uppercase tracking-wider font-semibold">VP Digital Marketing Domain</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {["Unified CMS", "Unified GA4", "Email Marketing", "Social Management", "Content/DAM", "SEO/AEO Tools"].map((item) => (
                  <div key={item} className="bg-[color:var(--surface-2)] rounded-xl p-4 text-center border border-[color:var(--border)]">
                    <span className="text-sm font-semibold text-[color:var(--navy)]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Connection arrow */}
            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-[color:var(--border)] to-[color:var(--muted)]/20" />
            </div>

            {/* Layer 4: Agent Touchpoints */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[color:var(--surface-2)] rounded-3xl p-8 md:p-10 border border-[color:var(--border)]"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--muted)] text-white text-[10px] font-bold">4</span>
                <span className="text-xs font-bold tracking-widest uppercase text-[color:var(--muted)]">Agent Touchpoints</span>
                <span className="ml-auto text-[10px] text-[color:var(--muted)] uppercase tracking-wider font-semibold">Distribution</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {["apex-intermediaries.com", "Apex Exchange", "Comparative Raters", "Email / LinkedIn", "Agent Portal"].map((item) => (
                  <div key={item} className="bg-white rounded-xl p-4 text-center border border-[color:var(--border)] shadow-sm">
                    <span className="text-sm font-semibold text-[color:var(--navy)]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 7: Five Integration Principles
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="kicker text-[color:var(--teal)] mb-4 block">GUIDING PRINCIPLES</span>
            <h2 className="h2 text-[color:var(--navy)]">Five integration principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTEGRATION_PRINCIPLES.map((principle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-[color:var(--border)] ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span className="text-3xl font-bold font-display text-[color:var(--teal)]/30 block mb-3">
                  {principle.number}
                </span>
                <h3 className="text-lg font-bold text-[color:var(--navy)] mb-3 font-display">
                  &ldquo;{principle.title}&rdquo;
                </h3>
                <p className="text-sm text-[color:var(--muted)] leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 8: Before/After Table
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="kicker text-[color:var(--teal)] mb-4 block">TRANSFORMATION</span>
            <h2 className="h2 text-[color:var(--navy)]">Today vs. Year One</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg shadow-gray-200/50 border border-[color:var(--border)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="border-b-2 border-[color:var(--border-strong)]">
                    <th className="pb-4 pr-8 text-xs font-bold text-red-500/70 uppercase tracking-widest w-1/2">Today</th>
                    <th className="pb-4 text-xs font-bold text-emerald-600/70 uppercase tracking-widest w-1/2">Year One</th>
                  </tr>
                </thead>
                <tbody>
                  {BEFORE_AFTER.map((row, i) => (
                    <tr key={i} className="border-b border-[color:var(--border)] last:border-b-0">
                      <td className="py-4 pr-8 text-sm text-[color:var(--muted)]">{row.before}</td>
                      <td className="py-4 text-sm text-[color:var(--navy)] font-medium">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 9: Bottom CTA
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[color:var(--navy)] rounded-3xl p-12 md:p-16 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[color:var(--teal)]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
                The architecture is one piece. See the full picture.
              </h2>
              <p className="text-gray-400 text-lg">
                Explore the full roadmap to see how this architecture comes to life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/roadmap"
                className="flex items-center justify-center gap-2 bg-white text-[color:var(--navy)] px-8 py-4 rounded-full text-base font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Strategic Roadmap
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
