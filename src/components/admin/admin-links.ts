/**
 * Every place in the admin, in one list: the side menu, the dashboard shortcuts and the quick search (Ctrl + K)
 * are all built from this, so they never drift apart.
 */
export type AdminLink = {
  href: string;
  label: string;
  /** One line shown on the dashboard and in search */
  hint: string;
  icon: string;
  /** Extra words the quick search should match */
  keywords?: string;
  /** Hidden from the side menu (still on the dashboard and in search) */
  menu?: false;
};
export type AdminGroup = { title: string; items: AdminLink[] };

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    title: "Genel",
    items: [
      { href: "/admin", label: "Dashboard", hint: "Genel bakış ve kısayollar", icon: "◧", keywords: "ana panel özet" },
      { href: "/admin/homepage", label: "Ana Sayfa", hint: "Hero, kayan yazı, vitrin, lookbook, banner", icon: "⌂", keywords: "hero manifesto marquee vitrin showcase lookbook banner bant" },
      { href: "/admin/messages", label: "Mesajlar", hint: "İletişim formundan gelen talepler", icon: "✉", keywords: "form iletişim talep" },
    ],
  },
  {
    title: "Sayfalar",
    items: [
      { href: "/admin/pages/about", label: "Hakkımızda", hint: "Tüm bölümler, sertifikalar, lokasyonlar, görseller", icon: "◎", keywords: "biz kimiz hikaye marka kalite sertifika iso global gelecek" },
      { href: "/admin/pages/production", label: "Üretim", hint: "Rakamlar, üretim aşamaları, görseller", icon: "⚙", keywords: "kesim dikim kalite adres" },
      { href: "/admin/pages/fabrics", label: "Kumaşlar", hint: "Kumaş ekle/sil, görseller, malzemeler, detay sayfaları", icon: "▦", keywords: "kumaş detay malzeme desen" },
      { href: "/admin/pages/contact", label: "İletişim", hint: "İletişim sayfası metinleri ve adımlar", icon: "☏", keywords: "iletişim adım" },
      { href: "/admin/pages/sustainability", label: "Sürdürülebilirlik", hint: "Metin, görsel ve yayın durumu", icon: "❦", keywords: "çevre yayın" },
      { href: "/admin/pages/fabric-details", label: "Kumaş detay metinleri", hint: "Detay sayfası etiketleri (Kumaşlar ekranında da var)", icon: "▤", keywords: "etiket", menu: false },
    ],
  },
  {
    title: "Katalog",
    items: [
      { href: "/admin/products", label: "Ürünler", hint: "Ürünler, fiyatlar, görseller", icon: "◇", keywords: "ürün fiyat stok" },
      { href: "/admin/products/new", label: "Yeni ürün", hint: "Kataloğa ürün ekle", icon: "+", menu: false },
      { href: "/admin/collections", label: "Koleksiyonlar", hint: "Koleksiyonlar ve sıralama", icon: "▣", keywords: "sezon" },
      { href: "/admin/categories", label: "Kategoriler", hint: "Ürün kategorileri", icon: "≡" },
    ],
  },
  {
    title: "Blog",
    items: [
      { href: "/admin/blog", label: "Yazılar", hint: "Blog yazıları", icon: "✎", keywords: "blog haber" },
      { href: "/admin/blog/new", label: "Yeni yazı", hint: "Blog'a yazı ekle", icon: "+", menu: false },
      { href: "/admin/blog-categories", label: "Blog Kategorileri", hint: "Yazı kategorileri", icon: "≡" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/media", label: "Medya", hint: "Tüm görseller ve videolar, yükleme", icon: "▧", keywords: "görsel resim fotoğraf video yükle" },
      { href: "/admin/settings", label: "Ayarlar", hint: "Telefon, e-posta, adres, sosyal medya, SEO", icon: "⚑", keywords: "telefon whatsapp instagram adres seo" },
    ],
  },
];

export const ALL_ADMIN_LINKS = ADMIN_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));

/** Which admin screen edits a given public page (path without the language prefix). */
export function adminHrefForPath(path: string): string {
  const p = path.replace(/^\/(tr|fr)(?=\/|$)/, "") || "/";
  if (p === "/") return "/admin/homepage";
  if (p.startsWith("/about")) return "/admin/pages/about";
  if (p.startsWith("/production")) return "/admin/pages/production";
  if (p.startsWith("/fabrics")) return "/admin/pages/fabrics";
  if (p.startsWith("/contact")) return "/admin/pages/contact";
  if (p.startsWith("/sustainability")) return "/admin/pages/sustainability";
  if (p.startsWith("/products")) return "/admin/products";
  if (p.startsWith("/collections")) return "/admin/collections";
  if (p.startsWith("/blog")) return "/admin/blog";
  return "/admin";
}
