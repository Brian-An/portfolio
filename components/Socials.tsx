import { socialLinks } from "@/constants/socials";

export default function Socials() {
  return <div className="social-links">{socialLinks.map((social) => <a key={social.href} href={social.href} target={social.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" aria-label={social.label}>{social.label}</a>)}</div>;
}
