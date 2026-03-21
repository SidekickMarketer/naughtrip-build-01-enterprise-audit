"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, LayoutGroup } from "framer-motion";
import platformHealthData from "../../../data/platform-health-data.json";

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);


const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

/* ─────────────────────────────────────────────
   TYPE DEFINITIONS
───────────────────────────────────────────── */
type DivisionName = "Programs" | "Atlas" | "Wholesale" | "Parent";

interface WebProperty {
  name: string;
  url: string;
  division: DivisionName;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  lcp_ms: number;
  cls: number;
  tbt_ms: number;
}

interface PropertyMarTech {
  name: string;
  url: string;
  division: DivisionName;
  platform: string;
  pageBuilder: string;
  hubspot: boolean;
  hubspotPortal?: string;
  ga4: boolean;
  oneTrust: boolean;
}


interface WebsiteAudit {
  name: string;
  url: string;
  division: DivisionName;
  hasWebsite: boolean;
  hasAnalytics: boolean;
  hasFacebookPixel: boolean;
  hasSchemaMarkup: boolean;
  hasContactForm: boolean;
  hasClearCta: boolean;
  hasPhoneVisible: boolean;
  hasSocialLinks: boolean;
  socialPlatforms: string[];
  websitePlatform: string;
  websiteQualityScore: number;
  auditSummary: string;
  usedAnthropicSummary: boolean;
  fetchSource: string | null;
}

const webProperties = platformHealthData.webProperties as WebProperty[];
const propertyMarTech = platformHealthData.propertyMarTech as PropertyMarTech[];

const websiteAudits = (platformHealthData.websiteAudits || []) as WebsiteAudit[];
const dataRefreshDate = new Date(platformHealthData.updatedAt);
const dataRefreshLabel = Number.isNaN(dataRefreshDate.getTime())
  ? "Unknown"
  : dataRefreshDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

/* ─────────────────────────────────────────────
   COMPUTED VALUES
───────────────────────────────────────────── */
const avgPerformance = Math.round(webProperties.reduce((s, p) => s + p.performance, 0) / webProperties.length);
const avgSeo = Math.round(webProperties.reduce((s, p) => s + p.seo, 0) / webProperties.length);
const sitesFailingLcp = webProperties.filter((p) => p.lcp_ms > 2500).length;


const hubspotCount = propertyMarTech.filter((p) => p.hubspot).length;
const ga4Count = propertyMarTech.filter((p) => p.ga4).length;
const uniqueBuilders = new Set(propertyMarTech.map((p) => p.pageBuilder).filter((b) => b !== "N/A")).size;
const noAnalytics = propertyMarTech.filter((p) => !p.ga4 && !p.hubspot).length;


const avgAuditScore = websiteAudits.length
  ? (websiteAudits.reduce((sum, site) => sum + site.websiteQualityScore, 0) / websiteAudits.length).toFixed(1)
  : "0.0";
const auditSiteCount = websiteAudits.length;
const analyticsCoverage = websiteAudits.filter((site) => site.hasAnalytics).length;
const schemaCoverage = websiteAudits.filter((site) => site.hasSchemaMarkup).length;
const pixelCoverage = websiteAudits.filter((site) => site.hasFacebookPixel).length;


/* ─────────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────────── */
function DivisionBadge({ division }: { division: DivisionName }) {
  const styles: Record<DivisionName, { bg: string; text: string; dot: string }> = {
    "Programs": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    "Atlas": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    "Wholesale": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    Parent: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
  };
  const s = styles[division];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {division}
    </span>
  );
}

