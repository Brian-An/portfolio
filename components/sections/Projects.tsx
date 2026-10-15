import { PROJECTS } from "@/constants/projects";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Projects({ standalone = true }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section className={`projects-section${standalone ? " standalone-projects" : ""}`} aria-labelledby="projects-title">
      {standalone && <Link href="/" className="back-link">Back</Link>}
      <Heading id="projects-title">Projects</Heading>
      <ul className="project-list">
        {(standalone ? PROJECTS : PROJECTS.slice(0, 3)).map((project) => <li key={project.link}><a className="project-link inline-link" href={project.link} target="_blank" rel="noopener noreferrer">{project.title}</a></li>)}
      </ul>
      {!standalone && <Link href="/projects" className="more-projects">More projects<ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" /></Link>}
    </section>
  );
}
