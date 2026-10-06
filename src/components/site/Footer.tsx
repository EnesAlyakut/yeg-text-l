import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { localePath, pick, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ContactSettings } from "@/lib/content-types";
import { ABOUT_PATH, aboutMenu } from "@/content/about-sections";
import { AR_GE_ID, HOME_PATH, arGeLabel } from "@/content/site-sections";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./ContactIcons";
import { LanguageSwitch } from "./LanguageSwitch";
import { SectionLink } from "./SectionLink";

type Props = { lang: Locale; dict: Dictionary; contact: ContactSettings };

const BACK_TO_TOP: Record<Locale, string> = { tr: "Yukarı", en: "Top", fr: "Haut" };

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3 text-ash">
      <span aria-hidden className="h-px w-6 bg-brand" />
      {children}
    </p>
  );
}

export function Footer({ lang, dict, contact }: Props) {
  const nav = [
    { href: "/", label: dict.nav.home },
    { href: "/products", label: dict.nav.products },
    { href: "/collections", label: dict.nav.collections },
    { href: "/about", label: dict.nav.about },
    { href: "/production", label: dict.nav.production },
    { href: "/fabrics", label: dict.nav.fabrics },
    { href: "/sustainability", label: dict.nav.sustainability },
    { href: "/blog", label: dict.nav.blog },
    { href: "/contact", label: dict.nav.contact },
  ];
  const wa = contact.whatsapp.replace(/[^\d]/g, "");
  const about = aboutMenu(lang);
  const channels = [
    { href: `mailto:${contact.email}`, label: contact.email, Icon: MailIcon },
    { href: `tel:${contact.phone.replace(/\s/g, "")}`, label: contact.phone, Icon: PhoneIcon },
    { href: `https://wa.me/${wa}`, label: "WhatsApp", Icon: WhatsAppIcon, external: true },
    { href: `https://instagram.com/${contact.instagram}`, label: `@${contact.instagram}`, Icon: InstagramIcon, external: true },
  ];
  const socials = [
    { href: `https://instagram.com/${contact.instagram}`, label: "Instagram", Icon: InstagramIcon },
    { href: `https://wa.me/${wa}`, label: "WhatsApp", Icon: WhatsAppIcon },
    { href: `mailto:${contact.email}`, label: "E-mail", Icon: MailIcon },
  ];

  return (
    // Dark red ground, deepening slightly toward the foot
    <footer className="relative isolate overflow-hidden border-t border-line bg-[linear-gradient(180deg,#2a0404_0%,#220303_60%,#1a0202_100%)]">
      <span aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-80" />

      {/* ——— Columns */}
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-3">
          <Logo className="w-24" monogramClassName="text-brand" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">{dict.footer.tagline}</p>
          <ul className="mt-8 flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full border border-line text-bone/80 transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white"
                >
                  <Icon width={18} height={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu */}
        <nav aria-label={dict.footer.navigate} className="lg:col-span-2">
          <ColumnTitle>{dict.footer.navigate}</ColumnTitle>
          <ul className="mt-6 space-y-3">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={localePath(lang, l.href)} className="link-line text-sm text-bone/90 transition-colors hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <SectionLink lang={lang} path={HOME_PATH} id={AR_GE_ID} className="link-line text-sm text-bone/90 transition-colors hover:text-brand">
                {arGeLabel(lang)}
              </SectionLink>
            </li>
          </ul>
        </nav>

        {/* About chapters, in two short columns */}
        <nav aria-label={about.submenu} className="lg:col-span-4">
          <ColumnTitle>{dict.nav.about}</ColumnTitle>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
            {about.items.map((item) => (
              <li key={item.id}>
                <SectionLink lang={lang} path={ABOUT_PATH} id={item.id} className="text-[0.8125rem] leading-snug text-mist transition-colors hover:text-bone">
                  {item.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + language */}
        <div className="lg:col-span-3">
          <ColumnTitle>{dict.footer.connect}</ColumnTitle>
          <ul className="mt-6 space-y-3.5 text-sm">
            {channels.map(({ href, label, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group inline-flex items-center gap-3 text-bone/90 transition-colors hover:text-bone"
                >
                  <Icon className="shrink-0 text-ash transition-colors duration-300 group-hover:text-brand" />
                  <span className="link-line">{label}</span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3 text-ash">
              <PinIcon className="shrink-0" />
              {pick(contact, "address", lang)}
            </li>
          </ul>
          <div className="eyebrow mt-8 flex items-center gap-4">
            <span className="text-ash">{dict.nav.language}</span>
            <LanguageSwitch lang={lang} />
          </div>
        </div>
      </div>

      {/* ——— Bottom bar */}
      <div className="relative border-t border-line">
        <div className="container-x eyebrow flex flex-col gap-4 py-6 text-ash md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Lizart Dijital. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-8">
            <Link href={localePath(lang, "/privacy")} className="link-line hover:text-bone">
              {dict.footer.privacy}
            </Link>
            <a href="#main" className="group inline-flex items-center gap-2 transition-colors hover:text-bone">
              {BACK_TO_TOP[lang]}
              <span aria-hidden className="text-brand transition-transform duration-500 group-hover:-translate-y-0.5">
                ↑
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
