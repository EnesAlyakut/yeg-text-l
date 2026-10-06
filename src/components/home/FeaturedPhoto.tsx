import Image from "next/image";
import Link from "next/link";
import type { ImageRef } from "@/lib/content-types";
import { coverFactor, scaleSizes } from "@/lib/images";

type Props = { image: ImageRef; href: string; alt: string; cursor: string; sizes: string };

/** A 16:9 campaign photo tile: slight zoom crops stray edges, more on hover, red rule along the foot. */
export function FeaturedPhoto({ image, href, alt, cursor, sizes }: Props) {
  return (
    <Link href={href} data-cursor={cursor} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden bg-graphite">
        <Image
          src={image.url}
          alt={alt}
          fill
          sizes={scaleSizes(sizes, coverFactor(image, 16 / 9, 1.1))}
          quality={95}
          placeholder={image.blur ? "blur" : "empty"}
          blurDataURL={image.blur ?? undefined}
          className="scale-[1.03] object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
          style={{ objectPosition: image.position }}
        />
        <span
          aria-hidden
          className="absolute bottom-0 left-0 z-[1] h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
      </div>
    </Link>
  );
}
