import type { Metadata } from "next";
import Projects from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore Brian An's software development projects and experiments.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Brian An",
    description: "Explore Brian An's software development projects and experiments.",
    url: "/projects",
    type: "website",
    siteName: "Brian An",
  },
};

export default function ProjectsPage() {
  return <Projects />;
}
