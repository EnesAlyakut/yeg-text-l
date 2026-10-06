import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deletePost } from "../actions";
import { PostForm } from "../PostForm";

export const metadata = { title: "Yazıyı düzenle" };

export default async function EditPost({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const [post, categories] = await Promise.all([db.blog.findUnique({ where: { id } }), db.blogCategory.findMany({ orderBy: { sortOrder: "asc" } })]);
  if (!post) notFound();
  return (
    <>
      <PageTitle
        title={post.titleTr}
        description={post.titleEn}
        actions={
          <>
            <Link href={`/blog/${post.slug}`} target="_blank" className="admin-btn">
              Sitede gör ↗
            </Link>
            <DeleteButton action={deletePost.bind(null, post.id)} />
          </>
        }
      />
      <PostForm post={post} categories={categories} />
    </>
  );
}
