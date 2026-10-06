import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/brand/Logo";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logout } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();
  const unread = await db.contactMessage.count({ where: { isRead: false } });

  return (
    <div className="min-h-dvh">
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-line bg-ink/95 px-4 backdrop-blur lg:px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo wordmark={false} className="w-8" monogramClassName="text-brand" />
          <span className="eyebrow text-ash">Yönetim</span>
        </Link>
        <div className="mr-20 flex items-center gap-4 text-sm lg:mr-0">
          <Link href="/" target="_blank" className="hidden text-mist hover:text-bone sm:inline">
            Siteyi görüntüle ↗
          </Link>
          <span className="hidden text-ash md:inline">{session.email}</span>
          <form action={logout}>
            <button type="submit" className="admin-btn">
              Çıkış
            </button>
          </form>
        </div>
      </header>
      <AdminNav unread={unread} />
      <main className="px-4 pb-24 pt-20 lg:ml-60 lg:px-10">{children}</main>
    </div>
  );
}
