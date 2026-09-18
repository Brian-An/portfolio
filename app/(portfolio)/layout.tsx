"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Socials from "@/components/Socials";
import AsciiCamera from "@/components/AsciiCamera";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex flex-col items-center justify-center px-4 py-4 mt-8 sm:mt-16">
      <Header />
      <AsciiCamera />
      <div className={`w-full ${pathname === "/gallery" ? "max-w-3xl" : "max-w-xl"}`}>
        {children}
        <Socials key={pathname} />
      </div>
    </main>
  );
}
