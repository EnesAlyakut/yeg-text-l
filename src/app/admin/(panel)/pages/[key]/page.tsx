import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { FabricsEditor } from "@/components/admin/FabricsEditor";
import { PageTitle } from "@/components/admin/ui";
import { loadPage, PAGE_KEYS, PAGE_LABELS, type PageKey } from "@/lib/page-content";
import { resetPageContent, saveFabrics, savePageContent } from "../actions";

export default async function EditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(PAGE_KEYS as string[]).includes(key)) notFound();
  const k = key as PageKey;
  const [data, details] = await Promise.all([loadPage(k), k === "fabrics" ? loadPage("fabric-details") : null]);

  return (
    <>
      <PageTitle
        title={PAGE_LABELS[k].title}
        description={PAGE_LABELS[k].description}
        actions={
          <form action={resetPageContent}>
            <input type="hidden" name="key" value={k} />
            <button type="submit" className="admin-btn">
              Varsayılana döndür
            </button>
          </form>
        }
      />
      {k === "fabrics" ? <FabricsEditor initial={data} details={details} action={saveFabrics} /> : <ContentEditor pageKey={k} initial={data} action={savePageContent} />}
    </>
  );
}
