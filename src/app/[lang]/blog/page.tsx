import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { BlogCard } from "@/components/site/BlogCard";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { PageHeader } from "@/components/site/PageHeader";
import { hasLocale, localePath, pick } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPosts } from "@/lib/queries";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({ lang, path: "/blog", title: dict.blog.title, description: dict.blog.intro });
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const posts = await getPosts();
  const lead = posts.find((p) => p.isFeatured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== lead?.id);
  const labels = { read: dict.common.readMore, minRead: dict.common.minRead };

  return (
    <>
      <PageHeader eyebrow={dict.blog.title} count={posts.length} title={dict.blog.title} intro={dict.blog.intro} />

      {lead && (
        <section className="container-x pb-24">
          <p className="eyebrow mb-6 flex items-center gap-3 text-brand">
            <span aria-hidden className="h-px w-8 bg-brand" />
            {dict.blog.latest}
          </p>
          <Reveal>
            <BlogCard post={lead} lang={lang} labels={labels} size="lg" sizes="100vw" />
          </Reveal>
        </section>
      )}

      {rest.length > 0 && (
        <section className="container-x border-t border-line pb-32 pt-20">
          <p className="eyebrow flex items-center gap-3 text-ash">
            <span aria-hidden className="h-px w-8 bg-brand/60" />
            {dict.blog.moreStories}
          </p>
          <Reveal stagger={0.1} className="mt-12 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <BlogCard key={post.id} post={post} lang={lang} labels={labels} className={i % 3 === 1 ? "lg:mt-24" : undefined} />
            ))}
          </Reveal>
        </section>
      )}

      <JsonLdScript
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `YEG Textile — ${dict.blog.title}`,
            url: absoluteUrl(localePath(lang, "/blog")),
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: pick(p, "title", lang),
              url: absoluteUrl(localePath(lang, `/blog/${p.slug}`)),
              datePublished: p.publishedAt.toISOString(),
            })),
          },
          breadcrumbSchema([
            { name: dict.nav.home, url: localePath(lang, "/") },
            { name: dict.blog.title, url: localePath(lang, "/blog") },
          ]),
        ]}
      />
    </>
  );
}
