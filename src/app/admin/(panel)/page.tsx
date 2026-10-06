import Link from "next/link";
import { ADMIN_GROUPS } from "@/components/admin/admin-links";
import { LinkButton, PageTitle, Stat } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const [products, published, blogs, collections, unread, latestProducts, latestPosts, latestMessages] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { published: true } }),
    db.blog.count(),
    db.collection.count(),
    db.contactMessage.count({ where: { isRead: false } }),
    db.product.findMany({ orderBy: { updatedAt: "desc" }, take: 6, include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 }, collection: true } }),
    db.blog.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <>
      <PageTitle
        title="Dashboard"
        description="YEG Textile yönetim paneli — sitedeki her şey buradan düzenlenir."
        actions={
          <>
            <LinkButton href="/admin/products/new" primary>
              + Ürün
            </LinkButton>
            <LinkButton href="/admin/blog/new">+ Yazı</LinkButton>
            <LinkButton href="/admin/media">+ Görsel yükle</LinkButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label={`Toplam ürün (${published} yayında)`} value={products} href="/admin/products" />
        <Stat label="Koleksiyon" value={collections} href="/admin/collections" />
        <Stat label="Blog yazısı" value={blogs} href="/admin/blog" />
        <Stat label="Okunmamış mesaj" value={unread} href="/admin/messages" />
      </div>

      {/* Every editable area, one click away */}
      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold">
          Ne düzenlemek istiyorsunuz? <span className="font-normal text-ash">— ya da her yerden Ctrl + K ile arayın</span>
        </h2>
        <div className="space-y-6">
          {ADMIN_GROUPS.map((g) => (
            <div key={g.title}>
              <p className="eyebrow mb-2 text-[0.6rem] text-ash/70">{g.title}</p>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {g.items
                  .filter((i) => i.href !== "/admin")
                  .map((i) => (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        className="group flex h-full items-start gap-3 rounded-xl border border-line bg-coal/60 p-4 transition-colors hover:border-brand/60 hover:bg-brand/5"
                      >
                        <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink text-base text-brand">
                          {i.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 text-sm font-medium text-bone">
                            {i.label}
                            {i.href === "/admin/messages" && unread > 0 && <span className="rounded-full bg-brand px-1.5 text-[0.65rem] text-white">{unread}</span>}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-ash">{i.hint}</span>
                        </span>
                        <span aria-hidden className="ml-auto text-ash transition-transform group-hover:translate-x-0.5 group-hover:text-brand">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="admin-card">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Son güncellenen ürünler</h2>
            <Link href="/admin/products" className="text-xs text-ash hover:text-bone">
              Tümü →
            </Link>
          </header>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6 xl:grid-cols-3 2xl:grid-cols-6">
            {latestProducts.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/products/${p.id}`} className="group block">
                  <div className="aspect-[2/3] overflow-hidden rounded-md bg-ink">
                    {p.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                      <img src={p.images[0].url} alt="" className="h-full w-full object-cover transition group-hover:scale-105" style={{ objectPosition: p.images[0].objectPosition }} />
                    )}
                  </div>
                  <p className="mt-2 truncate text-xs group-hover:text-brand">{p.nameTr}</p>
                  <p className="truncate text-[0.65rem] text-ash">{p.collection?.nameTr}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="admin-card">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Son blog yazıları</h2>
              <Link href="/admin/blog" className="text-xs text-ash hover:text-bone">
                Tümü →
              </Link>
            </header>
            <ul className="divide-y divide-line text-sm">
              {latestPosts.map((b) => (
                <li key={b.id} className="flex justify-between gap-4 py-2">
                  <Link href={`/admin/blog/${b.id}`} className="truncate hover:text-brand">
                    {b.titleTr}
                  </Link>
                  <span className="shrink-0 text-xs text-ash">{formatDate(b.publishedAt, "tr")}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="admin-card">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Son mesajlar</h2>
              <Link href="/admin/messages" className="text-xs text-ash hover:text-bone">
                Tümü →
              </Link>
            </header>
            {latestMessages.length === 0 ? (
              <p className="text-sm text-ash">Henüz mesaj yok.</p>
            ) : (
              <ul className="divide-y divide-line text-sm">
                {latestMessages.map((m) => (
                  <li key={m.id} className="py-2">
                    <p className="flex justify-between gap-4">
                      <span className={m.isRead ? "" : "font-semibold"}>{m.name}</span>
                      <span className="text-xs text-ash">{formatDate(m.createdAt, "tr")}</span>
                    </p>
                    <p className="truncate text-xs text-ash">{m.subject || m.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
