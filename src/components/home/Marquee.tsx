import { cn } from "@/lib/utils";

type Props = { items: string[]; reverse?: boolean; outline?: boolean; className?: string; duration?: number; size?: "md" | "sm" };

const SIZES = { md: "text-[clamp(2rem,4.8vw,4.5rem)]", sm: "text-[clamp(1.5rem,3.1vw,2.9rem)]" };

/** CSS-only infinite marquee (no JS cost). The track is rendered twice for a seamless loop. */
export function Marquee({ items, reverse, outline, className, duration = 38, size = "md" }: Props) {
  // Short word lists are repeated so one track is always wider than the widest screen (no gap at the loop seam).
  const chars = items.join("").length || 1;
  const reps = Math.max(1, Math.ceil(180 / chars));
  const loop = Array.from({ length: reps }, () => items).flat();
  const track = (hidden: boolean) => (
    <div className="marquee__track" aria-hidden={hidden || undefined}>
      {loop.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={cn("display px-[0.35em] py-[0.14em]", SIZES[size], outline && "text-transparent")}
            style={outline ? { WebkitTextStroke: "1px rgba(243,241,236,0.45)" } : undefined}
          >
            {item}
          </span>
          <span className="block size-[0.6em] shrink-0 rounded-full bg-brand text-[clamp(1rem,2vw,1.6rem)]" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("marquee", reverse && "marquee--reverse", className)}
      // Duration scales with the repeats so the scroll speed stays the same
      style={{ ["--marquee-duration" as string]: `${duration * reps}s` }}
      role="marquee"
      aria-label={items.join(", ")}
    >
      {track(false)}
      {track(true)}
    </div>
  );
}
