import PortraitFallback from "@/components/PortraitFallback";
import DotPortrait from "@/components/DotPortrait";
import LinkPreview from "@/components/LinkPreview";
import Projects from "@/components/sections/Projects";
import Socials from "@/components/Socials";
import { education, experiences } from "@/constants/experience";

export default function About() {
  return (
    <div className="profile-container">
      <section className="intro" aria-labelledby="intro-title">
        <DotPortrait fallback={<PortraitFallback />} />
        <div className="intro-copy">
          <h1 id="intro-title">Brian An</h1>
          <p className="education">CS + Finance at <LinkPreview {...education} /></p>
          <p className="profile-bio">I’m interested in product engineering and applied AI. I like making content, going to the gym, and playing volleyball and golf.</p>
          <section className="work-section" aria-labelledby="work-title">
            <h2 id="work-title">Work</h2>
            <ul className="work-list">
              {experiences.map((experience) => (
                <li key={experience.href}><span className="experience-role">{experience.role} at </span><LinkPreview {...experience} /></li>
              ))}
            </ul>
          </section>
          <Projects standalone={false} />
        </div>
      </section>
      <Socials />
    </div>
  );
}
