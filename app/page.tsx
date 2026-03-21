"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Socials from "@/components/Socials";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import AsciiCamera from "@/components/AsciiCamera";

export default function Home() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <main className="flex flex-col items-center justify-center px-4 py-4 mt-8 sm:mt-16">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <AsciiCamera />
      <div className="w-full max-w-xl">
        {activeTab === "about" && <About />}
        {activeTab === "projects" && <Projects />}
        <Socials />
      </div>
    </main>
  );
}
