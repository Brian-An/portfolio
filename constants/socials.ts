import { IconType } from "react-icons";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

export interface SocialLink {
  href: string;
  icon: IconType;
}

export const socialLinks: SocialLink[] = [
  { href: "mailto:brian.an1@uwaterloo.ca", icon: FiMail },
  { href: "https://www.linkedin.com/in/brian-an06/", icon: FiLinkedin },
  { href: "https://github.com/Brian-An", icon: FiGithub },
  { href: "https://www.x.com/imbrianan", icon: FaXTwitter },
];
