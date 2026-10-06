import { TaxonomyTable } from "@/components/admin/TaxonomyTable";
import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Blog kategorileri" };

export default async function AdminBlogCategories() {
  const rows = await db.blogCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { posts: true } } } });
  return (
    <>
      <PageTitle title="Blog kategorileri" />
      <TaxonomyTable kind="blogCategory" countLabel="Yazı"
        rows={rows.map((r) => ({ id: r.id, nameTr: r.nameTr, nameEn: r.nameEn, nameFr: r.nameFr, slug: r.slug, sortOrder: r.sortOrder, count: r._count.posts }))} />
    </>
  );
}
