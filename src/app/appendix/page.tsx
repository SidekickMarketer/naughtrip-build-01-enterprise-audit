"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-6 lg:px-10 ${className}`}>{children}</div>;
}

function Section({
  children,
  className = "",
  id,
  alt = false,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-20 lg:py-24 ${alt ? "bg-[color:var(--surface-2)] border-y border-[color:var(--border)]" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

function CitationCard({
  stat,
  claim,
  source,
  context,
  index = 0,
}: {
  stat: string;
  claim: string;
  source: string;
  context: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-8 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-6">
        <div className="shrink-0">
          <div className="text-4xl sm:text-5xl font-bold text-[color:var(--teal)] tabular-nums">{stat}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-[color:var(--navy)]">{claim}</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)] leading-relaxed">{context}</p>
          <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Source</div>
            <div className="mt-1 text-sm text-[color:var(--navy)]">{source}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SourceCard({
  title,
  publisher,
  year,
  description,
  index = 0,
}: {
  title: string;
  publisher: string;
  year: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="text-xs font-semibold text-[color:var(--teal)]">{year}</div>
      <h4 className="mt-1 font-semibold text-[color:var(--navy)]">{title}</h4>
      <div className="mt-1 text-sm text-[color:var(--muted)]">{publisher}</div>
      <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function AppendixPage() {
  return (
    <div>
      {/* Hero */}
      <Container>
        <Section className="pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--navy)] transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to home</span>
            </Link>

            <h1 className="h1 text-[color:var(--navy)]">Research Appendix</h1>
            <p className="mt-4 text-xl text-[color:var(--muted)] max-w-3xl leading-relaxed">
              Every claim in this presentation is grounded in published insurance industry research, Parent Company financial data, and competitive analysis. Here are the citations behind the strategy.
            </p>
          </motion.div>
        </Section>
      </Container>

      {/* Core Statistics */}
      <Section alt>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="h2 text-[color:var(--navy)]">The Core Statistics</h2>
            <p className="mt-3 text-[color:var(--muted)] max-w-2xl">
              These findings support a simple thesis: agents place business through the path of least resistance. Apex Intermediaries has the scale and the programs. The digital side needs to match.
            </p>
          </motion.div>

          <div className="space-y-6">
            <CitationCard
              index={0}
              stat="83%"
              claim="of agents say they'd write more business with carriers who provide real-time appetite and quoting within their management systems"
              source="IVANS 9th Annual Agency-Carrier Connectivity Report (1,000+ agents surveyed, released January 2024)"
              context="Real-time risk appetite information became the #1 factor in carrier/MGA selection, cited by 29% of respondents, up from 12% prior year. The intermediary that makes quoting fastest wins the placement."
            />

            <CitationCard
              index={1}
              stat="11"
              claim="Independent web properties across 3 divisions"
              source="Digital Presence Audit, February 2026"
              context="Apex Intermediaries operates 11 distinct web properties across 3 divisions: apex-programs.com, atlas-specialty.com, apex-wholesale.com, apex-exchange.com, protector-plans.com, and more. Each was built independently. A natural result of acquisition-led growth. Bringing them together under one brand and marketing standard is the opportunity."
            />

            <CitationCard
              index={2}
              stat="$20B+"
              claim="Premiums placed across the Apex Intermediaries platform"
              source="the CEO, Apex Intermediaries (Industry Publication, 2025)"
              context="Apex Intermediaries places $20B+ in total premiums with $13B+ in delegated premium, approximately 65% of total. This makes Apex Intermediaries one of the largest insurance intermediaries globally, across Programs (MGA/MGU), Atlas Specialty (wholesale), and Apex Wholesale."
            />

            <CitationCard
              index={3}
              stat="~43%"
              claim="Specialty Distribution segment profit margin, among the highest in Parent Company"
              source="Parent Company Q3 2025 Earnings Report"
              context="Following a Q3 2025 segment reorganization, the former Programs and Wholesale segments now report as Specialty Distribution, which delivered a 43.9% profit margin in Q3 2025. Delegated authority drives higher value capture per premium dollar."
            />
          </div>
        </Container>
      </Section>

      {/* Additional Supporting Statistics */}
      <Container>
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="h2 text-[color:var(--navy)]">Supporting Research</h2>
            <p className="mt-3 text-[color:var(--muted)] max-w-2xl">
              Additional findings that inform the strategic roadmap and recommendations.
            </p>
          </motion.div>

          {/* Agent Decision-Making Research */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-[color:var(--navy)] mb-6">Agent Decision-Making Research</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SourceCard
                index={0}
                title="83% of agents say they'd write more business with real-time appetite and quoting"
                publisher="IVANS 9th Annual Agency-Carrier Connectivity Report"
                year="2024"
                description="Real-time risk appetite information is the #1 factor in carrier selection (29% of respondents, up from 12% prior year). 72% cite commercial submission process as the top area needing automation."
              />
              <SourceCard
                index={1}
                title="Only 40% of agents describe carriers as 'easy to work with'"
                publisher="J.D. Power Independent Agent Satisfaction Study"
                year="2025"
                description="When ease is rated 'very easy,' agent satisfaction is 274-314 points higher. Only 53% of agents say support materials on carrier portals are easy to find."
              />
              <SourceCard
                index={2}
                title="Agent experience is the defining competitive factor for MGAs"
                publisher="Vertafore 2025 MGA Outlook"
                year="2025"
                description="'Agent experience and engagement are quickly coming to the forefront for MGAs and may be the defining factor to surpass competitors in 2025.' Customer portals are becoming key differentiators."
              />
            </div>
          </div>

          {/* Business Context */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-[color:var(--navy)] mb-6">Apex Intermediaries Business Context</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SourceCard
                index={0}
                title="190 programs across 400+ carriers"
                publisher="Apex Intermediaries"
                year="2025"
                description="Apex Intermediaries operates 190 programs across 400+ carrier relationships, covering personal, commercial, specialty, professional liability, and public entity segments with 25,000+ distribution partners."
              />
              <SourceCard
                index={1}
                title="Major wholesale acquisition"
                publisher="Parent Company Investor Relations"
                year="2025"
                description="The parent company completed a major acquisition to form the Apex Wholesale division, the largest acquisition in company history, adding thousands of employees."
              />
              <SourceCard
                index={2}
                title="New CMO appointed across all divisions"
                publisher="Industry Publications"
                year="Jan 2026"
                description="The CMO was appointed to lead marketing across all 3 Apex Intermediaries divisions in January 2026, expanding from a prior role leading one division only."
              />
            </div>
          </div>

          {/* Competitive Digital Landscape */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-[color:var(--navy)] mb-6">Competitive Digital Landscape</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SourceCard
                index={0}
                title="Acrisure Auris AI platform"
                publisher="Crain's Detroit Business, Acrisure.com"
                year="2025"
                description="Acrisure's proprietary AI platform analyzes 140+ billion data points in real-time. Uses Sitecore XM Cloud for personalized web experiences. $32B valuation. Positions as a 'fintech company.'"
              />
              <SourceCard
                index={1}
                title="Ryan Specialty RT Connector refresh"
                publisher="RT Specialty"
                year="Sep 2025"
                description="RT Connector delivers real-time, bindable quotes across 25+ carriers in 8 lines of business with instant policy issuance, smart document upload, and API integrations."
              />
              <SourceCard
                index={2}
                title="AmWINS + MGT AI partnership"
                publisher="AmWINS Group"
                year="Feb 2026"
                description="AmWINS partnered with AI neo-insurer MGT to modernize E&S underwriting with fast, AI-driven decisions for small commercial risks, combining AmWINS' 138+ office wholesale reach with AI."
              />
              <SourceCard
                index={3}
                title="CRC Group REDY analytics platform"
                publisher="CRC Group"
                year="2025"
                description="Proprietary data analytics platform built on millions of data points from bound accounts since 2016. Delivers benchmarking, endorsement tools, and risk assessment reports directly in broker workflows."
              />
            </div>
          </div>

          {/* Insurance MarTech Landscape */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-[color:var(--navy)] mb-6">Insurance Marketing Technology</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SourceCard
                index={0}
                title="Marketing automation: 3/11 Apex Intermediaries properties"
                publisher="Apex Intermediaries Marketing Stack Analysis + Marketing Technology Report 2026"
                year="2026"
                description="HubSpot is detected on 3 of 11 Apex Intermediaries web properties across 2 separate portal IDs. HubSpot holds 29.4% of the B2B marketing automation market. Dynamics 365, Power BI, GA4, and App Insights appear to be the enterprise standard. The marketing automation path is an open decision."
              />
              <SourceCard
                index={1}
                title="75% of insurance marketers say compliance hinders effectiveness"
                publisher="IntelligenceBank / Insurance Marketing Compliance Study"
                year="2025"
                description="75% of insurance marketers say compliance requirements hinder effectiveness. 74% criticize review processes for too many steps. Solution: build compliance into creation workflows."
              />
              <SourceCard
                index={2}
                title="State-by-state regulatory complexity"
                publisher="Insurance Business Magazine"
                year="2025"
                description="Insurance marketing is regulated at the state level. Any public-facing communication (website, email, social, brochure) is 'advertising' under insurance law. Multi-state approval workflows are critical."
              />
            </div>
          </div>

          {/* Parent Company Financial Performance */}
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--navy)] mb-6">Parent Company Financial Performance</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SourceCard
                index={0}
                title="FY 2025 revenue: $6B+"
                publisher="Parent Company Q4 2025 Earnings"
                year="2025"
                description="The parent company reported $6B+ in total revenue (+22.8% YoY). Following a segment reorganization, Specialty Distribution (formerly Programs + Wholesale) delivered ~43% profit margin. Adjusted profit margin of ~36% company-wide."
              />
              <SourceCard
                index={1}
                title="43 acquisitions in 2025"
                publisher="Parent Company Investor Relations"
                year="2025"
                description="The parent company completed 43 acquisitions in 2025, adding approximately $1.8B in annual revenue. The largest deal alone added $1.7B and thousands of employees."
              />
              <SourceCard
                index={2}
                title="Teammate ownership culture"
                publisher="Parent Company Corporate"
                year="2025"
                description="60%+ of Parent Company employees own company stock, with ~25% of the company being teammate-owned. 92% of employees say it's a great place to work (Great Place to Work certification)."
              />
            </div>
          </div>
        </Section>
      </Container>

      {/* Full Source List */}
      <Container>
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="h2 text-[color:var(--navy)]">Primary Sources</h2>
            <p className="mt-3 text-[color:var(--muted)] max-w-2xl">
              The research publications and data sources referenced throughout this presentation.
            </p>
          </motion.div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] overflow-hidden">
            <div className="divide-y divide-[color:var(--border)]">
              {[
                {
                  title: "IVANS 9th Annual Agency-Carrier Connectivity Report (2024)",
                  desc: "Survey of 1,000+ agents: 83% say they'd write more business with real-time appetite and quoting within their management systems",
                  url: "https://www.ivans.com/news/press-releases/2024/ivans-reveals-latest-findings-from-state-of-agency-carrier-connectivity-report/",
                },
                {
                  title: "J.D. Power 2025 U.S. Independent Agent Satisfaction Study",
                  desc: "Only 40% of agents describe carriers as 'easy to work with.' When ease is rated 'very easy,' satisfaction is 274-314 points higher.",
                  url: "https://www.jdpower.com/business/press-releases/2025-us-independent-agent-satisfaction-study",
                },
                {
                  title: "Parent Company FY2025 Earnings Reports (Q1-Q4)",
                  desc: "Revenue, segment performance, profit margins, organic growth, and acquisition integration updates",
                  url: "",
                },
                {
                  title: "Apex Programs — Our Programs",
                  desc: "Complete program portfolio across personal, commercial, specialty, professional liability, and public entity",
                  url: "",
                },
                {
                  title: "Atlas Specialty Group",
                  desc: "Wholesale brokerage division, practice groups, and market access",
                  url: "",
                },
                {
                  title: "Apex Wholesale — Integration Announcement",
                  desc: "Integration announcement and organizational alignment details",
                  url: "",
                },
                {
                  title: "CMO Appointment Announcement",
                  desc: "Announcement of expanded CMO role across all 3 Apex Intermediaries divisions",
                  url: "",
                },
                {
                  title: "RT Specialty — RT Connector Enhanced",
                  desc: "Digital marketplace refresh: real-time quoting, 25+ carriers, instant bind",
                  url: "https://rtspecialty.com/2025/09/09/rt-specialty-refreshes-and-enhances-digital-solutions-within-rt-connector/",
                },
                {
                  title: "AmWINS + MGT AI Partnership",
                  desc: "AI-powered E&S underwriting modernization through wholesale distribution",
                  url: "https://insurancenewsnet.com/oarticle/ai-neo-insurer-mgt-partners-with-amwins-to-modernize-es-underwriting",
                },
                {
                  title: "Acrisure — Sitecore Case Study",
                  desc: "How Acrisure built personalized web experiences using Sitecore XM Cloud",
                  url: "https://www.sitecore.com/resources/insights/customer-insights/acrisure-consumer-engagement",
                },
                {
                  title: "Insurance Marketing Compliance Trends",
                  desc: "Study on marketing-compliance relationship challenges in insurance",
                  url: "https://intelligencebank.com/insights/2024-insurance-marketing-compliance-trends-threats-and-solutions/",
                },
              ].map((source, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="px-6 py-4"
                >
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="font-semibold text-[color:var(--navy)] group-hover:text-[color:var(--teal)] transition-colors">
                          {source.title}
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--muted)]">{source.desc}</div>
                      </div>
                      <svg className="w-4 h-4 mt-1 shrink-0 text-[color:var(--muted)] group-hover:text-[color:var(--teal)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <div>
                      <div className="font-semibold text-[color:var(--navy)]">{source.title}</div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">{source.desc}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      </Container>

      {/* CTA */}
      <Container>
        <Section className="pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-[color:var(--surface-2)] border border-[color:var(--border)] p-8 text-center"
          >
            <h3 className="text-xl font-semibold text-[color:var(--navy)]">
              Questions about the research?
            </h3>
            <p className="mt-2 text-[color:var(--muted)]">
              I&apos;m happy to discuss any of these findings or share the full source documents.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--navy)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow)] hover:-translate-y-0.5"
              >
                <span>See the Strategic Roadmap</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="mailto:kyle@naughtrip.com"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-3 text-sm font-semibold text-[color:var(--navy)] transition-all hover:bg-white hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email me</span>
              </a>
            </div>
          </motion.div>
        </Section>
      </Container>
    </div>
  );
}
