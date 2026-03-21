"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
// Lucide-style icons as SVG components
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const Edit3Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);


const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const LINES_OF_BUSINESS = [
  "Cyber & Privacy Risk",
  "Workers' Compensation Trends",
  "Commercial Property & Catastrophe",
  "Professional & Management Liability",
  "E&S Market Outlook",
  "Emerging Risks",
] as const;

const CONTENT_TYPES = [
  { id: "linkedin", label: "LinkedIn Post", icon: LinkedinIcon },
  { id: "article", label: "Blog Article", icon: FileTextIcon },
  { id: "speaking", label: "Speaking Topics", icon: MicIcon },
  { id: "newsletter", label: "Email Newsletter", icon: MailIcon },
] as const;

export default function ToolPage() {
  const [lineOfBusiness, setLineOfBusiness] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!lineOfBusiness || !contentType) return;

    setIsGenerating(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          practiceArea: lineOfBusiness,
          contentType,
          topic: topic || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const fullOutput = data.content;

      if (!fullOutput) {
        throw new Error("No content returned");
      }

      // Type out the response for effect
      for (let i = 0; i <= fullOutput.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 3));
        setOutput(fullOutput.slice(0, i));
      }
    } catch (error) {
      console.error("Generation error:", error);
      setOutput(error instanceof Error ? `Error: ${error.message}` : "Error generating content. Please try again.");
    }

    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleClear = () => {
    setOutput("");
  };

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
              <SparklesIcon className="w-3 h-3" />
              AI Content
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[color:var(--navy)] leading-[1.1] tracking-tight font-display">
              Content Engine
            </h1>

            <p className="text-lg md:text-xl text-[color:var(--muted)] max-w-xl leading-relaxed">
              Agents stay with intermediaries who keep them informed. This is a working prototype: select a line of business, choose a content type, and see what AI-assisted content looks like for Apex Intermediaries.
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
                  The Challenge
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                  190 programs across 400+ carriers. Each needs marketing content. There aren&apos;t enough hours.
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  With three divisions and dozens of specialized programs, the marketing teams across Apex Intermediaries can&apos;t create tailored, compliant content for every product line. Five minutes of subject matter expert time should be enough. The system below shows how.
                </p>
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--teal)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Interactive Demo Section */}
        <div id="demo-section" className="scroll-mt-32 mb-24">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-gray-200/50 border border-[color:var(--border)] flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-[color:var(--navy)] flex items-center justify-center text-white shadow-lg shadow-gray-900/20">
                  <Edit3Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--navy)]">
                    Expert Input
                  </h3>
                  <p className="text-sm text-[color:var(--muted)]">
                    Minimal effort, maximum impact
                  </p>
                </div>
              </div>

              <div className="space-y-8 flex-1">
                {/* Line of Business */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-widest">
                    Focus
                  </label>
                  <div className="relative">
                    <select
                      value={lineOfBusiness}
                      onChange={(e) => setLineOfBusiness(e.target.value)}
                      className="w-full p-4 pr-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[color:var(--teal)] focus:border-transparent transition-all appearance-none font-medium text-[color:var(--navy)] cursor-pointer hover:bg-[color:var(--surface)]"
                    >
                      <option value="" disabled>
                        Select a focus...
                      </option>
                      {LINES_OF_BUSINESS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
                  </div>
                </div>

                {/* Content Type */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-widest">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONTENT_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = contentType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setContentType(type.id)}
                          className={`
                            p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 relative overflow-hidden group
                            ${isSelected ? "border-[color:var(--navy)] bg-[color:var(--navy)] text-white shadow-lg shadow-gray-900/20" : "border-[color:var(--border)] bg-white hover:border-[color:var(--muted)]/50 hover:bg-[color:var(--surface-2)] text-[color:var(--muted)]"}
                          `}
                        >
                          <Icon
                            className={`w-5 h-5 shrink-0 ${isSelected ? "text-[color:var(--teal)]" : "text-[color:var(--muted)] group-hover:text-[color:var(--navy)]"}`}
                          />
                          <span
                            className={`font-bold text-sm ${isSelected ? "text-white" : "text-[color:var(--navy)]"}`}
                          >
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Topic */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-widest">
                    Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Emerging cyber risks in healthcare or New workers' comp class code changes"
                    className="w-full p-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[color:var(--teal)] focus:border-transparent transition-all font-medium text-[color:var(--navy)] placeholder:text-[color:var(--muted)]"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-8 pt-8 border-t border-[color:var(--border)]">
                <button
                  onClick={handleGenerate}
                  disabled={!lineOfBusiness || !contentType || isGenerating}
                  className={`
                    w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg
                    ${!lineOfBusiness || !contentType || isGenerating ? "bg-[color:var(--surface-2)] text-[color:var(--muted)] cursor-not-allowed shadow-none border border-[color:var(--border)]" : "bg-[color:var(--teal)] text-white hover:opacity-95 hover:-translate-y-0.5 hover:shadow-xl"}
                  `}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ZapIcon className="w-5 h-5" />
                      Generate Draft
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[color:var(--muted)] mt-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live system. Generates real content.
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Right Column: Output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-gray-200/50 border border-[color:var(--border)] flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-[color:var(--teal)]/10 flex items-center justify-center text-[color:var(--navy)] border border-[color:var(--teal)]/20">
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--navy)]">
                    Generated Draft
                  </h3>
                  <p className="text-sm text-[color:var(--muted)]">
                    Ready for review and refinement
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-[color:var(--surface-2)] rounded-2xl border border-[color:var(--border)] p-8 flex flex-col relative overflow-hidden min-h-[400px]">
                {output ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-left w-full h-full overflow-y-auto prose prose-sm prose-neutral max-w-none text-[color:var(--navy)] [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[color:var(--navy)] [&_h1]:mb-4 [&_h1]:mt-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[color:var(--navy)] [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[color:var(--navy)] [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:text-[color:var(--navy)] [&_ul]:mb-4 [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:pl-5 [&_li]:mb-1 [&_hr]:my-6 [&_hr]:border-[color:var(--border)]"
                  >
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-[color:var(--border)] flex items-center justify-center mb-6 shadow-sm">
                      <SparklesIcon className="w-8 h-8 text-[color:var(--muted)]/50" />
                    </div>
                    <h3 className="text-[color:var(--navy)] font-medium mb-2">
                      Ready to generate
                    </h3>
                    <p className="text-[color:var(--muted)] text-sm max-w-xs">
                      Select your parameters and click Generate. Your draft will
                      appear here.
                    </p>
                  </div>
                )}
              </div>

              {output && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--navy)] transition-all hover:bg-[color:var(--surface-2)]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleClear}
                    className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--navy)] transition-all hover:bg-[color:var(--surface-2)]"
                  >
                    Clear
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>


        {/* The Revenue Connection */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[color:var(--surface)] rounded-3xl p-8 md:p-12 shadow-[var(--shadow-soft)] border border-[color:var(--border)]"
          >
            <span className="text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase mb-4 block">
              The Revenue Connection
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--navy)] mb-8 font-display max-w-2xl">
              Content drives agent discovery, discovery drives placement preference, placement preference drives premium volume.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Content", desc: "Market updates, product launches, risk insights published to agents" },
                { step: "2", title: "Discovery", desc: "Agents learn which programs exist and what appetite looks like" },
                { step: "3", title: "Preference", desc: "Informed agents preferentially route submissions to known programs" },
                { step: "4", title: "Volume", desc: "More submissions, higher hit ratios, increased premium placement" },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-4xl font-bold text-[color:var(--teal)]/20 mb-2">{item.step}</div>
                  <h3 className="text-lg font-bold text-[color:var(--navy)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[color:var(--muted)] leading-relaxed">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 -right-3 text-[color:var(--muted)]/30">
                      <ArrowRightIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Integration Callout */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[color:var(--surface)] rounded-3xl p-8 md:p-12 shadow-[var(--shadow-soft)] border border-[color:var(--border)]"
          >
            <span className="text-[color:var(--teal)] text-xs font-bold tracking-widest uppercase mb-4 block">
              How This Connects
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--navy)] mb-6 font-display">
              Content engine + Dynamics 365 + analytics = end-to-end measurement.
            </h2>
            <p className="text-[color:var(--muted)] leading-relaxed max-w-3xl">
              With Dynamics 365 in the stack, this content engine can feed directly into marketing automation for distribution, GA4 for engagement tracking, and Power BI for reporting. Content output becomes measurable — from publish to engagement to pipeline activity.
            </p>
          </motion.div>
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
                Content is one piece.
              </h2>
              <p className="text-gray-400 text-lg">
                See how the digital audit and strategic roadmap connect content to platform strategy.
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
              <Link
                href="/platform-health"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-base font-bold border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
              >
                Platform Health
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
