import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * Mouse-tracked 3D tilt card with depth shadow, glare, and lift.
 * Wrap any content — it becomes an animated, perspective card.
 */
export function Tilt3D({
  children,
  className = "",
  max = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      className={`group/tilt relative h-full [perspective:1200px] ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={ref}
        className="relative h-full rounded-xl border border-border bg-surface transition-[transform,box-shadow] duration-200 ease-out will-change-transform [transform-style:preserve-3d] group-hover/tilt:shadow-elevated"
        style={{
          transform:
            "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
        }}
      >
        {/* Depth halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{
            background:
              "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, #FF5A5F 22%, transparent), transparent 55%)",
            filter: "blur(20px)",
            zIndex: -1,
          }}
        />
        {/* Content — lifted on Z for parallax feel */}
        <div className="relative h-full [transform:translateZ(30px)]">{children}</div>
        {/* Glare sweep */}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-0 transition-opacity duration-200 group-hover/tilt:opacity-100"
            style={{
              background:
                "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), oklch(1 0 0 / 0.06), transparent 40%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
