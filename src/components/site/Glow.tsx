import { cn } from "@/lib/utils";

const POSITIONS = {
  "top-right": "bg-[radial-gradient(42%_55%_at_88%_0%,rgba(143,0,0,0.26),transparent_75%)]",
  "top-left": "bg-[radial-gradient(42%_55%_at_8%_0%,rgba(143,0,0,0.22),transparent_75%)]",
  bottom: "bg-[radial-gradient(60%_50%_at_50%_100%,rgba(143,0,0,0.22),transparent_75%)]",
};

/** Soft, very dark red light behind a section. The parent needs `relative isolate`. */
export function Glow({ at = "top-right", className }: { at?: keyof typeof POSITIONS; className?: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", POSITIONS[at], className)} />;
}
