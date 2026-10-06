"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLenis } from "@/components/motion/SmoothScroll";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import { handleSectionClick } from "./section-scroll";

type Props = { lang: Locale; path: string; id: string; className?: string; children: ReactNode };

/** Link to a section of a page: smooth scroll when already there, otherwise navigate and land on it. */
export function SectionLink({ lang, path, id, className, children }: Props) {
  const lenis = useLenis();
  const here = stripLocale(usePathname()) === path;
  return (
    <Link href={`${localePath(lang, path)}#${id}`} onClick={(e) => here && handleSectionClick(e, id, lenis)} className={className}>
      {children}
    </Link>
  );
}
