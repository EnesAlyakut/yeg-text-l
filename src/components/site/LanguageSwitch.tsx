"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, locales, stripLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitch({ lang, className, onNavigate }: { lang: Locale; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const base = stripLocale(pathname);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="text-ash/60">/</span>}
          <Link
            href={localePath(l, base)}
            hrefLang={l}
            onClick={onNavigate}
            aria-current={l === lang ? "true" : undefined}
            className={cn("link-line transition-colors", l === lang ? "text-bone" : "text-ash hover:text-bone")}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
