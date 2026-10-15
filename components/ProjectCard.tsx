interface ProjectCardProps {
  title: string;
  link: string;
}

export default function ProjectCard({ title, link }: ProjectCardProps) {
  return <a className="project-link inline-link" href={link} target="_blank" rel="noopener noreferrer">{title}</a>;
}
