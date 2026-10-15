"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface LinkPreviewProps {
  name: string;
  title: string;
  description: string;
  href: string;
  preview: string;
  domain: string;
}

export default function LinkPreview({ name, title, description, href, preview, domain }: LinkPreviewProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 280 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const showPreview = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const viewport = document.documentElement.clientWidth;
    const width = viewport <= 700 ? 250 : 280;
    const bounds = trigger.getBoundingClientRect();
    const textRight = Math.max(bounds.right, ...Array.from(trigger.closest(".intro-copy")?.querySelectorAll(".work-list .inline-link") ?? [], link => link.getBoundingClientRect().right));
    const side = textRight + 20;
    const available = viewport - side - 16;
    if (viewport > 1000 && available >= 180) {
      setPosition({ left: side, top: Math.max(16, Math.min(bounds.top - 70, window.innerHeight - 260)), width: Math.min(width, available) });
    } else {
      const work = trigger.closest(".work-section")?.getBoundingClientRect() ?? bounds;
      const above = work.top - 260;
      const top = above >= 16 ? above : Math.min(work.bottom + 16, window.innerHeight - 260);
      setPosition({ left: Math.max(16, (viewport - width) / 2), top: Math.max(16, top), width });
    }
    setOpen(true);
  };

  return (
    <span ref={triggerRef} className="link-preview" onMouseEnter={showPreview} onMouseLeave={() => setOpen(false)} onFocus={showPreview} onBlur={() => setOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="inline-link">{name}</a>
      <span className="link-preview-card" style={position} data-open={open} aria-hidden={!open}>
        <Image src={preview} alt={`${title} website preview`} width={1200} height={750} sizes="280px" loading="eager" />
        <span className="preview-copy"><span className="preview-domain">{domain}</span><strong>{title}</strong><span>{description}</span></span>
      </span>
    </span>
  );
}
