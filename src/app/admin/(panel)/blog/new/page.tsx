import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { PostForm } from "../PostForm";

export const metadata = { title: "Yeni yazı" };

export default async function NewPost() {
  const categories = await db.blogCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageTitle title="Yeni yazı" />
      <PostForm categories={categories} />
    </>
  );
}
