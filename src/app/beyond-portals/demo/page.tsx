"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

/* ─── Brand ─── */
const B = {
  navy: "#1b2a51",
  green: "#1A6B3D",
  greenLight: "#E8F5ED",
  greenBorder: "#B8E0C8",
  amber: "#D97706",
  amberLight: "#FEF3C7",
  amberBorder: "#FDE68A",
  bg: "#F8F9FB",
  surface: "#FFFFFF",
  surface2: "#F3F4F6",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  light: "#9CA3AF",
};

/* ─── Icons ─── */
const ApexMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 94 91" className={className || "w-5 h-5"} fill="none">
    <polygon fill="#1b2a51" points="46.84 30.16 33.48 67.71 41.17 77.11 41.17 90.88 0 90.88 35.03 0 46.84 0 58.66 0 46.84 30.16" />
    <polygon fill="#9b9889" points="52.51 90.88 93.68 90.88 58.65 0 58.65 0 58.65 0 46.84 0 46.84 0 35.03 0 35.02 0 46.84 30.16 60.2 67.71 52.51 77.11 52.51 90.88" />
  </svg>
);

/* ─── Mock Sidebar Data ─── */
const MOCK_RECENT = [
  { id: 1, title: "Cannabis — CO", status: "Matched", color: "#D97706" },
  { id: 2, title: "School District — WA", status: "Pre-Qualified", color: "#3B82F6" },
  { id: 3, title: "Trucking Fleet — TX", status: "Application Started", color: "#8B5CF6" },
  { id: 4, title: "Contractor GL — FL", status: "Submitted", color: "#9CA3AF" },
  { id: 5, title: "Restaurant Chain — CA", status: "Bound", color: "#16A34A" },
];

const MOCK_PROGRAMS = [
  { name: "Workers' Comp", active: true },
  { name: "BOP", active: true },
  { name: "General Liability", active: true },
  { name: "Commercial Property", active: true },
  { name: "Cyber", active: false },
  { name: "Umbrella", active: false },
];

const MOCK_BOOK = { policies: 47, premium: "$1.2M", renewals: 8 };

/* ─── Mock Scenario Data (static demo screens) ─── */
type MockStage = "matched" | "pre_qualified" | "application_started" | "submitted" | "bound";

type MockScenario = {
  id: number;
  query: string;
  stage: MockStage;
  banner: { title: string; subtitle: string; bg: string; border: string; iconBg: string };
  matches: ProgramMatch[];
  crossSell: CrossSellItem[];
  preQual: string[];
  preQualAnswers: Record<number, string>;
};

