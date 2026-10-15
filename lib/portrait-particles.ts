import { portraitDotGroups } from '@/lib/portrait-dots';

export interface PortraitPointer {
  x: number;
  y: number;
}

export function createPortraitParticles(canvas: HTMLCanvasElement, onReady: () => void) {
  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 250, y: 250 };
  const pointerTarget = { x: 250, y: 250 };
  let frame = 0;
  let disposed = false;
  let progress = 0;
  let target = 0;
  let lastTime = 0;

  const draw = () => {
    if (!context) return;
    context.clearRect(0, 0, 800, 800);
    const eased = progress * progress * (3 - 2 * progress);
    const fade = Math.pow(1 - progress, 1.4);
    if (fade === 0) return;
    const bend = Math.sin(eased * Math.PI);
    context.fillStyle = '#252521';
    // One fill per shade keeps thousands of dots inexpensive to animate.
    for (const group of portraitDotGroups) {
      const radius = group.radius * (1 - eased * .25);
      context.beginPath();
      for (const dot of group.dots) {
        const vx = dot.x - pointer.x;
        const vy = dot.y - pointer.y;
        const length = Math.hypot(vx, vy) || 1;
        const nx = vx / length;
        const ny = vy / length;
        const curve = bend * dot.curve;
        const x = 150 + dot.x + nx * dot.distance * eased - ny * curve;
        const y = 150 + dot.y + ny * dot.distance * eased + nx * curve;
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
      }
      context.globalAlpha = group.alpha * fade;
      context.fill();
    }
    context.globalAlpha = 1;
  };
  const resize = () => {
    const size = Math.max(1, Math.round(canvas.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2)));
    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = canvas.height = size;
      context?.setTransform(size / 800, 0, 0, size / 800, 0, 0);
    }
    draw();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  queueMicrotask(() => { if (!disposed && context) onReady(); });

  const tick = (time: number) => {
    const elapsed = lastTime ? Math.min(time - lastTime, 40) : 16;
    lastTime = time;
    // Smooth pointer changes keep the moving particles on continuous paths.
    const follow = Math.min(1, elapsed / 100);
    pointer.x += (pointerTarget.x - pointer.x) * follow;
    pointer.y += (pointerTarget.y - pointer.y) * follow;
    const step = elapsed / 850;
    progress = target > progress ? Math.min(target, progress + step) : Math.max(target, progress - step);
    draw();
    frame = progress !== target ? requestAnimationFrame(tick) : 0;
  };
  const move = (point: PortraitPointer) => {
    pointerTarget.x = point.x;
    pointerTarget.y = point.y;
  };
  const reveal = (expanded: boolean, point?: PortraitPointer) => {
    if (point) {
      move(point);
      if (progress === 0) Object.assign(pointer, point);
    }
    target = expanded ? 1 : 0;
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      progress = target;
      draw();
    } else if (!frame && progress !== target) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  return {
    reveal,
    move,
    dispose() {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    },
  };
}
