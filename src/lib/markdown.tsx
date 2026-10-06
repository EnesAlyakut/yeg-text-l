import type { ReactNode } from "react";

/**
 * Minimal, XSS-safe markdown for journal posts written in the admin:
 * paragraphs, ## / ### headings, > quotes, - lists, **bold**, *italic*, [links](url).
 * Output is React elements — raw HTML in the source is rendered as text.
 */
export function renderMarkdown(source: string): ReactNode[] {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return blocks.map((block, i) => {
    const text = block.trim();
    if (!text) return null;
    if (text.startsWith("### ")) return <h3 key={i}>{inline(text.slice(4))}</h3>;
    if (text.startsWith("## ")) return <h2 key={i}>{inline(text.slice(3))}</h2>;
    if (text.startsWith("> ")) return <blockquote key={i}>{inline(text.replace(/^>\s?/gm, ""))}</blockquote>;
    const lines = text.split("\n");
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{inline(l.replace(/^[-*]\s+/, ""))}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{lines.flatMap((l, j) => (j ? [<br key={`br${j}`} />, ...inline(l)] : inline(l)))}</p>;
  });
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else if (m[2]) out.push(<em key={m.index}>{m[2]}</em>);
    else if (m[3])
      out.push(
        <a key={m.index} href={m[4]} className="link-line text-bone" {...(m[4].startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
          {m[3]}
        </a>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