const MOCK_SCENARIOS: Record<number, MockScenario> = {
  /* ── 1. MATCHED — just searched, got initial results ── */
  1: {
    id: 1,
    query: "My client runs a cannabis dispensary in Colorado and needs a full coverage package.",
    stage: "matched",
    banner: {
      title: "Programs Matched",
      subtitle: "Complete the appetite check below to confirm fit and see additional coverage options",
      bg: "#FEF3C7", border: "#FDE68A", iconBg: "#D97706",
    },
    matches: [
      { program: "Cannabis Business Package", division: "Apex Wholesale — Cannabis", confidence: "bridge", premium: "$35,000 – $55,000", detail: "Dispensary package: property, GL, product liability, and crop coverage" },
      { program: "General Liability", division: "Apex Programs", confidence: "possible", premium: "$12,000 – $18,000", detail: "Standard GL may exclude cannabis operations — specialist review required" },
    ],
    crossSell: [
      { coverage: "Product Liability", division: "Apex Wholesale", reason: "Covers third-party claims from cannabis products sold" },
      { coverage: "Crime / Employee Dishonesty", division: "Apex Programs", reason: "Cash-heavy operations with high theft exposure" },
    ],
    preQual: ["Current state license number and type (medical/recreational/both)?", "Annual revenue and number of employees?", "Any product liability claims in the past 5 years?"],
    preQualAnswers: {},
  },

  /* ── 2. PRE-QUALIFIED — answered questionnaire, cross-sell revealed ── */
  2: {
    id: 2,
    query: "I need to place property and liability coverage for a mid-size school district in Washington state.",
    stage: "pre_qualified",
    banner: {
      title: "Appetite Confirmed",
      subtitle: "Pre-qualification complete — review your options and start your application when ready",
      bg: "#EFF6FF", border: "#BFDBFE", iconBg: "#3B82F6",
    },
    matches: [
      { program: "Public Entity Property", division: "Apex Programs — Public Entity", confidence: "likely", premium: "$75,000 – $120,000", detail: "12-building campus, TIV $85M — earthquake sublimit applies in WA" },
      { program: "School Board Liability", division: "Apex Programs — Public Entity", confidence: "strong", premium: "$25,000 – $40,000", detail: "E&O, D&O, and employment practices for elected/appointed officials" },
    ],
    crossSell: [
      { coverage: "Cyber Liability", division: "Apex Programs", reason: "Student data, FERPA compliance, ransomware exposure" },
      { coverage: "Educators Legal Liability", division: "Apex Programs", reason: "Individual educator protection — abuse & molestation sublimit" },
    ],
    preQual: ["Total number of students and staff?", "Claims history for the past 5 years?", "Current carrier and expiration date?"],
    preQualAnswers: { 0: "4,200 students, 380 staff", 1: "2 GL claims (both under $50K), no property claims", 2: "Current with State Fund, expires 07/01/2026" },
  },

  /* ── 3. APPLICATION STARTED — filling out the full app ── */
  3: {
    id: 3,
    query: "I have a client with a 15-truck fleet in Texas. They need workers' comp, commercial auto, and cargo coverage.",
    stage: "application_started",
    banner: {
      title: "Application In Progress",
      subtitle: "Transportation Division · 3 of 5 sections complete",
      bg: "#F3E8FF", border: "#DDD6FE", iconBg: "#8B5CF6",
    },
    matches: [
      { program: "Workers' Compensation", division: "Apex Programs — Transportation", confidence: "strong", premium: "$45,000 – $65,000", detail: "Class codes 7219/7228 — fleet operations with clean 3-year loss history qualifies for experience mod credit" },
      { program: "Commercial Auto — Fleet", division: "Apex Programs — Transportation", confidence: "strong", premium: "$85,000 – $120,000", detail: "15-unit fleet, long-haul TX corridors. Radius and cargo type determine final rate" },
      { program: "Motor Truck Cargo", division: "Apex Programs — Transportation", confidence: "strong", premium: "$8,000 – $15,000", detail: "Cargo coverage based on commodity type and max load value" },
    ],
    crossSell: [
      { coverage: "Umbrella / Excess", division: "Apex Programs", reason: "Required for fleet operations — $1M–$5M layer" },
      { coverage: "Physical Damage", division: "Apex Programs", reason: "Comprehensive and collision for owned units" },
    ],
    preQual: ["Years in business and DOT number?", "Any losses over $25,000 in the past 3 years?", "Driver MVR summary available?"],
    preQualAnswers: { 0: "8 years, DOT #2847193", 1: "No losses over $25K", 2: "All drivers clean MVRs — provided to underwriting" },
  },

  /* ── 4. SUBMITTED — app sent, waiting for quote ── */
  4: {
    id: 4,
    query: "General contractor in Florida, mostly residential builds, about $3M annual revenue. Need GL and whatever else they should carry.",
    stage: "submitted",
    banner: {
      title: "Application Submitted — Awaiting Quote",
      subtitle: "Construction Division · Submitted Feb 22, 2026 · Estimated response: 1–2 business days",
      bg: "#F3F4F6", border: "#E5E7EB", iconBg: "#9CA3AF",
    },
    matches: [
      { program: "General Liability", division: "Apex Programs — Construction", confidence: "strong", premium: "$18,000 – $28,000", detail: "Class code 91580 — residential GC, $3M revenue, subcontractor management" },
      { program: "Workers' Compensation", division: "Apex Programs — Construction", confidence: "strong", premium: "$32,000 – $48,000", detail: "FL construction class codes — experience mod driven, payroll-based" },
    ],
    crossSell: [
      { coverage: "Builders Risk", division: "Apex Programs", reason: "Project-specific coverage for active residential builds" },
      { coverage: "Commercial Auto", division: "Apex Programs", reason: "Company vehicles for job site travel" },
      { coverage: "Umbrella / Excess", division: "Apex Programs", reason: "Required by most general contracts — $1M–$5M layer" },
    ],
    preQual: [],
    preQualAnswers: {},
  },

  /* ── 5. BOUND — policy issued, the finish line ── */
  5: {
    id: 5,
    query: "Restaurant chain, 3 locations in California. Need a BOP to start but want to know everything else they should carry.",
    stage: "bound",
    banner: {
      title: "Bound — Policy #AH-BOP-2026-1182",
      subtitle: "Effective 03/01/2026 · Annual premium $42,500 · Small Commercial Division",
      bg: "#E8F5ED", border: "#B8E0C8", iconBg: "#1A6B3D",
    },
    matches: [
      { program: "Business Owners Policy (BOP)", division: "Apex Programs — Small Commercial", confidence: "strong", premium: "$28,000 – $35,000", detail: "3-location restaurant package — property, GL, and business income combined" },
      { program: "Workers' Compensation", division: "Apex Programs", confidence: "strong", premium: "$22,000 – $38,000", detail: "Restaurant class codes 9082/9083 — experience mod and payroll-based" },
      { program: "Liquor Liability", division: "Apex Programs", confidence: "likely", premium: "$4,500 – $7,500", detail: "Required — alcohol revenue exceeds 30% at all 3 locations" },
    ],
    crossSell: [
      { coverage: "Cyber Liability", division: "Apex Programs", reason: "POS systems and customer payment data across 3 locations" },
      { coverage: "EPLI", division: "Apex Programs", reason: "Multi-location with 40+ employees — high exposure" },
    ],
    preQual: [],
    preQualAnswers: {},
  },
};

