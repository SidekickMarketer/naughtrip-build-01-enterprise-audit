import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apex Intermediaries | Agent Discovery",
  description: "Unified discovery interface for Apex Intermediaries — find the right program across Programs, Atlas Specialty, and Apex Wholesale.",
};

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="demo-standalone">
      {children}
    </div>
  );
}
