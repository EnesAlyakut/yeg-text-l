"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Logo } from "@/components/brand/Logo";
import { useLenis } from "@/components/motion/SmoothScroll";
import { siteSubmenus } from "@/content/site-sections";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "./LanguageSwitch";
import { handleSectionClick } from "./section-scroll";

type Props = { lang: Locale; nav: Dictionary["nav"]; contact: { email: string; instagram: string } };

const EASE = [0.76, 0, 0.24, 1] as const;
const menuId = (href: string) => `submenu-${href === "/" ? "home" : href.slice(1)}`;

export function Navbar({ lang, nav, contact }: Props) {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // `section` links point at a part of a page (R&D on the home page), like the footer menu.
  const links: { href: string; label: string; section?: { path: string; id: string } }[] = [
    { href: "/", label: nav.home },
    { href: "/products", label: nav.products },
    { href: "/collections", label: nav.collections },
    { href: "/about", label: nav.about },
    { href: "/production", label: nav.production },
    { href: "/fabrics", label: nav.fabrics },
    { href: "/sustainability", label: nav.sustainability },
    { href: "/blog", label: nav.blog },
    { href: "/contact", label: nav.contact },
  ];
  const current = stripLocale(pathname);
  const isActive = (href: string) => (href === "/" ? current === "/" : current.startsWith(href));
  const linkHref = (l: (typeof links)[number]) => (l.section ? `${localePath(lang, l.section.path)}#${l.section.id}` : localePath(lang, l.href));

  // Section submenus (Home → R&D, About → its chapters): desktop dropdown + mobile accordion.
  const submenus = siteSubmenus(lang);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState<string | null>(null);
  const [spied, setSpied] = useState<string | null>(null);
  const closeTimer = useRef(0);
  const menuItems = useRef<Record<string, HTMLLIElement | null>>({});
  const menuToggles = useRef<Record<string, HTMLButtonElement | null>>({});
  const sectionHref = (path: string, id: string) => `${localePath(lang, path)}#${id}`;
  const activeSection = (path: string) => (current === path ? spied : null);

  const openSubmenu = (href: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(href);
  };
  const closeSubmenuSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };
  // Touch screens wide enough for the desktop bar: first tap opens the dropdown, second follows the link.
  const onParentClick = (e: MouseEvent, href: string) => {
    if (openMenu !== href && window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      openSubmenu(href);
    }
  };
  // Already on that page → smooth scroll in place; elsewhere the Link navigates and the page lands on the hash.
  const onSectionClick = (e: MouseEvent, path: string, id: string, fromMobile = false) => {
    setOpenMenu(null);
    if (fromMobile) setOpen(false);
    // Mobile: wait for the menu to release the scroll lock before scrolling.
    if (current === path) handleSectionClick(e, id, lenis, { delay: fromMobile ? 60 : 0 });
  };

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation and lock scrolling while it is open.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with router
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Desktop dropdown: Escape and outside clicks close it.
  useEffect(() => {
    if (!openMenu) return;
    const item = () => menuItems.current[openMenu];
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      if (item()?.contains(document.activeElement)) menuToggles.current[openMenu]?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!item()?.contains(e.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [openMenu]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // On a page with a submenu, mark the section being read in the dropdown / accordion.
  useEffect(() => {
    const menu = siteSubmenus(lang)[current];
    if (!menu) return;
    const targets = menu.items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setSpied(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [current, lang]);
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,transform,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled && !open ? "border-b border-white/5 bg-ink/85 backdrop-blur-md" : "border-b border-transparent bg-transparent",
          hidden && !open && !openMenu && "-translate-y-full",
        )}
      >
        <nav className="container-x flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Main">
          <Link href={localePath(lang, "/")} className="relative z-10 text-bone" aria-label="YEG Textile — home">
            <Logo className="w-[68px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] md:w-[84px]" monogramClassName="text-brand" wordmarkClassName="text-bone" />
          </Link>

          <ul className="eyebrow hidden items-center gap-6 lg:flex xl:gap-8">
            {links.map((l) => {
              const sub = submenus[l.href];
              const linkClass = cn("link-line transition-colors after:bg-brand", isActive(l.href) ? "text-bone" : "text-mist hover:text-bone");
              if (l.section) {
                const { path, id } = l.section;
                const here = activeSection(path) === id;
                return (
                  <li key={l.href}>
                    <Link
                      href={linkHref(l)}
                      onClick={(e) => onSectionClick(e, path, id)}
                      aria-current={here ? "location" : undefined}
                      className={cn("link-line transition-colors after:bg-brand", here ? "text-bone" : "text-mist hover:text-bone")}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              }
              if (!sub) {
                return (
                  <li key={l.href}>
                    <Link href={localePath(lang, l.href)} aria-current={isActive(l.href) ? "page" : undefined} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = openMenu === l.href;
              return (
                <li
                  key={l.href}
                  ref={(el) => {
                    menuItems.current[l.href] = el;
                  }}
                  className="relative"
                  onPointerEnter={(e) => e.pointerType === "mouse" && openSubmenu(l.href)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && closeSubmenuSoon()}
                  onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setOpenMenu((v) => (v === l.href ? null : v))}
                >
                  <Link
                    href={localePath(lang, l.href)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    onClick={(e) => onParentClick(e, l.href)}
                    className={linkClass}
                  >
                    {l.label}
                  </Link>
                  {/* Sits in the gap after the label so the other items keep their exact positions */}
                  <button
                    ref={(el) => {
                      menuToggles.current[l.href] = el;
                    }}
                    type="button"
                    onClick={() => (isOpen ? setOpenMenu(null) : openSubmenu(l.href))}
                    aria-expanded={isOpen}
                    aria-controls={menuId(l.href)}
                    aria-label={sub.submenu}
                    className={cn(
                      "absolute left-full top-1/2 ml-1 -translate-y-1/2 p-1 transition-colors duration-300",
                      isOpen ? "text-brand" : "text-ash hover:text-bone",
                    )}
                  >
                    <svg aria-hidden viewBox="0 0 8 5" className={cn("block w-2 transition-transform duration-500", isOpen && "rotate-180")}>
                      <path d="M.5.5 4 4 7.5.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <m.div
                        id={menuId(l.href)}
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-[calc(var(--nav-h)/2-0.5rem)] font-sans normal-case tracking-normal"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div
                          className={cn(
                            "relative border border-white/10 bg-coal p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]",
                            sub.items.length > 3 ? "w-[22rem]" : "w-[15rem]",
                          )}
                        >
                          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand via-brand/40 to-transparent" />
                          <p className="eyebrow flex items-center gap-3 px-3 pb-2 pt-3 text-ash">
                            <span aria-hidden className="h-px w-5 bg-brand" />
                            {l.label}
                          </p>
                          <ul>
                            {sub.items.map((item) => {
                              const active = activeSection(l.href) === item.id;
                              return (
                                <li key={item.id}>
                                  <Link
                                    href={sectionHref(l.href, item.id)}
                                    onClick={(e) => onSectionClick(e, l.href, item.id)}
                                    aria-current={active ? "location" : undefined}
                                    className={cn(
                                      "group flex items-baseline gap-4 px-3 py-[0.45rem] text-[0.8125rem] leading-snug transition-colors duration-300 hover:bg-white/[0.03] hover:text-bone",
                                      active ? "text-bone" : "text-mist",
                                    )}
                                  >
                                    <span className="flex-1">{item.label}</span>
                                    <span
                                      aria-hidden
                                      className={cn(
                                        "h-px self-center bg-brand transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-5",
                                        active ? "w-5" : "w-0",
                                      )}
                                    />
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="eyebrow flex items-center gap-6">
            <LanguageSwitch lang={lang} className="hidden lg:flex" />
            <button
              type="button"
              onClick={() => {
                setOpen((v) => !v);
                setMobileMenu(null);
              }}
              className="relative z-10 flex items-center gap-3 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span>{open ? nav.close : nav.menu}</span>
              <span className="relative block h-3 w-6" aria-hidden>
                <span className={cn("absolute left-0 h-px w-full bg-bone transition-all duration-500", open ? "top-1.5 rotate-45" : "top-0.5")} />
                <span className={cn("absolute left-0 h-px w-full bg-bone transition-all duration-500", open ? "top-1.5 -rotate-45" : "top-2.5")} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-ink lg:hidden"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="container-x flex flex-1 flex-col justify-between pb-10 pt-[calc(var(--nav-h)+2rem)]">
              <ul className="flex flex-col gap-1">
                {links.map((l, i) => {
                  const sub = submenus[l.href];
                  const expanded = mobileMenu === l.href;
                  const panelId = `mobile-${menuId(l.href)}`;
                  return (
                    <li key={l.href} className="-mt-[0.14em] overflow-hidden pt-[0.14em]">
                      <m.div
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "110%" }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 + i * 0.05 }}
                      >
                        {sub ? (
                          <>
                            {/* The name goes to the page; the + beside it opens the section list */}
                            <div className={cn("flex items-center gap-4", isActive(l.href) ? "text-brand" : "text-bone")}>
                              <Link
                                href={localePath(lang, l.href)}
                                onClick={() => setOpen(false)}
                                className="display flex items-baseline gap-4 text-[clamp(2.2rem,9vw,3.75rem)]"
                              >
                                <span className="eyebrow text-ash">0{i + 1}</span>
                                {l.label}
                              </Link>
                              <button
                                type="button"
                                onClick={() => setMobileMenu((v) => (v === l.href ? null : l.href))}
                                aria-expanded={expanded}
                                aria-controls={panelId}
                                aria-label={sub.submenu}
                                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line transition-colors active:border-brand"
                              >
                                <span aria-hidden className="relative block size-3.5">
                                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                                  <span
                                    className={cn(
                                      "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-500",
                                      expanded && "scale-y-0",
                                    )}
                                  />
                                </span>
                              </button>
                            </div>
                            <div
                              id={panelId}
                              inert={!expanded}
                              className={cn(
                                "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                              )}
                            >
                              <div className="overflow-hidden">
                                <ul className="mb-4 mt-3 ml-1 border-l border-line pl-5" aria-label={sub.submenu}>
                                  {sub.items.map((item) => {
                                    const active = activeSection(l.href) === item.id;
                                    return (
                                      <li key={item.id}>
                                        <Link
                                          href={sectionHref(l.href, item.id)}
                                          onClick={(e) => onSectionClick(e, l.href, item.id, true)}
                                          aria-current={active ? "location" : undefined}
                                          className={cn("flex items-baseline gap-4 py-2 text-base", active ? "text-bone" : "text-mist")}
                                        >
                                          {item.label}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </>
                        ) : (
                          <Link
                            href={linkHref(l)}
                            onClick={(e) => (l.section ? onSectionClick(e, l.section.path, l.section.id, true) : setOpen(false))}
                            className={cn(
                              "display flex items-baseline gap-4 text-[clamp(2.2rem,9vw,3.75rem)]",
                              (l.section ? activeSection(l.section.path) === l.section.id : isActive(l.href)) ? "text-brand" : "text-bone",
                            )}
                          >
                            <span className="eyebrow text-ash">0{i + 1}</span>
                            {l.label}
                          </Link>
                        )}
                      </m.div>
                    </li>
                  );
                })}
              </ul>

              <m.div
                className="eyebrow flex items-end justify-between border-t border-line pt-6 text-mist"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.6 } }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-2 normal-case" lang="en">
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
                    @{contact.instagram}
                  </a>
                </div>
                <LanguageSwitch lang={lang} onNavigate={() => setOpen(false)} />
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
