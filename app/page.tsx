"use client";

import Header from "@/components/Header";
import About from "@/components/sections/About";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <Header />
      <About />
    </main>
  );
}
