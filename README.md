# YEG Textile — Ürün vitrini & yönetim paneli

Premium, görsel ağırlıklı ürün vitrini (online satış yok) + yönetim paneli.
Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · GSAP ScrollTrigger · Lenis · Framer Motion · PostgreSQL · Prisma 6.

## Hızlı başlangıç (yerel)

```bash
npm install
npm run db:up        # docker compose ile PostgreSQL 17 (localhost:5433)
npm run db:setup     # şema + örnek içerik + tüm görsellerin veritabanına aktarımı
npm run dev
```

Yerelde `.env` dosyası olmadan çalışır: `src/lib/env.ts` geliştirme ortamında docker-compose veritabanını ve geçici bir oturum anahtarını kullanır. Production'da bu varsayılanlar **devre dışıdır**.

- Site: http://localhost:3000 (İngilizce) · http://localhost:3000/tr (Türkçe)
- Admin: http://localhost:3000/admin — ilk hesap `db:seed` ile oluşturulur (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`; verilmezse `prisma/seed.ts` içindeki geliştirme varsayılanı). **İlk girişten sonra Ayarlar → Şifre değiştir.**

## Ortam değişkenleri (production)

`.env` dosyasını kendiniz oluşturun:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/yeg?schema=public"
AUTH_SECRET="<en az 32 karakter rastgele değer>"
NEXT_PUBLIC_SITE_URL="https://www.alanadiniz.com"
SEED_ADMIN_EMAIL="admin@alanadiniz.com"
SEED_ADMIN_PASSWORD="<güçlü şifre>"
```

`AUTH_SECRET` üretmek için: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

## Veritabanı

**Her şey PostgreSQL'de durur:** ürünler, koleksiyonlar, kategoriler, blog, ana sayfa içerikleri, ayarlar, mesajlar, kullanıcılar **ve tüm görsel/video dosyalarının kendisi** (`MediaAsset.data`).

- Marka görselleri `/media/*`, admin yüklemeleri `/uploads/*` adresinden doğrudan veritabanından sunulur (uzun süreli önbellek + AVIF/WebP optimizasyonu).
- Admin'den eklenen her yeni kayıt ve görsel otomatik olarak veritabanına yazılır; sunucuda ayrı bir dosya klasörü gerekmez.
- `npm run db:backup` → `backups/` altına tek dosyalık tam yedek (görseller dahil).
  Geri yükleme: `docker exec -i yeg-postgres pg_restore -U yeg -d yeg --clean --if-exists < backups/<dosya>.dump`
- `npm run db:studio` → tabloları tarayıcıda görüntüleme/düzenleme (Prisma Studio).

## Marka paketi (ZIP) → site

`brand-source/` (git dışı) ZIP'in açılmış halidir. `npm run assets` görselleri optimize edip `brand-media/` altına yazar, `src/data/media-manifest.json` (boyut + blur) üretir ve hepsini veritabanına aktarır (`npm run media:import`).

| ZIP klasörü | Kullanım |
| --- | --- |
| `logo/SVG` | Navbar, footer, loader, favicon — path'ler birebir `src/components/brand/logo-paths.ts` |
| Logo rengi `#D80000` | Tek vurgu rengi (`--color-brand`) |
| `katalog pdf foto` (LOFIBUY ürün listesi) | 26 ürünün ana görseli (5 mükerrer sayfa elendi) |
| `AI foto/Gemini_*` | Kampanya/galeri görselleri, ilgili ürünlerle eşleştirildi |
| `4x/Artboard 39, 41, 43, 48` | Hero, tam ekran scroll bölümü, vitrin, hakkımızda |
| `4x/Artboard 1, 35, 38, 46, 54, 42` | Kırmızı dalga / partikül dokuları |

Üçüncü taraf marka görselleri (Levi's × Denim Tears, Cole Buxton, `still_here_01`, `img_3767`, Cole Buxton tabelalı `Artboard 47`) moodboard olarak değerlendirildi ve **kullanılmadı**.

> Katalog fotoğrafları 480×720 px. Tasarım bunları asla büyütmez (düşük çözünürlüklü görseller küçük slotlara, yüksek çözünürlüklüler geniş alanlara otomatik yerleşir). Orijinal yüksek çözünürlüklü çekimler admin'den yüklendiğinde site otomatik olarak onları tercih eder.

## Mimari

```
src/
  app/[lang]/…          Site (en = kök, tr = /tr) — proxy.ts yönlendirir
  app/admin/…           Yönetim paneli (ayrı root layout, JWT oturum)
  app/api/admin/…       Görsel/video yükleme, medya kütüphanesi
  app/uploads/[...path] Yüklenen dosyaları servis eder
  components/home       Ana sayfa bölümleri (GSAP/ScrollTrigger)
  components/motion     Lenis, cursor, reveal, parallax
  components/admin      Form alanları: galeri, odak noktası, pick-list…
  i18n/                 Sözlükler (EN/TR)
  lib/                  db, auth, queries, seo, uploads
prisma/schema.prisma    User, Product, ProductImage, Category, Collection, Blog, BlogCategory,
                        HomepageSection, Setting, MediaAsset, ContactMessage
```

- Sayfalar statik üretilir ve 1 saatte bir yenilenir; admin'deki her kayıt tüm siteyi anında yeniler.
- SEO: sayfa başı title/description/OpenGraph/canonical/hreflang, Product · Article · Breadcrumb · Organization schema, `sitemap.xml`, `robots.txt`.
- Erişilebilirlik: `prefers-reduced-motion` tüm animasyonları kapatır; cursor sadece fare olan cihazlarda.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build && npm start` | Production |
| `npm run typecheck` / `npm run lint` | Kontroller |
| `npm run db:studio` | Prisma Studio |
| `npm run assets` | Marka paketini yeniden işle ve veritabanına aktar |
| `npm run db:backup` | Tam veritabanı yedeği (görseller dahil) |
