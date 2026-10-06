import Image from "next/image";
import Link from "next/link";
import { localePath, pick, type Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { coverFactor, scaleSizes } from "@/lib/images";
import { cn, readingMinutes } from "@/lib/utils";

type Post = {
  slug: string;
  titleEn: string;
  titleTr: string;
  titleFr: string | null;
  excerptEn: string | null;
  excerptTr: string | null;
  excerptFr: string | null;
  contentEn: string;
  contentTr: string;
  contentFr: string | null;
  coverUrl: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  coverBlur: string | null;
  coverPosition: string;
  publishedAt: Date;
  category: { nameEn: string; nameTr: string; nameFr: string | null } | null;
};

type Props = { post: Post; lang: Locale; labels: { read: string; minRead: string }; size?: "lg" | "md"; className?: string; sizes?: string };

export function BlogCard({ post, lang, labels, size = "md", className, sizes = "(min-width: 768px) 33vw, 100vw" }: Props) {
  const title = pick(post, "title", lang);
  const excerpt = pick(post, "excerpt", lang);
  const minutes = readingMinutes(pick(post, "content", lang));

  return (
    <Link href={localePath(lang, `/blog/${post.slug}`)} data-cursor={labels.read} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-graphite", size === "lg" ? "aspect-[16/10]" : "aspect-[4/5]")}>
        {post.coverUrl && (
          <Image
            src={post.coverUrl}
            alt={title}
            fill
            sizes={scaleSizes(sizes, coverFactor(post.coverWidth && post.coverHeight ? { width: post.coverWidth, height: post.coverHeight } : null, size === "lg" ? 16 / 10 : 4 / 5, 1.05))}
            placeholder={post.coverBlur ? "blur" : "empty"}
            blurDataURL={post.coverBlur ?? undefined}
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            style={{ objectPosition: post.coverPosition }}
          />
        )}
      </div>
      <div className="eyebrow mt-5 flex items-center gap-3 text-ash">
        {post.category && <span className="text-brand">{pick(post.category, "name", lang)}</span>}
        <span>{formatDate(post.publishedAt, lang)}</span>
        <span>·</span>
        <span>
          {minutes} {labels.minRead}
        </span>
      </div>
      <h3 className={cn("display mt-3 transition-colors duration-500 group-hover:text-brand", size === "lg" ? "text-[clamp(1.75rem,2.4vw,2.6rem)]" : "text-[1.75rem]")}>
        {title}
      </h3>
      {excerpt && <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">{excerpt}</p>}
    </Link>
  );
}
