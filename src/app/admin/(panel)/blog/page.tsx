import { Empty, LinkButton, PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { readGallery } from "@/lib/queries";
import { PostsTable } from "./PostsTable";

export const metadata = { title: "Blog" };

export default async function AdminBlog() {
  const [posts, categories] = await Promise.all([
    db.blog.findMany({ orderBy: { publishedAt: "desc" } }),
    db.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <>
      <PageTitle title="Blog yazıları" description={`${posts.length} yazı`} actions={<LinkButton href="/admin/blog/new" primary>+ Yeni yazı</LinkButton>} />
      {posts.length === 0 ? (
        <Empty>Henüz yazı yok.</Empty>
      ) : (
        <PostsTable
          categories={categories.map((c) => ({ id: c.id, name: c.nameTr }))}
          rows={posts.map((p) => ({
            id: p.id,
            titleTr: p.titleTr,
            titleEn: p.titleEn,
            categoryId: p.categoryId,
            publishedAt: p.publishedAt.toISOString(),
            published: p.published,
            isFeatured: p.isFeatured,
          }))}
          meta={Object.fromEntries(posts.map((p) => [p.id, { cover: p.coverUrl ? { url: p.coverUrl, position: p.coverPosition } : null, galleryCount: readGallery(p.gallery).length }]))}
        />
      )}
    </>
  );
}
