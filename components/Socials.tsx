"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Socials() {
  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <Link href="mailto:brian.an1@uwaterloo.ca" target="_blank">
          <Mail />
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="https://www.linkedin.com/in/brian-an06/" target="_blank">
          <Linkedin />
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="https://github.com/Brian-An" target="_blank">
          <Github />
        </Link>
      </Button>
    </div>
  );
}
