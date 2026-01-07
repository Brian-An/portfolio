"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  techStack?: string[];
}

export default function ProjectCard({
  title,
  description,
  link,
  techStack,
}: ProjectCardProps) {
  return (
    <div className="border border-primary overflow-hidden p-4">
      <div className="flex flex-col gap-2">
        <div className="justify-between flex w-full">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button asChild variant={"outline"} size="sm" className="w-fit">
            <Link href={link} target="_blank" rel="noopener noreferrer">
              View Project
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
