import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { SplitText } from "@/components/motion/SplitText";
import { BlogCard } from "@/components/site/BlogCard";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { Glow } from "@/components/site/Glow";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { hasLocale, localePath, pick } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatDate } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug, getPosts, readGallery, staticSlugs } from "@/lib/queries";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { readingMinutes } from "@/lib/utils";

export function generateStaticParams() {
  return staticSlugs("blog");
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    lang,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt.toISOString(),
    title: pick(post, "seoTitle", lang) || pick(post, "title", lang),
    description: pick(post, "seoDescription", lang) || pick(post, "excerpt", lang),
    image: post.coverUrl ? { url: post.coverUrl, width: post.coverWidth ?? undefined, height: post.coverHeight ?? undefined } : null,
  });
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [post, all] = await Promise.all([getPostBySlug(slug), getPosts()]);
  if (!post) notFound();
  const dict = getDictionary(lang);
  const title = pick(post, "title", lang);
  const content = pick(post, "content", lang);
  const excerpt = pick(post, "excerpt", lang);
  const more = all.filter((p) => p.id !== post.id).slice(0, 2);
  const category = post.category ? pick(post.category, "name", lang) : null;

  return (
    <>
      <ReadingProgress target="post" />
      <article id="post">
        <header className="container-x relative isolate pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
          <Glow className="-top-[var(--nav-h)]" />
          <nav className="eyebrow flex items-center gap-2 text-ash" aria-label="Breadcrumb">
            <Link href={localePath(lang, "/blog")} className="link-line hover:text-bone">
              {dict.blog.title}
            </Link>
            {category && (
              <>
                <span className="text-brand">/</span>
                <span className="text-brand">{category}</span>
              </>
            )}
          </nav>
          <SplitText as="h1" trigger="mount" lines={[title]} className="display mt-6 max-w-[18ch] text-fluid-xl" />
          <div className="eyebrow mt-8 flex flex-wrap gap-x-6 gap-y-2 text-ash">
            <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt, lang)}</time>
            <span className="text-brand" aria-hidden>·</span>
            <span>
              {readingMinutes(content)} {dict.common.minRead}
            </span>
            <span className="text-brand" aria-hidden>·</span>
            <span lang="en">{post.author}</span>
          </div>
        </header>

        {post.coverUrl && (
          <div className="mt-14 md:mt-20">
            <ParallaxImage
              src={post.coverUrl}
              alt={title}
              width={post.coverWidth ?? 1600}
              height={post.coverHeight ?? 1000}
              blur={post.coverBlur}
              position={post.coverPosition}
              speed={12}
              reveal={false}
              preload
              frameAspect={(post.coverWidth ?? 0) >= 1600 ? undefined : 4 / 5}
              className={(post.coverWidth ?? 0) >= 1600 ? "h-[60svh] w-full md:h-[85svh]" : "mx-auto aspect-[4/5] w-full max-w-2xl"}
            />
          </div>
        )}

        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:py-28">
          {excerpt && <p className="self-start border-l-2 border-brand pl-5 text-lg leading-snug text-bone md:col-span-4">{excerpt}</p>}
          <div className="prose-yeg md:col-span-7 md:col-start-6">{renderMarkdown(content)}</div>
          {readGallery(post.gallery).length > 0 && (
            <div className="md:col-span-10 md:col-start-2 md:mt-8">
              <GalleryGrid images={readGallery(post.gallery)} lang={lang} columns={readGallery(post.gallery).length < 3 ? 2 : 3} />
            </div>
          )}
        </div>
      </article>

      {more.length > 0 && (
        <section className="container-x border-t border-line py-24">
          <p className="eyebrow flex items-center gap-3 text-ash">
            <span aria-hidden className="h-px w-8 bg-brand/60" />
            {dict.blog.moreStories}
          </p>
          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-6">
            {more.map((p) => (
              <BlogCard key={p.id} post={p} lang={lang} labels={{ read: dict.common.readMore, minRead: dict.common.minRead }} size="lg" sizes="(min-width: 768px) 50vw, 100vw" />
            ))}
          </div>
        </section>
      )}

      <JsonLdScript
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: excerpt,
            image: post.coverUrl ? [absoluteUrl(post.coverUrl)] : undefined,
            datePublished: post.publishedAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: "YEG Textile", logo: { "@type": "ImageObject", url: absoluteUrl("/media/brand/logo-badge-red.svg") } },
            mainEntityOfPage: absoluteUrl(localePath(lang, `/blog/${post.slug}`)),
            inLanguage: lang,
            articleSection: category ?? undefined,
          },
          breadcrumbSchema([
            { name: dict.nav.home, url: localePath(lang, "/") },
            { name: dict.blog.title, url: localePath(lang, "/blog") },
            { name: title, url: localePath(lang, `/blog/${post.slug}`) },
          ]),
        ]}
      />
    </>
  );
}
