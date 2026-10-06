"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import type { ActionState } from "@/lib/admin";

type Props = {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  aside?: ReactNode;
};

/** Wraps an admin form: pending state, inline success/error message and Ctrl/Cmd+S to save. */
export function FormShell({ action, children, submitLabel = "Kaydet", aside }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        ref.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form ref={ref} action={formAction} className="space-y-6">
      {children}
      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-4 border-t border-line bg-coal/95 px-4 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <div className="text-sm">
          {state.error && <span className="text-brand">{state.error}</span>}
          {state.ok && <span className="text-green-400">{state.message ?? "Kaydedildi."}</span>}
          {!state.error && !state.ok && <span className="text-ash">Kaydetmek için Ctrl + S</span>}
        </div>
        <div className="flex items-center gap-2">
          {aside}
          <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
            {pending ? "Kaydediliyor…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
