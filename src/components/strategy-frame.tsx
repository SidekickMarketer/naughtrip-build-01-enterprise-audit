interface StrategyFrameProps {
  kicker?: string;
  title: string;
  problem: string;
  whyItMatters: string;
  impact: string;
  solution: string;
  evidenceNote?: string;
  className?: string;
}

const sectionStyles = {
  problem: {
    label: "Current State",
    border: "border-gray-200",
    bg: "bg-gray-50/50",
    text: "text-gray-700",
  },
  whyItMatters: {
    label: "Why It Matters",
    border: "border-amber-100",
    bg: "bg-amber-50/50",
    text: "text-amber-800",
  },
  impact: {
    label: "What the Data Shows",
    border: "border-blue-100",
    bg: "bg-blue-50/50",
    text: "text-blue-800",
  },
  solution: {
    label: "Where I'd Start",
    border: "border-emerald-100",
    bg: "bg-emerald-50/50",
    text: "text-emerald-800",
  },
} as const;

export function StrategyFrame({
  kicker = "Decision Framing",
  title,
  problem,
  whyItMatters,
  impact,
  solution,
  evidenceNote,
  className = "",
}: StrategyFrameProps) {
  const sections = [
    { key: "problem", body: problem },
    { key: "whyItMatters", body: whyItMatters },
    { key: "impact", body: impact },
    { key: "solution", body: solution },
  ] as const;

  return (
    <section className={`bg-white rounded-3xl p-8 md:p-10 border border-[color:var(--border)] shadow-sm ${className}`}>
      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest uppercase text-[color:var(--muted)]">
          {kicker}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--navy)] mt-2 font-display">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
        {sections.map((section) => {
          const style = sectionStyles[section.key];
          return (
            <div key={section.key} className={`rounded-2xl p-5 border ${style.border} ${style.bg} h-full`}>
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${style.text}`}>
                {style.label}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{section.body}</p>
            </div>
          );
        })}
      </div>

      {evidenceNote && (
        <p className="text-xs text-[color:var(--muted)]/80 mt-5 italic">{evidenceNote}</p>
      )}
    </section>
  );
}
