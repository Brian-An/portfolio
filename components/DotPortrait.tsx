"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { createPortraitParticles, type PortraitPointer } from "@/lib/portrait-particles";
import { galleryPhotos } from "@/constants/gallery";

const floatingPhotos = [
  { photo: galleryPhotos[0], x: "-7%", y: "-3%", angle: "-12deg", size: "40%" },
  { photo: galleryPhotos[6], x: "69%", y: "-5%", angle: "11deg", size: "35%" },
  { photo: galleryPhotos[3], x: "30%", y: "15%", angle: "7deg", size: "34%" },
  { photo: galleryPhotos[7], x: "69%", y: "54%", angle: "9deg", size: "39%" },
  { photo: galleryPhotos[5], x: "-7%", y: "58%", angle: "8deg", size: "36%" },
  { photo: galleryPhotos[17], x: "34%", y: "67%", angle: "-7deg", size: "33%" },
];

export default function DotPortrait({ fallback }: { fallback: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animateRef = useRef<(expanded: boolean, pointer?: PortraitPointer) => void>(() => {});
  const moveRef = useRef<(pointer: PortraitPointer) => void>(() => {});
  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  const reveal = useCallback((value: boolean, pointer?: PortraitPointer) => {
    expandedRef.current = value;
    setExpanded(value);
    animateRef.current(value, pointer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const particles = createPortraitParticles(canvas, () => setReady(true));
    animateRef.current = particles.reveal;
    moveRef.current = particles.move;
    particles.reveal(expandedRef.current);
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const fromPhoto = document.activeElement?.closest(".floating-photo");
      reveal(false);
      if (fromPhoto) canvas.parentElement?.querySelector<HTMLAnchorElement>(".portrait-link")?.focus();
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      particles.dispose();
      animateRef.current = () => {};
      moveRef.current = () => {};
      window.removeEventListener("keydown", onEscape);
    };
  }, [reveal]);

  const pointerPosition = (event: PointerEvent<HTMLDivElement>): PortraitPointer => {
    const bounds = canvasRef.current!.parentElement!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(500, (event.clientX - bounds.left) / bounds.width * 500)),
      y: Math.max(0, Math.min(500, (event.clientY - bounds.top) / bounds.height * 500)),
    };
  };
  const closeOnBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Element && next.closest(".portrait-section")) return;
    reveal(false);
  };

  return (
    <div className="portrait-section" data-expanded={expanded} onPointerEnter={(event) => { if (event.pointerType === "mouse") reveal(true, pointerPosition(event)); }} onPointerMove={(event) => { if (event.pointerType === "mouse") moveRef.current(pointerPosition(event)); }} onPointerLeave={(event) => { if (event.pointerType === "mouse") reveal(false); }}>
      <div className="portrait-stage">
      <Link href="/photography" className="portrait-link" aria-label="Explore the photo gallery" onFocus={(event) => {
        if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".floating-photo")) return;
        reveal(true);
      }} onBlur={closeOnBlur}>
        {!ready && fallback}
      </Link>
      <canvas ref={canvasRef} className="portrait-canvas" style={{ visibility: ready ? "visible" : "hidden" }} role="img" aria-label="A cartoon portrait of Brian made of dots" />
      {ready && <div className="photo-universe" data-expanded={expanded}>
        <div className="portrait-preview-region" aria-hidden="true" />
        {floatingPhotos.map(({ photo, x, y, angle, size }, index) => (
          <Link key={photo.src} href="/photography" className="floating-photo" aria-label={`View photos from ${photo.location}`} aria-hidden={!expanded} tabIndex={expanded ? 0 : -1} onBlur={closeOnBlur}
            style={{ "--x": x, "--y": y, "--angle": angle, "--size": size, "--delay": `${index * 35}ms`, "--float-duration": `${7 + index % 4}s` } as CSSProperties}>
            <span className="floating-photo-motion"><Image src={photo.src} alt="" fill sizes="(max-width: 700px) 120px, 175px" /></span>
          </Link>
        ))}
      </div>}
      </div>
      <Link href="/photography" className="photography-hint" onBlur={closeOnBlur}>View Photography</Link>
    </div>
  );
}
