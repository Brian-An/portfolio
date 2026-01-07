"use client";

import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/constants/projects";

export default function Projects() {
  return (
    <div className="max-w-xl flex flex-col gap-4 mt-2 mb-2">
      {PROJECTS.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          description={project.description}
          link={project.link}
          techStack={project.techStack}
        />
      ))}
    </div>
  );
}
