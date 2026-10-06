import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ContactForm } from "@/components/site/ContactForm";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/site/ContactIcons";
import { Glow } from "@/components/site/Glow";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { LocationsMap, type MapLocation } from "@/components/site/LocationsMap";
import { flatFabrics } from "@/content/fabrics";
import { hasLocale, localePath, pick } from "@/i18n/config";
import { loadAbout, loadContact, loadFabricDetails, loadFabrics, loadProduction } from "@/lib/page-content";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProducts, getSettings } from "@/lib/queries";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({ lang, path: "/contact", title: dict.contact.title, description: dict.contact.intro });
}

/** Section label as a solid red tag, same as the About page and the homepage's AR-GE tag. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-4">
      <span aria-hidden className="h-[2px] w-10 bg-brand" />
      <span className="display bg-brand px-3 pb-1.5 pt-2 text-[clamp(1.1rem,1.5vw,1.5rem)] leading-none tracking-[0.06em] text-white shadow-[0_0_30px_rgba(216,0,0,0.35)]">
        {children}
      </span>
    </p>
  );
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const c = dict.contact;
  // Page copy, locations, fabric names and the production address are all editable in the admin
  const [{ contact }, products, copy, { a }, { f }, { labels }, { address: PRODUCTION_ADDRESS }] = await Promise.all([
    getSettings(),
    getProducts(),
    loadContact(lang),
    loadAbout(lang),
    loadFabrics(lang),
    loadFabricDetails(lang),
    loadProduction(lang),
  ]);
  const productNames = Object.fromEntries(products.map((p) => [p.slug, pick(p, "name", lang)]));
  const enquiry = labels.enquiry;
  const fabricSubjects = Object.fromEntries(flatFabrics(f).map(({ fabric }) => [fabric.slug, `${enquiry}: ${fabric.title}`]));
  const wa = contact.whatsapp.replace(/[^\d]/g, "");
  const address = pick(contact, "address", lang);
  const mapHref = contact.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const channels = [
    { label: copy.email, value: contact.email, href: `mailto:${contact.email}`, Icon: MailIcon },
    { label: c.phone, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}`, Icon: PhoneIcon },
    { label: c.whatsapp, value: contact.whatsapp, href: `https://wa.me/${wa}`, Icon: WhatsAppIcon, external: true },
    { label: c.instagram, value: `@${contact.instagram}`, href: `https://instagram.com/${contact.instagram}`, Icon: InstagramIcon, external: true },
  ];

  // Same four sites as the About page; Florida is a state, so it gets a wider zoom.
  const locations: MapLocation[] = a.global.locations.map((l) => ({
    city: l.city,
    country: l.country,
    role: l.role,
    lang: l.lang,
    // Denizli has a street address (the production centre); the others are shown at city level.
    query: l.city === "Denizli" ? `${PRODUCTION_ADDRESS}, ${l.country}` : `${l.city}, ${l.country}`,
    zoom: l.city === "Denizli" ? 15 : l.city === "Florida" || l.city === "Floride" ? 6 : 11,
  }));

  return (
    <>
      {/* ———————————————— intro */}
      <header className="container-x relative isolate pb-14 pt-[calc(var(--nav-h)+5rem)] md:pb-20 md:pt-[calc(var(--nav-h)+8rem)]">
        <Glow className="-top-[var(--nav-h)]" />
        <Tag>{dict.nav.contact}</Tag>
        <SplitText as="h1" trigger="mount" lines={[c.title]} className="display mt-6 text-fluid-hero" />
        <Reveal>
          <p className="mt-8 max-w-3xl text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.55] text-bone">{c.intro}</p>
          <p className="eyebrow mt-6 flex items-center gap-2 text-ash">
            <span aria-hidden className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
            </span>
            {c.hours}
          </p>
        </Reveal>
      </header>

      {/* ———————————————— channels: four large cards that fill red on hover */}
      <section className="container-x pb-20 md:pb-28" aria-label={c.channels}>
        <Reveal as="ul" stagger={0.07} className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ label, value, href, Icon, external }) => (
            <li key={label} className="bg-ink">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group relative isolate flex h-full flex-col justify-between gap-12 overflow-hidden p-7 md:p-9"
              >
                <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full border border-line text-brand transition-colors duration-500 group-hover:border-white/40 group-hover:text-white">
                    <Icon width={20} height={20} />
                  </span>
                  <span aria-hidden className="text-xl text-ash transition-[color,transform] duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white">
                    ↗
                  </span>
                </span>
                <span>
                  <span className="eyebrow block text-ash transition-colors duration-500 group-hover:text-white/80">{label}</span>
                  <span className="mt-3 block break-words text-[clamp(1.15rem,1.5vw,1.45rem)] font-medium tracking-[-0.01em] text-bone transition-colors duration-500 group-hover:text-white">
                    {value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>

        {/* Office inboxes: small, two columns, under the cards */}
        {copy.mailboxes?.length > 0 && (
          <Reveal className="mt-8 border-t border-line pt-6 md:mt-10">
            <p className="eyebrow flex items-center gap-3 text-ash">
              <MailIcon width={14} height={14} className="text-brand" />
              {copy.mailboxesTitle}
            </p>
            {/* Columns sized to their content so the three groups sit close together */}
            <ul className="mt-4 grid w-fit gap-x-14 gap-y-2.5 sm:grid-cols-[repeat(2,auto)] lg:grid-cols-[repeat(3,auto)]">
              {copy.mailboxes.map((m) => (
                <li key={m.email} className="flex items-baseline gap-2 text-sm">
                  <span className="shrink-0 font-semibold uppercase tracking-[0.06em] text-bone">{m.label}:</span>
                  <a href={`mailto:${m.email}`} className="truncate text-mist transition-colors hover:text-brand">
                    {m.email}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </section>

      {/* ———————————————— form, with address and the next steps beside it */}
      <section className="relative isolate border-t border-line bg-coal py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Tag>{c.form.message}</Tag>
            <h2 className="display mt-6 text-fluid-xl">{c.formTitle}</h2>

            <a href={mapHref} target="_blank" rel="noreferrer" className="group mt-10 flex items-start gap-4 border-t border-line pt-8">
              <PinIcon width={22} height={22} className="mt-1 shrink-0 text-brand" />
              <span>
                <span className="eyebrow block text-ash">{c.address}</span>
                <span className="mt-2 block text-[clamp(1.1rem,1.4vw,1.35rem)] leading-snug text-bone transition-colors duration-500 group-hover:text-brand">
                  {address}
                </span>
              </span>
            </a>

            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow text-ash">{copy.stepsTitle}</p>
              <Reveal as="ol" stagger={0.08} className="relative mt-6 space-y-6 border-l border-line pl-7">
                {copy.steps.map((s) => (
                  <li key={s} className="relative text-base leading-relaxed text-bone/85 md:text-lg">
                    <span aria-hidden className="absolute -left-7 top-[0.6em] block size-2.5 -translate-x-1/2 rounded-full bg-brand" />
                    {s}
                  </li>
                ))}
              </Reveal>
            </div>
          </div>

          <Reveal className="lg:col-span-7">
            <div className="relative border border-line bg-ink p-6 sm:p-8 md:p-12">
              <span aria-hidden className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-brand via-brand/40 to-transparent" />
              <Suspense>
                <ContactForm lang={lang} labels={c.form} products={productNames} fabrics={fabricSubjects} />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ———————————————— locations */}
      <section className="relative isolate overflow-hidden border-t border-line bg-ink py-20 md:py-28">
        <div className="container-x">
          <Tag>{c.locationsEyebrow}</Tag>
          <SplitText lines={[c.locationsTitle]} className="display mt-6 text-fluid-xl" />
          <div className="mt-12 md:mt-16">
            <LocationsMap locations={locations} lang={lang} openInMaps={c.openInMaps} />
          </div>
        </div>
      </section>

      <JsonLdScript
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl(localePath(lang, "/contact")),
            mainEntity: {
              "@type": "Organization",
              name: "YEG Textile",
              email: contact.email,
              telephone: contact.phone,
              address: { "@type": "PostalAddress", streetAddress: address, addressCountry: "TR" },
              contactPoint: [{ "@type": "ContactPoint", telephone: contact.phone, contactType: "sales", availableLanguage: ["English", "Turkish", "French"] }],
            },
          },
          breadcrumbSchema([
            { name: dict.nav.home, url: localePath(lang, "/") },
            { name: dict.nav.contact, url: localePath(lang, "/contact") },
          ]),
        ]}
      />
    </>
  );
}
