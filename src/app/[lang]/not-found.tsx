import Link from "next/link";
import { Glow } from "@/components/site/Glow";

// not-found receives no params; every language is shown.
export default function NotFound() {
  return (
    <section className="container-x relative isolate flex min-h-[100svh] flex-col justify-center pt-[var(--nav-h)]">
      <Glow at="bottom" />
      <p className="display text-[clamp(5rem,16vw,14rem)] leading-[0.8] text-brand">404</p>
      <h1 className="display mt-8 text-fluid-xl">
        Page not found
        <span className="block text-ash">Sayfa bulunamadı</span>
        <span className="block text-ash/60">Page introuvable</span>
      </h1>
      <div className="eyebrow mt-12 flex flex-wrap gap-8">
        <Link href="/" className="link-line after:bg-brand">
          Back to home
        </Link>
        <Link href="/tr" className="link-line text-ash after:bg-brand">
          Ana sayfaya dön
        </Link>
        <Link href="/fr" className="link-line text-ash after:bg-brand">
          Retour à l’accueil
        </Link>
      </div>
    </section>
  );
}
