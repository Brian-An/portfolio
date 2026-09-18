import type { Metadata } from "next";
import About from "@/components/sections/About";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <About />;
}
