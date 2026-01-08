"use client";

import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/constants/projects";
import * as motion from "motion/react-client";

export default function Projects() {
  return (
    <motion.div
      className="max-w-xl flex flex-col gap-4 mt-2 mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {PROJECTS.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
        >
          <ProjectCard
            title={project.title}
            description={project.description}
            link={project.link}
            techStack={project.techStack}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
