import type { Metadata } from "next";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "VP, Digital Marketing & MarTech Vision for Apex Intermediaries | Kyle Naughtrip",
  description: "A digital marketing and MarTech vision for Apex Intermediaries. strategic roadmap, platform health dashboard, and content engine.",
  metadataBase: new URL("https://enterprise-audit-demo.vercel.app"),
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Digital Marketing & MarTech Vision for Apex Intermediaries",
    description: "A digital marketing and MarTech vision for Apex Intermediaries. strategic roadmap, platform health dashboard, and content engine.",
    siteName: "Kyle Naughtrip | Digital Marketing & MarTech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing & MarTech Vision for Apex Intermediaries",
    description: "A digital marketing and MarTech vision for Apex Intermediaries. strategic roadmap, platform health dashboard, and content engine.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script id="microsoft-clarity" strategy="beforeInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vgj53ztdz9");`}
        </Script>
        <LayoutShell>
          {children}
        </LayoutShell>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
