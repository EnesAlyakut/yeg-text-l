# Yayına alma kontrol listesi — YEG Textile

## 1. Sunucuda gerekli ayarlar (`.env`)

| Değişken | Ne işe yarar | Örnek |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sitenin gerçek adresi. Site haritası, Google'daki bağlantılar ve paylaşım görselleri bunu kullanır. **Yoksa yayın derlemesi bilerek durur.** | `https://www.yegtextile.com` |
| `DATABASE_URL` | PostgreSQL bağlantısı. Tüm içerik, ayarlar ve görseller burada. | `postgresql://kullanici:sifre@sunucu:5432/yeg?schema=public` |
| `AUTH_SECRET` | Admin girişini imzalar. Uzun ve rastgele olmalı. **Yoksa admin çalışmaz.** | `openssl rand -base64 48` çıktısı |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Sadece boş veritabanı kurulurken ilk admin hesabı için. | — |

## 2. Veritabanını taşıma

Bu bilgisayardaki veritabanında tüm içerik ve görseller var. Sunucuya taşımak için:

```bash
npm run db:backup
```

Çıkan `backups/yeg-....dump` dosyasını sunucudaki PostgreSQL'e geri yükleyin:

```bash
pg_restore -d "$DATABASE_URL" --clean --if-exists --no-owner backups/<dosya>.dump
```

## 3. Derleme ve çalıştırma

```bash
npm ci
npm run build
npm run start
```

## 4. Yayından hemen sonra

- Admin → **Ayarlar → Şifre değiştir**: varsayılan admin şifresini mutlaka değiştirin.
- Admin → **Ayarlar**: telefon, WhatsApp ve e-posta bilgilerinin gerçek olduğunu kontrol edin (şu an örnek numaralar var: `+90 212 000 00 00`, `+90 500 000 00 00`).
- `https://alanadiniz/sitemap.xml` adresinin gerçek alan adını gösterdiğini kontrol edin.
- Google Search Console'a site haritasını ekleyin.