function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const color = score >= 90 ? "text-emerald-700 bg-emerald-50" : score >= 50 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold ${color}`}>
      {score}
      {label && <span className="font-medium opacity-70">{label}</span>}
    </span>
  );
}

function StatCard({ label, value, sublabel, delay = 0 }: { label: string; value: string; sublabel?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 border border-[color:var(--border)] shadow-sm"
    >
      <div className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-wider mb-3">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold text-[color:var(--navy)] tracking-tight">
          {value}
        </div>
      </div>
      {sublabel && (
        <div className="text-xs text-[color:var(--muted)] mt-2">{sublabel}</div>
      )}
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function XIcon() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

/* ─────────────────────────────────────────────
   Section Nav (Sticky, like Roadmap)
───────────────────────────────────────────── */
type SectionId = "properties" | "martech" | "audit";

function SectionNav() {
  const [activeSection, setActiveSection] = useState<SectionId>("properties");

  useEffect(() => {
    const sections: SectionId[] = ["properties", "martech", "audit"];
    const offset = 300;

    const handleScroll = () => {
      let found = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < offset) {
            setActiveSection(sections[i]);
            found = true;
            return;
          }
        }
      }
      if (!found) {
        setActiveSection("properties");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const items: { id: SectionId; label: string; color: string }[] = [
    { id: "properties", label: "Web Properties", color: "bg-gradient-to-r from-[color:var(--teal)] to-amber-500" },
    { id: "martech", label: "Marketing Tools", color: "bg-gradient-to-r from-blue-700 to-blue-500" },
    { id: "audit", label: "Website Audit", color: "bg-gradient-to-r from-amber-700 to-[color:var(--teal)]" },
  ];

  return (
    <div className="sticky top-24 z-30 mb-16 px-4 pointer-events-none">
      <div className="max-w-fit mx-auto bg-white/80 backdrop-blur-md border border-[color:var(--border)] shadow-lg shadow-gray-900/5 rounded-full p-1.5 pointer-events-auto">
        <LayoutGroup>
          <div className="flex flex-wrap items-center justify-center gap-1">
            {items.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-[color:var(--muted)] hover:text-[color:var(--navy)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className={`absolute inset-0 ${item.color} shadow-sm rounded-full`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PlatformHealthPage() {
  return (
    <div className="pt-32 pb-24 bg-[color:var(--bg)] min-h-screen">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--teal)]/10 text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase border border-[color:var(--teal)]/20 mb-6">
              <TrendingUpIcon className="w-3 h-3" />
              Digital Analytics
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[color:var(--navy)] leading-[1.1] tracking-tight font-display">
              Platform Health
            </h1>

            <p className="text-lg md:text-xl text-[color:var(--muted)] max-w-xl leading-relaxed">
              Apex Intermediaries&apos; three divisions each built strong digital presences independently. This dashboard maps the current state across all properties, showing where standardization and consolidation would have the biggest impact on agent adoption and premium volume.
            </p>

            <p className="text-sm text-[color:var(--muted)]/70 italic max-w-xl">
              Note: This is an outside-in audit using Google PageSpeed, website source analysis, and public data. Some findings may not match what&apos;s true internally. That&apos;s expected. The first 30 days is about verifying what&apos;s actually in place. Apex Wholesale is included in this baseline; some newly integrated properties may still be missing.
            </p>
          </motion.div>

          {/* Why This Matters Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="bg-[color:var(--navy)] rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6 block">
                  Why This Matters
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                  11 websites. {uniqueBuilders} page builders. Every one a different experience for agents and brokers.
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Each division built its own digital world. That&apos;s natural for the parent company&apos;s acquisition-led model. But as competitors like Ryan Specialty (RT Connector) and AmWINS invest in single-portal experiences, there&apos;s a clear opportunity to bring it all together. This dashboard uses real Lighthouse scores and technology detection to show where consolidation creates the most value.
                </p>

              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </div>

        <SectionNav />

        {/* Web Properties */}
        <div id="properties" className="scroll-mt-48 mb-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--navy)] mb-3 font-display">Web Properties</h2>
            <p className="text-[color:var(--muted)] text-lg max-w-2xl">Lighthouse performance, SEO, and mobile load speed across all 11 properties.</p>
          </div>
          <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <StatCard label="Avg Performance" value={`${avgPerformance}/100`} sublabel="Google considers <50 &quot;poor&quot;" delay={0} />
                <StatCard label="Properties Audited" value="11" sublabel="Across 3 divisions + parent" delay={0.1} />
                <StatCard label="Failing LCP" value={`${sitesFailingLcp}/11`} sublabel="All exceed Google's 2.5s threshold" delay={0.2} />
                <StatCard label="Avg SEO Score" value={`${avgSeo}/100`} sublabel="Strongest category across portfolio" delay={0.3} />
              </div>

              {/* Mobile Load Speed — the hero visual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[color:var(--border)] mb-12"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[color:var(--navy)] mb-2 font-display">
                    Mobile Load Speed Across All Properties
                  </h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    How long agents and brokers wait for each site to load on mobile. Google considers under 2.5 seconds &quot;good.&quot; Every Apex Intermediaries property exceeds this by 2–9x.
                  </p>
                </div>

                <div className="space-y-3">
                  {[...webProperties].sort((a, b) => b.lcp_ms - a.lcp_ms).map((p, i) => {
                    const maxLcp = 25000;
                    const pct = Math.min((p.lcp_ms / maxLcp) * 100, 100);
                    const barColor = p.lcp_ms > 15000 ? "bg-red-500" : p.lcp_ms > 10000 ? "bg-amber-500" : "bg-amber-400";
                    return (
                      <motion.div
                        key={p.url}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-44 shrink-0 text-sm font-medium text-[color:var(--navy)] truncate">{p.name}</div>
                        <div className="flex-1 h-6 bg-[color:var(--surface-2)] rounded-full overflow-hidden relative">
                          <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                          <div className="absolute left-[10%] top-0 h-full w-px bg-emerald-500/40" title="2.5s good threshold" />
                        </div>
                        <div className="w-16 text-right text-sm font-bold text-red-600">{(p.lcp_ms / 1000).toFixed(1)}s</div>
                      </motion.div>
                    );
                  })}
                  <div className="flex items-center gap-4 pt-2 text-xs text-[color:var(--muted)]">
                    <div className="w-44" />
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-px bg-emerald-500" />
                      2.5s &quot;good&quot; threshold
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Lighthouse Scores Table (trimmed) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[color:var(--border)] mb-12"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[color:var(--navy)] mb-2 font-display">
                    Digital Health by Property
                  </h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    Performance, SEO, and load speed across all Apex Intermediaries web properties. Scores: <span className="text-emerald-600 font-medium">90+</span> good, <span className="text-amber-600 font-medium">50–89</span> needs improvement, <span className="text-red-600 font-medium">&lt;50</span> poor.
                  </p>
                  <p className="text-xs text-[color:var(--muted)]/70 mt-2 italic">
                    Data from Google PageSpeed API. Last refresh: {dataRefreshLabel}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[color:var(--border)] text-xs uppercase tracking-wider text-[color:var(--muted)]">
                      <tr>
                        <th className="px-3 py-4 font-bold">Property</th>
                        <th className="px-3 py-4 font-bold">Division</th>
                        <th className="px-3 py-4 font-bold text-center">Performance</th>
                        <th className="px-3 py-4 font-bold text-center">SEO</th>
                        <th className="px-3 py-4 font-bold text-right">Load Speed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--border)]">
                      {webProperties.map((p, i) => (
                        <motion.tr
                          key={p.url}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.04 }}
                          className="hover:bg-[color:var(--surface-2)] transition-colors"
                        >
                          <td className="px-3 py-4">
                            <div className="font-bold text-[color:var(--navy)] text-sm">{p.name}</div>
                            <div className="text-xs text-[color:var(--muted)]">{p.url}</div>
                          </td>
                          <td className="px-3 py-4">
                            <DivisionBadge division={p.division} />
                          </td>
                          <td className="px-3 py-4 text-center"><ScoreBadge score={p.performance} /></td>
                          <td className="px-3 py-4 text-center"><ScoreBadge score={p.seo} /></td>
                          <td className="px-3 py-4 text-right">
                            <span className={`text-sm font-bold ${p.lcp_ms > 2500 ? "text-red-600" : "text-emerald-600"}`}>
                              {(p.lcp_ms / 1000).toFixed(1)}s
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

          </div>
        </div>

        {/* Marketing Tools */}
        <div id="martech" className="scroll-mt-48 mb-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--navy)] mb-3 font-display">Marketing Tools</h2>
            <p className="text-[color:var(--muted)] text-lg max-w-2xl">Marketing automation, analytics, and page-builder deployment across all properties.</p>
          </div>
          <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <StatCard label="Marketing Automation" value={`${hubspotCount}/11`} sublabel="HubSpot on 2 separate portals" delay={0} />
                <StatCard label="Google Analytics" value={`${ga4Count}/11`} sublabel="Every one a different property ID" delay={0.1} />
                <StatCard label="Page Builders" value={`${uniqueBuilders}`} sublabel="Different systems across 11 sites" delay={0.2} />
                <StatCard label="No Analytics" value={`${noAnalytics}`} sublabel="Sites with no analytics found" delay={0.3} />
              </div>

              {/* MarTech Stack Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[color:var(--border)] mb-12"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[color:var(--navy)] mb-2 font-display">
                    Technology Deployment Matrix
                  </h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    Identified from each site&apos;s public HTML source code — scanning for platform markers, tracking scripts, and page-builder signatures anyone can verify
                  </p>
                  <p className="text-xs text-[color:var(--muted)]/70 mt-2 italic">
                    Data from live website signal analysis. Last refresh: {dataRefreshLabel}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[color:var(--border)] text-xs uppercase tracking-wider text-[color:var(--muted)]">
                      <tr>
                        <th className="px-3 py-4 font-bold">Property</th>
                        <th className="px-3 py-4 font-bold">Platform</th>
                        <th className="px-3 py-4 font-bold">Page Builder</th>
                        <th className="px-3 py-4 font-bold text-center">HubSpot</th>
                        <th className="px-3 py-4 font-bold text-center">GA4</th>
                        <th className="px-3 py-4 font-bold text-center">OneTrust</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--border)]">
                      {propertyMarTech.map((p, i) => (
                        <motion.tr
                          key={p.url}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.04 }}
                          className="hover:bg-[color:var(--surface-2)] transition-colors"
                        >
                          <td className="px-3 py-4">
                            <div className="font-bold text-[color:var(--navy)] text-sm">{p.name}</div>
                            <div className="text-xs text-[color:var(--muted)]">{p.url}</div>
                          </td>
                          <td className="px-3 py-4 text-[color:var(--muted)] text-sm">{p.platform}</td>
                          <td className="px-3 py-4 text-[color:var(--muted)] text-sm">{p.pageBuilder}</td>
                          <td className="px-3 py-4 text-center">
                            {p.hubspot ? <CheckIcon /> : <XIcon />}
                          </td>
                          <td className="px-3 py-4 text-center">
                            {p.ga4 ? <CheckIcon /> : <XIcon />}
                          </td>
                          <td className="px-3 py-4 text-center">
                            {p.oneTrust ? <CheckIcon /> : <XIcon />}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>


          </div>
        </div>

        {/* Website Audit */}
        <div id="audit" className="scroll-mt-48 mb-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--navy)] mb-3 font-display">Website Audit</h2>
            <p className="text-[color:var(--muted)] text-lg max-w-2xl">Conversion readiness, analytics coverage, and retargeting signals across all properties.</p>
          </div>
          <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <StatCard label="Avg Quality Score" value={`${avgAuditScore}/10`} sublabel="Composite website readiness score" delay={0} />
                <StatCard label="Analytics Coverage" value={`${analyticsCoverage}/${auditSiteCount}`} sublabel="GA/GTM or analytics script detected" delay={0.1} />
                <StatCard label="Schema Coverage" value={`${schemaCoverage}/${auditSiteCount}`} sublabel="Structured data discovered in source" delay={0.2} />
                <StatCard label="Meta Pixel" value={`${pixelCoverage}/${auditSiteCount}`} sublabel="Retargeting capability detected" delay={0.3} />
              </div>

              {/* Audit Matrix */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[color:var(--border)] mb-12"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[color:var(--navy)] mb-2 font-display">
                    Audit Matrix
                  </h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    Source-level signal checks for conversion readiness and measurement coverage.
                  </p>
                  <p className="text-xs text-[color:var(--muted)]/70 mt-2 italic">
                    Data from website source-level signal analysis. Last refresh: {dataRefreshLabel}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[color:var(--border)] text-xs uppercase tracking-wider text-[color:var(--muted)]">
                      <tr>
                        <th className="px-3 py-4 font-bold">Property</th>
                        <th className="px-3 py-4 font-bold text-center">Score</th>
                        <th className="px-3 py-4 font-bold">Platform</th>
                        <th className="px-3 py-4 font-bold text-center">Analytics</th>
                        <th className="px-3 py-4 font-bold text-center">Pixel</th>
                        <th className="px-3 py-4 font-bold text-center">Schema</th>
                        <th className="px-3 py-4 font-bold text-center">CTA</th>
                        <th className="px-3 py-4 font-bold text-center">Form</th>
                        <th className="px-3 py-4 font-bold">Social</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--border)]">
                      {[...websiteAudits]
                        .sort((a, b) => a.websiteQualityScore - b.websiteQualityScore)
                        .map((site, i) => (
                          <motion.tr
                            key={site.url}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            className="hover:bg-[color:var(--surface-2)] transition-colors"
                          >
                            <td className="px-3 py-4">
                              <div className="font-bold text-[color:var(--navy)] text-sm">{site.name}</div>
                              <div className="text-xs text-[color:var(--muted)]">{site.url}</div>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <ScoreBadge score={Math.round((site.websiteQualityScore / 10) * 100)} label={`${site.websiteQualityScore}/10`} />
                            </td>
                            <td className="px-3 py-4 text-[color:var(--muted)] text-sm">{site.websitePlatform}</td>
                            <td className="px-3 py-4 text-center">{site.hasAnalytics ? <CheckIcon /> : <XIcon />}</td>
                            <td className="px-3 py-4 text-center">{site.hasFacebookPixel ? <CheckIcon /> : <XIcon />}</td>
                            <td className="px-3 py-4 text-center">{site.hasSchemaMarkup ? <CheckIcon /> : <XIcon />}</td>
                            <td className="px-3 py-4 text-center">{site.hasClearCta ? <CheckIcon /> : <XIcon />}</td>
                            <td className="px-3 py-4 text-center">{site.hasContactForm ? <CheckIcon /> : <XIcon />}</td>
                            <td className="px-3 py-4 text-xs text-[color:var(--muted)]">
                              {site.socialPlatforms.length > 0 ? site.socialPlatforms.join(", ") : "None"}
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>


          </div>
        </div>


        {/* Bottom CTA */}
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
                From visibility to action.
              </h2>
              <p className="text-gray-400 text-lg">
                This dashboard is one layer of the strategic roadmap. See how the content engine and full strategy connect.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/tool"
                className="flex items-center justify-center gap-2 bg-white text-[color:var(--navy)] px-8 py-4 rounded-full text-base font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Content Engine
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/roadmap"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-base font-bold border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
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
