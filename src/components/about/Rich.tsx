import { Fragment } from "react";

/**
 * Inline markup for About copy: *word* → red accent.
 * In uppercase settings the brand name is marked lang="en" so Turkish casing
 * doesn't turn "Textile" into "TEXTİLE".
 */
export function Rich({ text, upper }: { text: string; upper?: boolean }) {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
        <em key={i} className="not-italic text-brand">
          <Brand text={part.slice(1, -1)} upper={upper} />
        </em>
      ) : (
        <Fragment key={i}>
          <Brand text={part} upper={upper} />
        </Fragment>
      ),
    );
}

function Brand({ text, upper }: { text: string; upper?: boolean }) {
  if (!upper) return text;
  return text.split(/(YEG Textile)/g).map((part, i) =>
    part === "YEG Textile" ? (
      <span key={i} lang="en">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
