// The Zylerverse app icon: interconnected nodes orbiting a central spark —
// curiosity, exploration, and connected ideas. Pure inline SVG so it scales
// crisply and needs no asset loading.
export default function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Zylerverse">
      <defs>
        <linearGradient id="zv-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8c76f8" />
          <stop offset="1" stopColor="#5a45e8" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#zv-bg)" />
      {/* connecting lines */}
      <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <line x1="24" y1="24" x2="13" y2="14" />
        <line x1="24" y1="24" x2="35" y2="15" />
        <line x1="24" y1="24" x2="14" y2="34" />
        <line x1="24" y1="24" x2="34" y2="34" />
      </g>
      {/* orbiting nodes */}
      <g fill="#ffffff">
        <circle cx="13" cy="14" r="3" />
        <circle cx="35" cy="15" r="2.4" />
        <circle cx="14" cy="34" r="2.4" />
        <circle cx="34" cy="34" r="3" />
      </g>
      {/* central spark */}
      <circle cx="24" cy="24" r="5.2" fill="#ffffff" />
      <circle cx="24" cy="24" r="2.4" fill="#5a45e8" />
    </svg>
  );
}
