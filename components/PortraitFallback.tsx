import { portraitDotGroups } from '@/lib/portrait-dots';

export default function PortraitFallback() {
  return (
    <svg className="portrait-fallback" viewBox="0 0 800 800" aria-hidden="true">
      {portraitDotGroups.map(({ radius, alpha, dots }, shade) => (
        <path key={shade} fill="#252521" opacity={alpha} d={dots.map(({ x, y }) => {
          const cx = 150 + x;
          const cy = 150 + y;
          const r = radius.toFixed(3);
          return `M${(cx + radius).toFixed(3)} ${cy}a${r} ${r} 0 1 0 ${(-2 * radius).toFixed(3)} 0a${r} ${r} 0 1 0 ${(2 * radius).toFixed(3)} 0`;
        }).join('')} />
      ))}
    </svg>
  );
}
