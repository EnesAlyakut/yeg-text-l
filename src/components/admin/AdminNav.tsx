"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ADMIN_GROUPS } from "./admin-links";
import { QuickSearch } from "./QuickSearch";

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      <button type="button" className="admin-btn fixed right-4 top-3 z-50 lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "Kapat" : "Menü"}
      </button>
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 overflow-y-auto border-r border-line bg-ink px-4 pb-8 pt-20 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <QuickSearch onNavigate={() => setOpen(false)} />
        {ADMIN_GROUPS.map((g) => (
          <div key={g.title} className="mb-6">
            <p className="eyebrow mb-2 px-3 text-[0.6rem] text-ash/70">{g.title}</p>
            <ul className="space-y-0.5">
              {g.items
                .filter((item) => item.menu !== false)
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active(item.href) ? "bg-smoke text-bone shadow-[inset_2px_0_0_#d80000]" : "text-mist hover:bg-graphite hover:text-bone",
                      )}
                    >
                      <span aria-hidden className={cn("w-4 text-center text-xs", active(item.href) ? "text-brand" : "text-ash")}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.href === "/admin/messages" && unread > 0 && <span className="rounded-full bg-brand px-1.5 text-[0.65rem] text-white">{unread}</span>}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
