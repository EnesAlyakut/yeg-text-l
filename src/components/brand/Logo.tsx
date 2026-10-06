import { cn } from "@/lib/utils";
import { MONOGRAM_PATHS, WORDMARK_PATHS } from "./logo-paths";

type Props = {
  className?: string;
  /** Show the TEXTILE wordmark under the monogram */
  wordmark?: boolean;
  /** Colour of the monogram (defaults to currentColor) */
  monogramClassName?: string;
  wordmarkClassName?: string;
  title?: string;
};

export function Logo({ className, wordmark = true, monogramClassName, wordmarkClassName, title = "YEG Textile" }: Props) {
  return (
    <svg
      viewBox={wordmark ? "12 30 176 140" : "12 30 176 122"}
      className={cn("block h-auto", className)}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={cn("fill-current", monogramClassName)}>
        {MONOGRAM_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {wordmark && (
        <g className={cn("fill-current", wordmarkClassName)}>
          {WORDMARK_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}
