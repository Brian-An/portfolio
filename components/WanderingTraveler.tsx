"use client";

import { useEffect, useRef } from "react";

type Footprint = { x: number; y: number; time: number };

function drawTraveler(context: CanvasRenderingContext2D, x: number, y: number, facing: number, step: number) {
  context.save();
  context.translate(Math.round(x), Math.round(y));
  context.scale(facing * 2, 2);
  context.translate(-12, -14);
  const pixel = (color: string, left: number, top: number, width: number, height: number) => {
    context.fillStyle = color;
    context.fillRect(left, top, width, height);
  };
  // The bindle hangs from the back of a staff balanced over one shoulder.
  for (let i = 0; i < 17; i++) pixel("#8a7050", 3 + i, 2 + Math.floor(i / 2), 2, 1);
  pixel("#705b43", 5, 3, 2, 2);
  pixel("#6a86a0", 2, 5, 7, 6);
  pixel("#6a86a0", 3, 4, 5, 8);
  pixel("#b3c5d1", 3, 6, 2, 4);
  pixel("#705b43", 11, 2, 6, 3);
  pixel("#705b43", 9, 5, 11, 2);
  pixel("#c8a57b", 12, 7, 6, 5);
  pixel("#c8a57b", 18, 9, 1, 2);
  pixel("#252521", 16, 8, 1, 1);
  pixel("#705b43", 11, 7, 2, 4);
  pixel("#c8a57b", 13, 12, 3, 2);
  pixel("#78845c", 10, 14, 7, 7);
  pixel("#9ba37e", 11, 14, 2, 6);
  pixel("#78845c", 17, 13, 2, 5);
  pixel("#c8a57b", 18, 11, 2, 3);
  pixel("#484b3d", 11 - step, 21, 3, 5);
  pixel("#484b3d", 14 + step, 21, 3, 5);
  pixel("#484b3d", 10 - step, 25, 4, 2);
  pixel("#484b3d", 14 + step, 25, 5, 2);
  context.restore();
}

export default function WanderingTraveler() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    const copy = stage?.querySelector<HTMLElement>(".lost-copy");
    const context = canvas?.getContext("2d");
    if (!canvas || !stage || !copy || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, x = 0, y = 0;
    let angle = Math.random() * Math.PI * 2, facing = 1;
    let elapsed = 0, previous = 0, turnAt = 0, pauseAt = 6000, pauseUntil = 0;
    let frame = 0;
    let obstacle = { left: 0, right: 0, top: 0, bottom: 0 };
    let trail: Footprint[] = [];

    const blocked = (nextX: number, nextY: number) => nextX < 32 || nextX > width - 32 || nextY < 38 || nextY > height - 38
      || (nextX > obstacle.left && nextX < obstacle.right && nextY > obstacle.top && nextY < obstacle.bottom);

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const dot of trail) {
        context.globalAlpha = .4 * (1 - (elapsed - dot.time) / 14000);
        context.fillStyle = "#b6b3a7";
        context.beginPath();
        context.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      const step = elapsed < pauseUntil || reducedMotion.matches ? 0 : Math.floor(elapsed / 180) % 2 ? 1 : -1;
      const looking = elapsed < pauseUntil && Math.floor(elapsed / 300) % 2 ? -facing : facing;
      drawTraveler(context, x, y, looking, step);
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const text = copy.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      // One canvas pixel per CSS pixel keeps the pixel art crisp without a retina-sized buffer.
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      context.imageSmoothingEnabled = false;
      obstacle = { left: text.left - bounds.left - 28, right: text.right - bounds.left + 28, top: text.top - bounds.top - 38, bottom: text.bottom - bounds.top + 38 };
      if (!x || blocked(x, y)) { x = width / 2; y = Math.min(height - 38, obstacle.bottom + 24); }
      trail = [];
      draw();
    };

    const animate = (time: number) => {
      // Thirty frames per second suit the sprite's walking pace and limit canvas work.
      if (previous && time - previous < 32) { frame = requestAnimationFrame(animate); return; }
      const delta = previous ? Math.min((time - previous) / 1000, .05) : 0;
      previous = time;
      elapsed += delta * 1000;
      if (elapsed > pauseAt) {
        pauseUntil = elapsed + 800;
        pauseAt = elapsed + 5000 + Math.random() * 5000;
      }
      if (elapsed > turnAt) {
        angle += (Math.random() - .5) * 1.8;
        turnAt = elapsed + 1200 + Math.random() * 3000;
      }
      if (elapsed >= pauseUntil) {
        for (let attempt = 0; attempt < 12; attempt++) {
          const nextX = x + Math.cos(angle) * 42 * delta;
          const nextY = y + Math.sin(angle) * 42 * delta;
          if (!blocked(nextX, nextY)) {
            x = nextX;
            y = nextY;
            facing = Math.cos(angle) < 0 ? -1 : 1;
            break;
          }
          angle = Math.random() * Math.PI * 2;
        }
        const last = trail.at(-1);
        if (!last || Math.hypot(x - last.x, y + 26 - last.y) >= 12) trail.push({ x, y: y + 26, time: elapsed });
      }
      trail = trail.filter(dot => elapsed - dot.time < 14000);
      draw();
      frame = requestAnimationFrame(animate);
    };

    const motionChanged = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (reducedMotion.matches) trail = [];
      draw();
      if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(animate);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    observer.observe(copy);
    reducedMotion.addEventListener("change", motionChanged);
    document.addEventListener("visibilitychange", motionChanged);
    resize();
    motionChanged();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", motionChanged);
      document.removeEventListener("visibilitychange", motionChanged);
    };
  }, []);

  return <canvas ref={canvasRef} className="wander-canvas" aria-hidden="true" />;
}
