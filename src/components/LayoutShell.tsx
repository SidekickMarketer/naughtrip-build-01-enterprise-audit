"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

const STANDALONE_ROUTES = ["/beyond-portals/demo"];

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((route) => pathname.startsWith(route));

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main className="pt-24">{children}</main>
    </>
  );
}
