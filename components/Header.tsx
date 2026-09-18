"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";

const pages = [
  { href: "/", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      className="justify-between items-center flex flex-wrap w-full max-w-xl gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-xl font-semibold whitespace-nowrap"><Link href="/">brian an</Link></h1>
      <nav aria-label="Main navigation" className="flex gap-2 py-[3px]">
        {pages.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={`inline-flex h-9 items-center justify-center border bg-background px-3 sm:px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              pathname === href
                ? "border-primary text-primary shadow-md"
                : "border-border/50 text-muted-foreground shadow-xs hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
