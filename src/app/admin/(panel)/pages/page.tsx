import Link from "next/link";
import { PageTitle } from "@/components/admin/ui";
import { PAGE_KEYS, PAGE_LABELS } from "@/lib/page-content";

export default function PagesIndex() {
  return (
    <>
      <PageTitle title="Sayfalar" description="Sitedeki sabit sayfaların tüm metinleri ve görselleri." />
      <ul className="grid gap-4 sm:grid-cols-2">
        {PAGE_KEYS.map((k) => (
          <li key={k}>
            <Link href={`/admin/pages/${k}`} className="admin-card block transition-colors hover:border-brand">
              <h2 className="text-sm font-semibold">{PAGE_LABELS[k].title}</h2>
              <p className="mt-1 text-xs text-ash">{PAGE_LABELS[k].description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
