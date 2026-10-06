"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { adminHrefForPath } from "@/components/admin/admin-links";

/**
 * Floating "edit this page" shortcut, only for someone signed in to the admin
 * (read from a harmless hint cookie set at login; the admin itself still checks the real session).
 */
export function AdminEditButton() {
  const pathname = usePathname();
  const show = useSyncExternalStore(
    () => () => {},
    () => document.cookie.split("; ").includes("yeg_admin_hint=1"),
    () => false,
  );
  if (!show) return null;

  return (
    <a
      href={adminHrefForPath(pathname)}
      className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full border border-white/15 bg-ink/90 px-4 py-2.5 text-sm text-bone shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur transition-colors hover:border-brand hover:bg-brand"
    >
      <span aria-hidden>✎</span> Bu sayfayı düzenle
    </a>
  );
}