/* ─── Prompt Chips ─── */
const CHIPS = [
  { label: "Trucking fleet — full coverage", prompt: "I have a client with a 15-truck fleet in Texas. They need workers' comp, commercial auto, and cargo coverage." },
  { label: "Current producer — round my accounts", prompt: "I'm an existing Apex producer. I currently write workers' comp and BOP through you. I mostly work with small to mid-size contractors and restaurants in Florida. What else should I be writing with you?" },
  { label: "Restaurant chain — BOP + everything", prompt: "Restaurant chain, 3 locations in California. Need a BOP to start but want to know everything else they should carry." },
  { label: "Commercial property — declined twice", prompt: "My client has a $5M commercial property that's been declined by two carriers. It's in an earthquake zone in California." },
  { label: "Cannabis dispensary — full package", prompt: "My client runs a cannabis dispensary in Colorado and needs a full coverage package." },
  { label: "School district — property & liability", prompt: "I need to place property and liability coverage for a mid-size school district in Washington state." },
];

const FOLLOW_UPS = [
  "Start the quote on the primary coverage",
  "What about cyber for this client?",
  "What other lines should they carry?",
  "How do I get appointed?",
];

/* ─── Types ─── */
type Message = { role: "user" | "assistant"; content: string };

type ProgramMatch = {
  program: string;
  division: string;
  confidence: "strong" | "likely" | "possible" | "bridge";
  premium?: string;
  detail: string;
};

type CrossSellItem = {
  coverage: string;
  division: string;
  reason: string;
};

type ParsedResult = {
  matches: ProgramMatch[];
  crossSell: CrossSellItem[];
  preQual: string[];
  fullText: string;
};

