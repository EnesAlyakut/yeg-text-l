"use client";

import { useTransition } from "react";

/** Confirms, then calls a bound server action. */
export function DeleteButton({ action, label = "Sil", confirmText = "Bu kayıt kalıcı olarak silinecek. Emin misiniz?" }: { action: () => Promise<unknown>; label?: string; confirmText?: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="admin-btn admin-btn--danger"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) start(async () => void (await action()));
      }}
    >
      {pending ? "Siliniyor…" : label}
    </button>
  );
}
