import Image from "next/image";
import type { CSSProperties } from "react";
import type { Weave } from "@/content/fabrics";
import type { ImageRef } from "@/lib/content-types";
import { cn } from "@/lib/utils";

const RED = "rgba(216,0,0,0.55)";
const RED_SOFT = "rgba(216,0,0,0.28)";
const BONE = "rgba(243,241,236,0.16)";
const BONE_SOFT = "rgba(243,241,236,0.07)";

/** Woven structures drawn with gradients: dark cloth, bone and red yarns. */
const WEAVES: Record<Weave, CSSProperties> = {
  // Yarn-dyed plaid (shirting)
  check: {
    backgroundColor: "#141414",
    backgroundImage: `repeating-linear-gradient(0deg, transparent 0 22px, ${RED} 22px 24px, transparent 24px 46px, ${BONE} 46px 47px), repeating-linear-gradient(90deg, transparent 0 22px, ${RED} 22px 24px, transparent 24px 46px, ${BONE} 46px 47px)`,
  },
  // Diagonal twill (suiting)
  twill: {
    backgroundColor: "#121212",
    backgroundImage: `repeating-linear-gradient(45deg, ${BONE} 0 2px, transparent 2px 7px), repeating-linear-gradient(45deg, transparent 0 40px, ${RED_SOFT} 40px 42px)`,
  },
  // Open mesh (sportswear)
  mesh: {
    backgroundColor: "#1c1c1c",
    backgroundImage: `radial-gradient(circle, #050505 0 3.2px, transparent 3.8px), linear-gradient(135deg, ${RED_SOFT}, transparent 60%)`,
    backgroundSize: "11px 11px, 100% 100%",
  },
  // Small dobby diamonds
  dobby: {
    backgroundColor: "#131313",
    backgroundImage: `linear-gradient(45deg, ${BONE} 25%, transparent 25%, transparent 75%, ${BONE} 75%), linear-gradient(45deg, ${BONE} 25%, transparent 25%, transparent 75%, ${BONE} 75%), radial-gradient(90% 70% at 80% 10%, ${RED_SOFT}, transparent 70%)`,
    backgroundSize: "14px 14px, 14px 14px, 100% 100%",
    backgroundPosition: "0 0, 7px 7px, 0 0",
  },
  // Canvas / oxford basket weave (workwear)
  canvas: {
    backgroundColor: "#151515",
    backgroundImage: `repeating-linear-gradient(0deg, ${BONE_SOFT} 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, ${BONE} 0 2px, transparent 2px 4px), linear-gradient(0deg, ${RED_SOFT}, transparent 55%)`,
  },
  // Hanging drapery folds (decoration)
  drape: {
    backgroundColor: "#0e0e0e",
    backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.7) 0, rgba(243,241,236,0.09) 26px, rgba(0,0,0,0.7) 52px), linear-gradient(180deg, ${RED_SOFT}, transparent 70%)`,
  },
  // Zebra roller blind (alternating sheer / opaque bands)
  zebra: {
    backgroundColor: "#111",
    backgroundImage: `repeating-linear-gradient(0deg, rgba(243,241,236,0.15) 0 24px, rgba(243,241,236,0.03) 24px 48px), linear-gradient(90deg, transparent 60%, ${RED_SOFT})`,
  },
  // Fine pinstripe (bed linen)
  pinstripe: {
    backgroundColor: "#141414",
    backgroundImage: `repeating-linear-gradient(90deg, transparent 0 15px, ${RED} 15px 16px, transparent 16px 31px, ${BONE} 31px 32px)`,
  },
  // Knit chevrons
  knit: {
    backgroundColor: "#121212",
    backgroundImage: `linear-gradient(135deg, ${BONE} 25%, transparent 25%), linear-gradient(225deg, ${BONE} 25%, transparent 25%), radial-gradient(80% 80% at 20% 90%, ${RED_SOFT}, transparent 70%)`,
    backgroundSize: "14px 14px, 14px 14px, 100% 100%",
    backgroundPosition: "-7px 0, -7px 0, 0 0",
  },
  // Velvet sheen (upholstery)
  velvet: {
    backgroundColor: "#0b0b0b",
    backgroundImage: `radial-gradient(120% 90% at 25% 15%, rgba(216,0,0,0.6), transparent 55%), radial-gradient(90% 80% at 85% 95%, rgba(143,0,0,0.55), transparent 60%), repeating-linear-gradient(100deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)`,
  },
  // Quilted diamonds (mattress ticking)
  quilt: {
    backgroundColor: "#131313",
    backgroundImage: `repeating-linear-gradient(45deg, transparent 0 24px, ${BONE} 24px 25px), repeating-linear-gradient(-45deg, transparent 0 24px, ${BONE} 24px 25px), radial-gradient(70% 70% at 50% 50%, ${RED_SOFT}, transparent 75%)`,
  },
  // Ripstop grid (tent / technical)
  ripstop: {
    backgroundColor: "#141414",
    backgroundImage: `linear-gradient(${RED} 1px, transparent 1px), linear-gradient(90deg, ${RED} 1px, transparent 1px), repeating-linear-gradient(0deg, ${BONE_SOFT} 0 1px, transparent 1px 3px)`,
    backgroundSize: "20px 20px, 20px 20px, 100% 100%",
  },
};

/**
 * A fabric swatch: the woven pattern, a soft vignette and fine grain. Zooms in on group hover.
 * A photo uploaded in the admin replaces the drawn pattern.
 */
export function FabricSwatch({ weave, className, image, sizes = "(min-width: 768px) 33vw, 100vw" }: { weave: Weave; className?: string; image?: ImageRef | null; sizes?: string }) {
  return (
    <div className={cn("grain relative overflow-hidden bg-graphite", className)}>
      {image ? (
        <Image
          src={image.url}
          alt=""
          fill
          sizes={sizes}
          quality={95}
          placeholder={image.blur ? "blur" : "empty"}
          blurDataURL={image.blur ?? undefined}
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          style={{ objectPosition: image.position }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute -inset-4 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-[1.5deg]"
          style={WEAVES[weave]}
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(85%_85%_at_50%_45%,transparent_45%,rgba(0,0,0,0.65))]" />
    </div>
  );
}