/* ─── Response Parser ─── */
function parseResponse(content: string): ParsedResult {
  const matches: ProgramMatch[] = [];
  const crossSell: CrossSellItem[] = [];
  const preQual: string[] = [];

  // Split into sections by ## headers
  const sections = content.split(/(?=^##\s)/m);

  for (const section of sections) {
    const lower = section.toLowerCase();

    // Primary match section
    if (lower.includes("primary match") || lower.includes("match:") || (lower.includes("→") && !lower.includes("expand") && !lower.includes("cross-sell") && !lower.includes("additional"))) {
      // Extract program lines: **Name** → Division
      const programLines = section.match(/\*\*([^*]+)\*\*\s*→\s*([^\n(]+)/g);
      if (programLines) {
        for (const line of programLines) {
          const m = line.match(/\*\*([^*]+)\*\*\s*→\s*(.+)/);
          if (m) {
            const program = m[1].trim();
            const divisionRaw = m[2].trim();
            const division = divisionRaw.replace(/\*\*/g, "").replace(/\(.*?\)/, "").trim();

            // Get confidence from surrounding context
            let confidence: ProgramMatch["confidence"] = "strong";
            const afterProgram = section.substring(section.indexOf(line));
            const afterLower = afterProgram.toLowerCase();
            if (afterLower.includes("likely fit")) confidence = "likely";
            else if (afterLower.includes("possible") || afterLower.includes("may")) confidence = "possible";
            if (lower.includes("bridge") && division.toLowerCase().includes("bridge")) confidence = "bridge";

            // Get premium
            const premiumMatch = afterProgram.match(/\$[\d,.]+[KkMm]?\s*[-–—]\s*\$[\d,.]+[KkMm]?/);

            // Get detail line (first bullet after the program)
            const detailMatch = afterProgram.match(/[-•]\s+([^\n]+)/);

            matches.push({
              program,
              division,
              confidence,
              premium: premiumMatch?.[0],
              detail: detailMatch?.[1]?.replace(/\*\*/g, "").trim() || "",
            });
          }
        }
      }
    }

    // Cross-sell / Expand section
    if (lower.includes("expand") || lower.includes("cross-sell") || lower.includes("additional") || lower.includes("also need") || lower.includes("gaps")) {
      const items = section.match(/[-•]\s*\*\*([^*]+)\*\*\s*→\s*([^—–\n]+)(?:[—–]\s*(.+))?/g);
      if (items) {
        for (const item of items) {
          const m = item.match(/[-•]\s*\*\*([^*]+)\*\*\s*→\s*([^—–\n]+)(?:[—–]\s*(.+))?/);
          if (m) {
            crossSell.push({
              coverage: m[1].trim(),
              division: m[2].replace(/\*\*/g, "").trim(),
              reason: m[3]?.trim() || "",
            });
          }
        }
      }
    }

    // Pre-qual section
    if (lower.includes("pre-qual") || lower.includes("quick check") || lower.includes("before we") || lower.includes("quick question")) {
      const questions = section.match(/\d+\.\s*\*?\*?([^\n]+)/g);
      if (questions) {
        for (const q of questions) {
          const cleaned = q.replace(/^\d+\.\s*\*?\*?/, "").replace(/\*\*/g, "").trim();
          if (cleaned.length > 5) preQual.push(cleaned);
        }
      }
    }
  }

  return { matches, crossSell, preQual, fullText: content };
}

/* ─── Confidence Badge ─── */
function ConfidenceBadge({ level }: { level: ProgramMatch["confidence"] }) {
  const config = {
    strong: { label: "Strong Fit", bg: B.green, text: "#fff" },
    likely: { label: "Likely Fit", bg: B.green, text: "#fff" },
    possible: { label: "Possible Fit", bg: B.amber, text: "#fff" },
    bridge: { label: "Specialist Route", bg: B.navy, text: "#fff" },
  }[level];
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: config.bg, color: config.text }}>
      {config.label}
    </span>
  );
}

