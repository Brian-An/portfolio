import { IconType } from "react-icons";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

export interface SocialLink {
  href: string;
  icon: IconType;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { href: "mailto:brian.an1@uwaterloo.ca", icon: FiMail, label: "Email" },
  { href: "https://www.linkedin.com/in/brian-an06/", icon: FiLinkedin, label: "LinkedIn" },
  { href: "https://github.com/Brian-An", icon: FiGithub, label: "GitHub" },
  { href: "https://www.x.com/hibrianan", icon: FaXTwitter, label: "X" },
];
