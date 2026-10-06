import { JsonLd } from "@/lib/seo";

export function JsonLdScript({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data })} />;
}