/* ─── Program Match Card ─── */
function ProgramCard({ match, stage = "discovery" }: { match: ProgramMatch; stage?: "discovery" | MockStage }) {
  const isBridge = match.confidence === "bridge";
  const btn = {
    discovery: { label: isBridge ? "Connect with Specialist" : "Start Quote", bg: isBridge ? B.navy : B.green, disabled: false },
    matched: { label: isBridge ? "Connect with Specialist" : "Start Quote", bg: isBridge ? B.navy : B.green, disabled: false },
    pre_qualified: { label: "Start Application", bg: B.green, disabled: false },
    application_started: { label: "Continue Application", bg: "#8B5CF6", disabled: false },
    submitted: { label: "View Application", bg: B.light, disabled: false },
    bound: { label: "View Policy", bg: B.green, disabled: false },
  }[stage];
  return (
    <div className="rounded-xl overflow-hidden transition-all hover:shadow-md" style={{ border: `1px solid ${isBridge ? B.border : B.greenBorder}`, backgroundColor: B.surface }}>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold truncate" style={{ color: B.navy }}>{match.program}</div>
            <div className="text-xs mt-0.5" style={{ color: B.muted }}>{match.division}</div>
          </div>
          <ConfidenceBadge level={match.confidence} />
        </div>
        {match.detail && <p className="text-xs leading-relaxed" style={{ color: B.muted }}>{match.detail}</p>}
        {match.premium && (
          <div className="text-xs font-semibold" style={{ color: B.navy }}>
            Est. {match.premium}/yr
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <button disabled={btn.disabled} className="flex-1 text-xs font-semibold py-2 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: btn.bg }}>
            {btn.label}
          </button>
          <button className="text-xs font-medium py-2 px-3 rounded-lg" style={{ backgroundColor: B.surface2, color: B.navy }}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Cross-Sell Card ─── */
function CrossSellCard({ item }: { item: CrossSellItem }) {
  return (
    <div className="rounded-lg p-3 transition-all hover:shadow-sm" style={{ border: `1px solid ${B.border}`, backgroundColor: B.surface }}>
      <div className="text-xs font-bold" style={{ color: B.navy }}>{item.coverage}</div>
      <div className="text-[11px] mt-0.5" style={{ color: B.muted }}>{item.division}</div>
      {item.reason && <div className="text-[11px] mt-1.5 leading-relaxed" style={{ color: B.light }}>{item.reason}</div>}
      <button className="mt-2 text-[11px] font-semibold px-3 py-1 rounded-md" style={{ backgroundColor: B.surface2, color: B.navy }}>
        Add to Bundle
      </button>
    </div>
  );
}

/* ─── Results View ─── */
function ResultsView({ parsed, isBookReview, onAnswer }: { parsed: ParsedResult; isBookReview: boolean; onAnswer: (msg: string) => void }) {
  const hasCards = parsed.matches.length > 0 || parsed.crossSell.length > 0;
  const [showFull, setShowFull] = useState(!hasCards);
  const [preQualAnswers, setPreQualAnswers] = useState<Record<number, string>>({});

  const proseClasses = `prose prose-sm max-w-none [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-0 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mb-1 [&_h3]:mt-3 [&_p]:mb-2 [&_p]:text-sm [&_p]:leading-relaxed [&_strong]:font-bold [&_ul]:mb-2 [&_ul]:pl-4 [&_ul]:text-sm [&_ol]:mb-2 [&_ol]:pl-4 [&_ol]:text-sm [&_li]:mb-0.5 [&_hr]:my-3`;

  return (
    <div className="space-y-6">
      {/* Book review banner */}
      {isBookReview && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: B.greenLight, border: `1px solid ${B.greenBorder}` }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: B.green }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: B.navy }}>Book Analysis — Cross-Sell Opportunities</div>
            <div className="text-xs" style={{ color: B.muted }}>Based on your current programs and client mix</div>
          </div>
        </div>
      )}

      {/* Program match cards */}
      {parsed.matches.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: B.muted }}>
            {isBookReview ? "Recommended Additions" : "Matched Programs"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parsed.matches.map((match, i) => (
              <ProgramCard key={i} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Pre-qual — comes BEFORE cross-sell (confirm primary need first) */}
      {parsed.preQual.length > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: B.amberLight, border: `1px solid ${B.amberBorder}` }}>
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke={B.amber} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: B.amber }}>Quick Appetite Check</span>
            </div>
            <p className="text-xs mt-1.5 ml-6" style={{ color: B.muted }}>Answer these {parsed.preQual.length} questions to confirm appetite and get your application started.</p>
          </div>
          <div className="space-y-3">
            {parsed.preQual.map((q, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: B.surface, color: B.amber }}>{i + 1}</span>
                  <span className="text-xs leading-relaxed" style={{ color: B.text }}>{q}</span>
                </div>
                <div className="pl-7">
                  <input
                    type="text"
                    value={preQualAnswers[i] || ""}
                    onChange={e => setPreQualAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                    placeholder="Type your answer..."
                    className="w-full text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ backgroundColor: B.surface, border: `1px solid ${B.amberBorder}`, color: B.text }}
                    onFocus={e => { e.currentTarget.style.borderColor = B.amber; }}
                    onBlur={e => { e.currentTarget.style.borderColor = B.amberBorder; }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const answers = parsed.preQual.map((q, i) => `${i + 1}. ${q} — ${preQualAnswers[i] || "N/A"}`).join("\n");
              onAnswer(`Here are my answers to the appetite check:\n${answers}`);
            }}
            disabled={Object.values(preQualAnswers).every(v => !v?.trim())}
            className="mt-4 text-xs font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: B.amber }}
          >
            Submit Answers
          </button>
        </div>
      )}

      {/* Cross-sell — after pre-qual (can't expand an account that isn't confirmed) */}
      {parsed.crossSell.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: B.muted }}>
            {isBookReview ? "Additional Opportunities" : "Expand This Account"}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {parsed.crossSell.map((item, i) => (
              <CrossSellCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Full analysis toggle */}
      <div>
        <button
          onClick={() => setShowFull(!showFull)}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: B.muted }}
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${showFull ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showFull ? "Hide" : "View"} full analysis
        </button>
        {showFull && (
          <div className="mt-3 rounded-xl p-5" style={{ backgroundColor: B.surface, border: `1px solid ${B.border}` }}>
            <div className={proseClasses} style={{ color: B.text }}>
              <ReactMarkdown
                components={{
                  strong: ({ children }) => <strong style={{ color: B.navy }}>{children}</strong>,
                  h2: ({ children }) => <h2 style={{ color: B.navy }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ color: B.navy }}>{children}</h3>,
                  hr: () => <hr style={{ borderColor: B.border }} />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="w-full border-collapse text-xs" style={{ border: `1px solid ${B.border}` }}>{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead style={{ backgroundColor: B.surface2 }}>{children}</thead>,
                  th: ({ children }) => <th className="px-3 py-2 text-left font-semibold border-b" style={{ borderColor: B.border, color: B.navy }}>{children}</th>,
                  td: ({ children }) => <td className="px-3 py-2 border-b" style={{ borderColor: B.border }}>{children}</td>,
                }}
              >{parsed.fullText}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Mock Scenario View ─── */
function MockScenarioView({ scenario }: { scenario: MockScenario }) {
  const stageIcon = {
    matched: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    pre_qualified: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    application_started: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    submitted: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    bound: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  }[scenario.stage];

  const showCrossSell = scenario.crossSell.length > 0;
  const showPreQual = scenario.preQual.length > 0;

  return (
    <div className="space-y-6">
      {/* Demo badge */}
      <div className="flex justify-end">
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: "#EEF2FF", color: "#6366F1", border: "1px solid #C7D2FE" }}>
          Demo Data
        </span>
      </div>

      {/* Original query */}
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: B.navy }}>
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="text-sm font-medium pt-0.5" style={{ color: B.text }}>{scenario.query}</div>
      </div>

      {/* Status banner */}
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: scenario.banner.bg, border: `1px solid ${scenario.banner.border}` }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: scenario.banner.iconBg }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{stageIcon}</svg>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: B.navy }}>{scenario.banner.title}</div>
          <div className="text-xs" style={{ color: B.muted }}>{scenario.banner.subtitle}</div>
        </div>
      </div>

      {/* Application progress bar (only for application_started) */}
      {scenario.stage === "application_started" && (
        <div className="rounded-xl p-4" style={{ backgroundColor: B.surface, border: `1px solid ${B.border}` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: B.navy }}>Application Progress</span>
            <span className="text-xs font-bold" style={{ color: "#8B5CF6" }}>60%</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: B.surface2 }}>
            <div className="h-2 rounded-full" style={{ width: "60%", backgroundColor: "#8B5CF6" }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px]" style={{ color: B.light }}>
            <span>Business Info</span>
            <span>Operations</span>
            <span>Loss History</span>
            <span style={{ color: B.muted, fontWeight: 600 }}>Vehicles</span>
            <span>Review</span>
          </div>
        </div>
      )}

      {/* Program match cards */}
      {scenario.matches.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: B.muted }}>Matched Programs</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenario.matches.map((match, i) => (
              <ProgramCard key={i} match={match} stage={scenario.stage} />
            ))}
          </div>
        </div>
      )}

      {/* Pre-qual — before cross-sell (confirm primary need first) */}
      {showPreQual && (
        <div className="rounded-xl p-4" style={{ backgroundColor: B.amberLight, border: `1px solid ${B.amberBorder}` }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke={B.amber} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: B.amber }}>Quick Appetite Check</span>
              </div>
              {scenario.stage === "matched" && (
                <p className="text-xs mt-1.5 ml-6" style={{ color: B.muted }}>Answer these {scenario.preQual.length} questions to confirm appetite and get your application started.</p>
              )}
            </div>
            {scenario.stage !== "matched" && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: B.green, color: "#fff" }}>Complete</span>
            )}
          </div>
          <div className="space-y-3">
            {scenario.preQual.map((q, i) => {
              const answer = scenario.preQualAnswers[i];
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: answer ? B.green : B.surface, color: answer ? "#fff" : B.amber }}>
                      {answer ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      ) : (i + 1)}
                    </span>
                    <span className="text-xs leading-relaxed" style={{ color: B.text }}>{q}</span>
                  </div>
                  <div className="pl-7">
                    {answer ? (
                      <div className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: B.surface, border: `1px solid ${B.greenBorder}`, color: B.text }}>{answer}</div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Type your answer..."
                        readOnly
                        className="w-full text-xs px-3 py-2 rounded-lg"
                        style={{ backgroundColor: B.surface, border: `2px dashed ${B.amberBorder}`, color: B.light }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {scenario.stage === "matched" && (
            <button className="mt-4 text-xs font-semibold px-4 py-2 rounded-lg text-white opacity-40 cursor-not-allowed" style={{ backgroundColor: B.amber }}>
              Submit Answers
            </button>
          )}
        </div>
      )}

      {/* Cross-sell — after pre-qual */}
      {showCrossSell && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: B.muted }}>Expand This Account</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {scenario.crossSell.map((item, i) => (
              <CrossSellCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function BeyondPortalsDemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMock, setActiveMock] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToResults = useCallback(() => {
    const el = resultsRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToResults(); }, [messages, streamingContent, scrollToResults]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;
    setActiveMock(null);
    const userMsg: Message = { role: "user", content: content.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error: ${res.status}`);
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.text) { full += parsed.text; setStreamingContent(full); }
              if (parsed.error) throw new Error(parsed.error);
            } catch (e) { if (!(e instanceof SyntaxError)) throw e; }
          }
        }
      }
      setMessages(prev => [...prev, { role: "assistant", content: full }]);
      setStreamingContent("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong.";
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${msg}` }]);
      setStreamingContent("");
    }
    setIsStreaming(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleReset = () => { setMessages([]); setInput(""); setStreamingContent(""); setIsStreaming(false); setActiveMock(null); inputRef.current?.focus(); };

  const hasResults = messages.length > 0 || streamingContent.length > 0;
  const mockScenario = activeMock ? MOCK_SCENARIOS[activeMock] : null;

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: B.bg }}>

      {/* ─── Sidebar ─── */}
      {sidebarOpen && (
        <aside className="w-64 flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: B.surface, borderColor: B.border }}>
          {/* Logo */}
          <div className="p-4 border-b" style={{ borderColor: B.border }}>
            <img src="/apex-logo.svg" alt="Apex Intermediaries" className="h-9" />
          </div>

          {/* New Inquiry */}
          <div className="p-3">
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: B.navy, color: "#fff" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Inquiry
            </button>
          </div>

          {/* Recent Inquiries */}
          <div className="px-3 pb-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: B.light }}>Recent</div>
            <div className="space-y-0.5">
              {MOCK_RECENT.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setMessages([]); setStreamingContent(""); setActiveMock(item.id); }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors hover:bg-gray-50 group ${activeMock === item.id ? "bg-gray-50" : ""}`}
                >
                  <div className="font-medium truncate" style={{ color: B.text }}>{item.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span style={{ color: B.light }}>{item.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mx-3 border-t" style={{ borderColor: B.border }} />

          {/* My Programs */}
          <div className="px-3 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: B.light }}>My Programs</div>
            <div className="space-y-1 px-2">
              {MOCK_PROGRAMS.map(p => (
                <div key={p.name} className="flex items-center gap-2 text-xs">
                  {p.active ? (
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill={B.green} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke={B.light} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    </svg>
                  )}
                  <span style={{ color: p.active ? B.text : B.light }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-3 border-t" style={{ borderColor: B.border }} />

          {/* My Book */}
          <div className="px-3 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: B.light }}>My Book</div>
            <div className="grid grid-cols-3 gap-1 px-2">
              <div>
                <div className="text-sm font-bold" style={{ color: B.navy }}>{MOCK_BOOK.policies}</div>
                <div className="text-[10px]" style={{ color: B.light }}>Policies</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: B.navy }}>{MOCK_BOOK.premium}</div>
                <div className="text-[10px]" style={{ color: B.light }}>Premium</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: B.navy }}>{MOCK_BOOK.renewals}</div>
                <div className="text-[10px]" style={{ color: B.light }}>Renewals</div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Agent profile */}
          <div className="p-3 border-t" style={{ borderColor: B.border }}>
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">AG</div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: B.navy }}>Demo Agent</div>
                <div className="text-[11px] truncate" style={{ color: B.muted }}>Apex Intermediaries</div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="flex-shrink-0 border-b px-6 flex items-center justify-between h-14" style={{ backgroundColor: B.surface, borderColor: B.border }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke={B.muted} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden md:flex items-center gap-2">
              {[
                { name: "Programs", count: "62 programs" },
                { name: "Atlas", count: "300+ carriers" },
                { name: "Specialty", count: "115+ programs" },
              ].map(d => (
                <div key={d.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]" style={{ backgroundColor: B.surface2 }}>
                  <span className="font-semibold" style={{ color: B.navy }}>{d.name}</span>
                  <span style={{ color: B.light }}>|</span>
                  <span style={{ color: B.muted }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
          <a
            href="/beyond-portals"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: B.muted }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to presentation
          </a>
        </header>

        {/* Content */}
        <main ref={resultsRef} className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-6">

            {/* Welcome State */}
            {!hasResults && !mockScenario && (
              <div className="flex flex-col items-center text-center pt-[8vh]">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "#F0F1F3", border: `1px solid ${B.border}` }}>
                  <ApexMark className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: B.navy }}>What risk can we help you place?</h1>
                <p className="text-sm max-w-md mb-8" style={{ color: B.muted }}>
                  Describe your client and we&apos;ll match programs, verify appetite, and get you quoting &mdash; all in one place.
                </p>
                <div className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: B.light }}>Try an example</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                  {CHIPS.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(chip.prompt)}
                      disabled={isStreaming}
                      className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50"
                      style={{ backgroundColor: B.surface, color: B.navy, border: `1px solid ${B.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = B.green; e.currentTarget.style.backgroundColor = B.greenLight; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.backgroundColor = B.surface; }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-xs" style={{ color: B.light }}>or describe any risk below</div>
              </div>
            )}

            {/* Mock Scenario View */}
            {mockScenario && (
              <MockScenarioView scenario={mockScenario} />
            )}

            {/* Live Results */}
            {hasResults && !mockScenario && (
              <div className="space-y-6">
                {messages.map((msg, i) => {
                  if (msg.role === "user") {
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: B.navy }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium pt-0.5" style={{ color: B.text }}>{msg.content}</div>
                      </div>
                    );
                  }
                  // Assistant: parse and render as cards
                  const parsed = parseResponse(msg.content);
                  const isThisBookReview = i > 0 && messages[i - 1]?.role === "user" && /existing|currently write|current producer|round my/i.test(messages[i - 1].content);
                  return <ResultsView key={i} parsed={parsed} isBookReview={isThisBookReview} onAnswer={(msg) => sendMessage(msg)} />;
                })}

                {/* Streaming state */}
                {isStreaming && !streamingContent && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                    <span className="text-sm font-medium" style={{ color: B.muted }}>Analyzing risk across all divisions...</span>
                  </div>
                )}
                {isStreaming && streamingContent && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                    <span className="text-sm font-medium" style={{ color: B.muted }}>Building your results...</span>
                  </div>
                )}

                {/* Follow-ups */}
                {!isStreaming && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {FOLLOW_UPS.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(f)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: B.surface, color: B.muted, border: `1px solid ${B.border}` }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = B.green; e.currentTarget.style.color = B.navy; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.color = B.muted; }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Search Input */}
        <div className="flex-shrink-0 border-t px-6 py-3" style={{ borderColor: B.border, backgroundColor: B.surface }}>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke={B.light} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Describe your client's risk..."
                disabled={isStreaming}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: B.bg, color: B.text, border: `1px solid ${B.border}` }}
                onFocus={e => { e.currentTarget.style.borderColor = B.green; }}
                onBlur={e => { e.currentTarget.style.borderColor = B.border; }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{ backgroundColor: !input.trim() || isStreaming ? B.surface2 : B.green, color: !input.trim() || isStreaming ? B.muted : "#fff" }}
            >
              {isStreaming ? "Analyzing..." : "Search"}
            </button>
          </form>
          <div className="max-w-3xl mx-auto mt-2">
            <p className="text-[10px] text-center" style={{ color: B.light }}>
              All coverage and eligibility must be confirmed with the relevant Apex division &middot; &copy; 2026 Apex Intermediaries &middot; Prototype Demo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
