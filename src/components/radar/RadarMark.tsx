export function RadarMark({ size = 28, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full border border-primary/30" />
      <span className="absolute inset-[22%] rounded-full border border-primary/25" />
      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      <span
        className={`absolute inset-0 overflow-hidden rounded-full ${animated ? "animate-radar-sweep" : ""}`}
      >
        <span className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-top-left bg-gradient-to-br from-primary-glow/50 to-transparent" />
      </span>
    </span>
  );
}
