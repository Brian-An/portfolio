import type { Metadata } from "next";
import Projects from "@/components/sections/Projects";
import GitHubContributions from "@/components/GitHubContributions";

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
    images: ["/opengraph-image.png"],
  },
};

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      <Projects />
      <GitHubContributions />
    </div>
  );
}
