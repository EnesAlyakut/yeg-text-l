import { ImageSlider } from "@/components/motion/ImageSlider";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/site/Button";
import type { ImageRef } from "@/lib/content-types";
import { coverSizes } from "@/lib/images";

type Props = { image: ImageRef; images?: ImageRef[]; title: string; text: string; cta: { label: string; href: string } };

export function Banner({ image, images = [], title, text, cta }: Props) {
  const slides = [image, ...images].map((i) => ({ url: i.url, width: i.width, height: i.height, blur: i.blur, position: i.position }));
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {slides.length > 1 ? (
          <ImageSlider slides={slides} controls={false} interval={7500} sizes={coverSizes(image.width, image.height)} quality={90} className="h-full w-full" />
        ) : (
          <ParallaxImage
            src={image.url}
            alt=""
            width={image.width}
            height={image.height}
            blur={image.blur}
            position={image.position}
            speed={18}
            reveal={false}
            className="h-full w-full"
          />
        )}
        {/* Darker toward the copy (bottom-left) so the white type reads on the red photo */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(5,5,5,0.7)_0%,rgba(5,5,5,0.35)_45%,transparent_75%)]" />
      </div>
      {/* Copy sits a little above the foot of the frame */}
      <div className="container-x flex min-h-[78svh] flex-col justify-end pb-24 pt-16 md:pb-36 md:pt-24">
        <SplitText lines={[title]} className="display max-w-[16ch] text-fluid-xl text-bone [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]" />
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base leading-relaxed text-bone/85">{text}</p>
          <ButtonLink href={cta.href} variant="solid">
            {cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
