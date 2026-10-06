"use client";

import { useTransition } from "react";
import { deleteMedia } from "./actions";

export function DeleteMedia({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-[0.7rem] text-ash hover:text-brand"
      onClick={() => {
        if (!window.confirm("Görsel kalıcı olarak silinsin mi?")) return;
        start(async () => {
          const res = await deleteMedia(id);
          if (res?.error) window.alert(res.error);
        });
      }}
    >
      {pending ? "…" : "Sil"}
    </button>
  );
}
