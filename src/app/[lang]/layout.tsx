import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Cursor } from "@/components/motion/Cursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AdminEditButton } from "@/components/site/AdminEditButton";
import { Footer } from "@/components/site/Footer";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { Navbar } from "@/components/site/Navbar";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSettings } from "@/lib/queries";
import { organizationSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-bebas", display: "swap" });
const inter = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.title, template: "%s — YEG TEXTILE" },
    description: dict.meta.description,
    applicationName: "YEG TEXTILE",
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const { contact } = await getSettings();

  return (
    <html lang={lang} className={`${bebas.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-ink text-bone">
        <div className="loader" aria-hidden>
          <Logo className="loader__logo" monogramClassName="text-brand" wordmarkClassName="text-bone" />
          <div className="loader__bar" />
        </div>
        <a href="#main" className="eyebrow sr-only z-[60] bg-brand px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <SmoothScroll>
          <Navbar lang={lang} nav={dict.nav} contact={{ email: contact.email, instagram: contact.instagram }} />
          <main id="main">{children}</main>
          <Footer lang={lang} dict={dict} contact={contact} />
          <AdminEditButton />
        </SmoothScroll>
        <Cursor />
        <JsonLdScript data={organizationSchema(contact)} />
      </body>
    </html>
  );
}
